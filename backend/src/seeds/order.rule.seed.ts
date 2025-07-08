import OrderRules from "../models/order.rules";

const orderRuleSeed = async () => {
  const orderRule = await OrderRules.findOne();
  if (orderRule) return console.log("Order Rule already exists");

  const dummyOrderRules = {
    paymentMethods: [
      {
        label: "Credit Card",
        identifier: "credit-card",
        fee: 0,
        description: "Pay with your credit card",
      },
      {
        label: "Paypal",
        identifier: "paypal",
        fee: 0,
        description: "Secure payment with PayPal",
      },
      {
        label: "Cash On Delivery",
        identifier: "cash-on-delivery",
        fee: 15,
        description: "Pay when your order arrives",
      },
    ],
    deliveryMethods: [
      {
        label: "Fast Delivery",
        identifier: "fast-delivery",
        fee: 25,
        description: "Get your order delivered quickly",
      },
      {
        label: "Free Delivery",
        identifier: "free-delivery",
        fee: 0,
        description: "Enjoy free shipping on your order",
      },
      {
        label: "Standard Delivery",
        identifier: "standard-delivery",
        fee: 20,
        description: "Reliable delivery at an affordable rate",
      },
      {
        label: "Express Delivery",
        identifier: "express-delivery",
        fee: 49,
        description: "Lightning-fast delivery for urgent needs",
      },
    ],
    giftWrapFee: 10,
    taxRate: 0.13,
    freeShippingFee: 5000,
  };
  await OrderRules.create(dummyOrderRules);
  console.log("Order Rule seeded successfully.");
};

export default orderRuleSeed;
