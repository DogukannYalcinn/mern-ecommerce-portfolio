import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import ContactForm from "../models/contact.form";
import User, { IPaymentMethod, IUser } from "../models/user";
import { signAccessToken, signRefreshToken } from "../utils/sign.tokens";
import { AuthRequest } from "../constants";
import Product from "../models/product";
import Review from "../models/review";
import Order from "../models/order";
import Notification from "../models/notification";

export const submitContactForm = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullName, email, subject, message } = req.body;

  try {
    await ContactForm.create({ fullName, email, subject, message });
    res
      .status(201)
      .json({ message: "ContactPage form submitted successfully." });
  } catch (err) {
    next(err);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req);
  const email = req.body.email;
  const password = req.body.password;
  const cookies = req.cookies;

  if (!errors.isEmpty()) {
    return res.status(422).json({ validationErrors: errors.array() });
  }
  try {
    const existUser = await User.findOne({ email });

    if (!existUser) {
      return res.status(422).json({
        message: "User does not exist",
        field: "email",
      });
    }

    const isMatch = await bcrypt.compare(password, existUser.password);

    if (!isMatch)
      return res.status(422).json({
        message: "Invalid credentials",
        field: "password",
      });

    const accessToken = signAccessToken(existUser._id as string);
    const newRefreshToken = signRefreshToken(existUser._id as string);
    let newRefreshTokenArray = !cookies?.jwt
      ? existUser.refreshTokens
      : existUser.refreshTokens.filter((rt) => rt !== cookies.jwt);

    if (cookies?.jwt) {
      const refreshToken = cookies.jwt;
      const foundToken = await User.findOne({ refreshToken });

      if (!foundToken) {
        newRefreshTokenArray = [];
      }
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
    }

    existUser.refreshTokens = [...newRefreshTokenArray, newRefreshToken].slice(
      -5,
    );
    await existUser.save();
    res.cookie("jwt", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({
      accessToken,
      user: {
        _id: existUser._id,
        firstName: existUser.firstName,
        lastName: existUser.lastName,
        email: existUser.email,
        phoneNumber: existUser.phoneNumber,
        deliveryAddress: existUser.deliveryAddress,
        homeAddress: existUser.homeAddress,
        cart: existUser.cart,
        favorites: existUser.favorites,
        paymentMethods: existUser.paymentMethods,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const logoutUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204);

  const refreshToken = cookies.jwt;
  res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });

  try {
    const existUser = await User.findOne({ refreshTokens: refreshToken });
    if (!existUser) return res.sendStatus(204);

    const newRefreshTokenArray = existUser.refreshTokens.filter(
      (rt) => rt !== refreshToken,
    );

    existUser.refreshTokens = newRefreshTokenArray.slice(-5);
    await existUser.save();

    res.status(200).json({ message: "Logout success" });
  } catch (err) {
    next(err);
  }
};

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
    homeAddress,
    deliveryAddress,
  } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ validationMessage: errors.array() });
  }

  try {
    const existUser = await User.findOne({ email });

    if (existUser) {
      return res.sendStatus(409); // Conflict: Email already exists
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      password: hashedPassword,
      homeAddress,
      deliveryAddress,
    });

    res.status(201).json({
      user: {
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        phoneNumber: newUser.phoneNumber,
        homeAddress: newUser.homeAddress,
        deliveryAddress: newUser.deliveryAddress,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const refreshAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;

  try {
    const existUser = await User.findOne<IUser>({
      refreshTokens: refreshToken,
    });

    if (!existUser) return res.sendStatus(401);

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string,
      async (err: any) => {
        if (err) {
          return res.sendStatus(401);
        }
        const accessToken = signAccessToken(existUser._id as string);
        // const accessToken = jwt.sign(
        //     {
        //         UserInfo: {
        //             id:existUser._id,
        //         },
        //     },
        //     process.env.ACCESS_TOKEN_SECRET as string,
        //     { expiresIn: "15m" },
        // );
        //
        // const newRefreshToken = jwt.sign(
        //     {
        //         UserInfo: {
        //             id :existUser._id
        //         },
        //     },
        //     process.env.REFRESH_TOKEN_SECRET as string,
        //     { expiresIn: "1d" },
        // );
        // res.cookie("jwt", refreshToken, {
        //   httpOnly: true,
        //   sameSite: "none",
        //   secure: true,
        //   maxAge: 24 * 60 * 60 * 1000,
        // });
        res.status(200).json({ accessToken });
      },
    );
  } catch (err) {
    next(err);
  }
};

export const checkSession = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;

  try {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string,
      async (err: any) => {
        if (err) {
          return res.sendStatus(401);
        }

        const existUser = await User.findOne<IUser>({
          refreshTokens: refreshToken,
        }).exec();

        if (!existUser) return res.sendStatus(403);

        const accessToken = signAccessToken(existUser._id as string);

        return res.status(200).json({
          accessToken,
          user: {
            _id: existUser._id,
            firstName: existUser.firstName,
            lastName: existUser.lastName,
            email: existUser.email,
            phoneNumber: existUser.phoneNumber,
            deliveryAddress: existUser.deliveryAddress,
            homeAddress: existUser.homeAddress,
            cart: existUser.cart,
            favorites: existUser.favorites,
            paymentMethods: existUser.paymentMethods,
          },
        });
      },
    );
  } catch (err) {
    next(err);
  }
};

export const getUserCart = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const authenticatedUserId = req.authenticatedUserId;

  try {
    const user: IUser = await User.findById(authenticatedUserId).select("cart");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ cart: user.cart });
  } catch (err) {
    next(err);
  }
};

export const updateUserCart = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const { cart } = req.body;
  const authenticatedUserId = req.authenticatedUserId;

  try {
    const user = await User.findByIdAndUpdate(
      authenticatedUserId,
      { cart },
      { new: true, runValidators: true },
    );
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    return res.status(200).json(user.cart);
  } catch (err) {
    next(err);
  }
};

export const updateUserProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    homeAddress,
    deliveryAddress,
  } = req.body;
  const userId = req.authenticatedUserId;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ validationErrors: errors.array() });
  }

  try {
    const user: IUser = await User.findById(userId).select([
      "firstName",
      "lastName",
      "homeAddress",
      "deliveryAddress",
      "email",
      "phoneNumber",
    ]);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.homeAddress = homeAddress;
    user.deliveryAddress = deliveryAddress;
    user.phoneNumber = phoneNumber;
    const updatedUser = await user.save();
    const { ...profileData } = updatedUser.toObject();
    res.status(200).json(profileData);
  } catch (err) {
    next(err);
  }
};

export const submitProductReview = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.authenticatedUserId;
  const userComment: string | null = req.body.comment?.trim() || null;
  const productId: string = req.body.productId;
  const rating = req.body.rating;

  try {
    const product = await Product.findById(productId);
    const user = await User.findById(userId);
    if (!product || !user) return res.sendStatus(400);
    const newReview = await Review.create({
      user: userId,
      product: productId,
      rating: rating,
      comment: userComment,
    });
    res.status(201).json(newReview);
  } catch (err) {
    next(err);
  }
};

export const toggleFavoriteProduct = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.authenticatedUserId;
  const productId = req.body.productId;

  if (!productId) return res.sendStatus(400);

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });
    const isProductInFavorites = user.favorites.includes(productId);

    //New User Favorite Product List(new:true)
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          favorites: isProductInFavorites
            ? user.favorites.filter((id) => id.toString() !== productId)
            : [...user.favorites, productId],
        },
      },
      { new: true },
    );

    if (!updatedUser)
      return res.status(404).json({ message: "User not found after update." });

    res.status(200).json(updatedUser.favorites);
  } catch (error) {
    next(error);
  }
};

export const getUserStats = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.authenticatedUserId;

  try {
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found." });

    const userFavoritesCount = user.favorites.length;
    const userCompletedOrdersCount = await Order.countDocuments({
      userId: userId,
      status: "completed",
    });
    const userCancelledOrdersCount = await Order.countDocuments({
      userId: userId,
      status: "cancelled",
    });
    const userReviewsCount = await Review.countDocuments({ user: userId });

    res.status(200).json({
      favoriteCount: userFavoritesCount,
      reviewCount: userReviewsCount,
      cancelledOrderCount: userCancelledOrdersCount,
      completedOrderCount: userCompletedOrdersCount,
    });
  } catch (err) {
    next(err);
  }
};

export const getUserUnreadNotificationCount = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.query.userId;

  try {
    const filter: any = { isRead: false };

    if (userId) {
      const userExists = await User.exists({ _id: userId });
      if (userExists) {
        filter.$or = [{ user: userId }, { user: null }];
      } else {
        filter.user = null;
      }
    } else {
      filter.user = null;
    }

    const count = await Notification.countDocuments(filter);

    res.status(200).json({ count });
  } catch (err) {
    next(err);
  }
};

export const getUserNotifications = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.query.userId;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  try {
    const filter: any = {};

    if (userId) {
      const userExists = await User.exists({ _id: userId });
      if (userExists) {
        filter.$or = [{ user: userId }, { user: null }];
      } else {
        filter.user = null;
      }
    } else {
      filter.user = null;
    }

    const totalCount = await Notification.countDocuments(filter);

    const notifications = await Notification.find(filter)
      .sort({ user: -1, createdAt: -1, _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select("-__v -updatedAt");

    res.status(200).json({
      notifications,
      totalCount,
    });
  } catch (err) {
    next(err);
  }
};

export const markNotificationsAsRead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.authenticatedUserId;
  const notificationIds: string[] = req.body.ids;

  try {
    const result = await Notification.updateMany(
      {
        _id: { $in: notificationIds },
        user: userId,
      },
      { $set: { isRead: true } },
    );

    res.status(200).json({
      message: `${result.modifiedCount} notifications marked as read`,
    });
  } catch (err) {
    next(err);
  }
};

export const addPaymentMethod = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const method = req.body.method as string;
  const cardNumber = req.body.cardNumber as string;
  const cardHolderName = req.body.cardHolderName as string;
  const paypalEmail = req.body.paypalEmail as string;
  // const { method, cardNumber, cardHolderName, paypalEmail } = req.body ;
  const userId = req.authenticatedUserId;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    let newPaymentMethod: IPaymentMethod;

    if (method === "credit-card") {
      if (!cardNumber || !cardHolderName) {
        return res.status(400).json({ message: "Missing credit card details" });
      }
      const cardMaskNumber =
        cardNumber.slice(0, 4) + " **** **** " + cardNumber.slice(-4);

      newPaymentMethod = {
        paymentMethod: "credit-card",
        cardHolderName,
        cardMaskNumber,
      };
    } else if (method === "paypal") {
      if (!paypalEmail) {
        return res.status(400).json({ message: "PayPal email is required" });
      }

      newPaymentMethod = {
        paymentMethod: "paypal",
        paypalEmail,
      };
    } else {
      return res.status(400).json({ message: "Invalid payment type" });
    }

    user.paymentMethods.push(newPaymentMethod);
    await user.save();

    res.status(201).json(user.paymentMethods);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const deletePaymentMethod = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const method = req.params.method;
  const userId = req.authenticatedUserId;
  if (!method || !["credit-card", "paypal"].includes(method)) {
    return res
      .status(400)
      .json({ message: "Invalid or missing payment method" });
  }
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.paymentMethods = user.paymentMethods.filter(
      (pm) => pm.paymentMethod !== method,
    );

    await user.save();
    res.status(200).json(user.paymentMethods);
  } catch (err) {
    next(err);
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const searchTerm = req.query.searchTerm as string;

  try {
    const query: any = {};
    if (searchTerm) {
      query.$or = [
        { firstName: { $regex: searchTerm, $options: "i" } },
        { lastName: { $regex: searchTerm, $options: "i" } },
        { email: { $regex: searchTerm, $options: "i" } },
      ];
    }

    const totalCount = await User.countDocuments(query);

    const users = await User.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1, _id: -1 })
      .lean();

    res.status(200).json({
      users,
      totalCount,
    });
  } catch (err) {
    next(err);
  }
};
