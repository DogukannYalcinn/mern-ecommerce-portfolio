import { body, param } from "express-validator";

export const createValidationRules = [
  body("total")
    .isFloat({ gt: 0 })
    .withMessage("Total must be a positive number!"),

  body("paymentMethod")
    .isString()
    .notEmpty()
    .withMessage("Payment method is required!"),

  body("isGiftWrap")
    .isBoolean()
    .withMessage("Gift wrap should be boolean!")
    .notEmpty()
    .withMessage("Gift wrap option is required!"),

  body("deliveryMethod")
    .isString()
    .notEmpty()
    .withMessage("Delivery method is required!"),

  body("shippingAddress")
    .isString()
    .notEmpty()
    .withMessage("Shipping address is required!"),
];

export const refundRequestValidationRules = [
  param("id").isMongoId().withMessage("Invalid order ID!"),
  body("reason").notEmpty().withMessage("Cancel reason is required"),
];


export const adminOrderRulesValidationRules =  [
  body("paymentMethods").isArray({ min: 3 }).withMessage("At least 3 payment methods are required"),
  body("paymentMethods.*.label").isString().notEmpty(),
  body("paymentMethods.*.identifier").isString().notEmpty(),
  body("paymentMethods.*.fee").isNumeric(),
  body("paymentMethods.*.description").isString(),

  body("deliveryMethods").isArray({ min: 4 }).withMessage("At least 4 payment methods are required"),
  body("deliveryMethods.*.label").isString().notEmpty(),
  body("deliveryMethods.*.identifier").isString().notEmpty(),
  body("deliveryMethods.*.fee").isNumeric(),
  body("deliveryMethods.*.description").isString(),

  body("giftWrapFee").isNumeric(),
  body("taxRate").isNumeric(),
  body("freeShippingThreshold").isNumeric(),
]