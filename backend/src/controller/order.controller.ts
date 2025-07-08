import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import Order from "../models/order";
import User from "../models/user";
import OrderRules from "../models/order.rules";
import { CartItemPopulated } from "../models/cart";
import { AuthRequest } from "../constants";

//USER
export const createOrder = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const { total, shippingAddress, paymentMethod, deliveryMethod, isGiftWrap } =
    req.body;
  const userId = req.authenticatedUserId;
  const SHIPPING_ADDRESS_IDENTIFIERS = ["home", "delivery"];
  const parsedTotal = total ? parseFloat(total) : 0;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await User.findById(userId).populate<{
      cart: CartItemPopulated[];
    }>("cart.product");
    if (!user) return res.status(404).json({ message: "User not found." });

    const orderRules = await OrderRules.findOne();
    if (!orderRules)
      return res.status(500).json({ message: "Admin settings not loaded!" });

    const selectedPaymentMethod = orderRules.paymentMethods.find(
      (method) => method.identifier === paymentMethod,
    );
    if (!selectedPaymentMethod)
      return res.status(400).json({ message: "Invalid payment method!" });

    const selectedDeliveryMethod = orderRules.deliveryMethods.find(
      (method) => method.identifier === deliveryMethod,
    );
    if (!selectedDeliveryMethod)
      return res.status(400).json({ message: "Invalid delivery method!" });

    if (!SHIPPING_ADDRESS_IDENTIFIERS.includes(shippingAddress)) {
      return res.status(400).json({ message: "Invalid shipping address!" });
    }

    let cartTotal = 0;
    let orderOptionsFee = 0;

    user.cart.forEach((item) => {
      if (item.product.discountedPrice && item.product.discountedRatio) {
        cartTotal += item.product.discountedPrice * item.quantity;
      } else {
        cartTotal += item.product.price * item.quantity;
      }
    });

    const freeShippingQualified = cartTotal >= orderRules.freeShippingThreshold;

    if (!freeShippingQualified && deliveryMethod === "free-delivery")
      return res
        .status(400)
        .json({ message: "User is not qualified for free delivery!" });

    orderOptionsFee +=
      selectedPaymentMethod.fee +
      selectedDeliveryMethod.fee +
      (isGiftWrap ? orderRules.giftWrapFee : 0);

    const taxAmountRaw = (cartTotal + orderOptionsFee) * orderRules.taxRate;
    const taxAmount = parseFloat(taxAmountRaw.toFixed(2));

    const calculatedTotalRaw = cartTotal + orderOptionsFee + taxAmount;
    const calculatedTotal = parseFloat(calculatedTotalRaw.toFixed(2));

    const isEqual = Math.abs(calculatedTotal - parsedTotal) < 0.01;
    if (!isEqual) {
      return res.status(400).json({
        message: "Total amount does not match the calculated total!",
        frontTotal: total,
        calculatedTotal,
      });
    }

    const populatedOrderCart = user.cart.map((item) => {
      return {
        product: item.product._id,
        purchasePrice: item.product.discountedPrice
          ? item.product.discountedPrice
          : item.product.price,
        purchaseDiscountRatio: item.product.discountedRatio ?? 0,
        quantity: item.quantity,
      };
    });

    const newOrder = await Order.create({
      user: userId,
      cart: populatedOrderCart,
      total: calculatedTotal,
      shippingAddress:
        shippingAddress === "home" ? user.homeAddress : user.deliveryAddress,
      paymentMethod: selectedPaymentMethod.identifier,
      paymentMethodFee: selectedPaymentMethod.fee,
      deliveryMethod: selectedDeliveryMethod.identifier,
      deliveryMethodFee: selectedDeliveryMethod.fee,
      giftWrapFee: isGiftWrap ? orderRules.giftWrapFee : 0,
    });

    // Clean CartPage
    await User.findByIdAndUpdate(userId, { cart: [] });
    return res.status(201).json(newOrder);
  } catch (err) {
    next(err);
  }
};

export const getUserOrders = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.authenticatedUserId;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 5;
  const status = req.query.status || null;
  const date = req.query.date || null;

  try {
    let filter: any = { user: userId };

    if (status) {
      filter.currentStatus = status;
    }

    if (typeof date === "string" && !isNaN(Date.parse(date))) {
      filter.createdAt = { $gte: new Date(date) };
    }

    const orders = await Order.find(filter)
      .populate({
        path: "cart.product",
        select: "title images",
      })
      .sort({ createdAt: -1, _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    const totalCount = await Order.countDocuments(filter);

    return res.status(200).json({ orders, totalCount });
  } catch (err) {
    next(err);
  }
};

export const requestRefund = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.authenticatedUserId as string;
    const { id } = req.params;
    const { reason } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const order = await Order.findOne({ _id: id, user: userId });
    if (!order) {
      return res.status(404).json({ message: "order not found" });
    }

    if (order.currentStatus !== "pending")
      return res
        .status(400)
        .json({ message: "only pending orders can be cancelled" });

    const isAlreadyCancelled = order.statusHistory.find(
      (history) => history.status === "cancelled",
    );

    if (isAlreadyCancelled)
      return res.status(400).json({ message: "order is already cancelled" });

    order.statusHistory.push({ status: "refund_request" });
    if (reason) {
      order.cancellationReason = reason;
    }
    await order.save();

    return res
      .status(200)
      .json({ message: "your cancellation request has been submitted." });
  } catch (error) {
    next(error);
  }
};

//ADMIN

export const getAllOrders = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const filter = req.query.filter as string;

  const query: any = {};

  switch (filter) {
    case "pending":
    case "completed":
    case "cancelled":
    case "in_transit":
    case "refund_request":
      query.currentStatus = filter;
      break;
    default:
      break;
  }

  try {
    const orders = await Order.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate([
        { path: "cart.product" },
        { path: "user", select: "_id email" },
      ])
      .sort({ createdAt: -1 });

    const totalCount = await Order.countDocuments(query);

    res.status(200).json({ orders, totalCount });
  } catch (err) {
    next(err);
  }
};

export const updateOrderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const orderId = req.params.id;
  const { status } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    order.currentStatus = status;
    order.statusHistory.push({ status });
    await order.save();
    res.json({ message: "Order status updated successfully" });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  try {
    const order = await Order.findById(id).populate([
      { path: "cart.product" },
      { path: "user", select: "_id firstName lastName email" },
    ]);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    next(error);
  }
};
