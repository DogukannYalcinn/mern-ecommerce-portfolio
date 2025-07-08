import mongoose from "mongoose";
import { body, param } from "express-validator";
import Product from "../models/product";

export const contactFormValidationRules = [
  body("fullName")
    .trim()
    .notEmpty()
    .withMessage("Full name is required.")
    .isLength({ max: 100 })
    .withMessage("Full name must be under 100 characters."),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Invalid email address."),

  body("subject")
    .trim()
    .notEmpty()
    .withMessage("Subject is required.")
    .isLength({ max: 150 })
    .withMessage("Subject must be under 150 characters."),

  body("message")
    .trim()
    .notEmpty()
    .withMessage("Message is required.")
    .isLength({ max: 2000 })
    .withMessage("Message must be under 2000 characters."),
];

export const loginValidationRules = [
  body("email").isEmail().withMessage("Invalid email address!"),
  body("password").exists().withMessage("Password is required!"),
];

export const registerValidationRules = [
  body("firstName").exists().withMessage("First name is required!"),

  body("lastName").exists().withMessage("Last name is required!"),

  body("email").isEmail().withMessage("Invalid email address!"),

  body("phoneNumber").exists().withMessage("Phone number is required!"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long!"),
  body("confirmPassword")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match!"),

  body("homeAddress.address")
    .notEmpty()
    .withMessage("Home address is required!"),
  body("homeAddress.city").notEmpty().withMessage("Home city is required!"),

  body("homeAddress.postalCode")
    .notEmpty()
    .withMessage("Home postal code is required!"),

  body("deliveryAddress.address")
    .notEmpty()
    .withMessage("Delivery address is required!"),

  body("deliveryAddress.city")
    .notEmpty()
    .withMessage("Delivery city is required!"),

  body("deliveryAddress.postalCode")
    .notEmpty()
    .withMessage("Delivery postal code is required!"),
];

export const notificationsValidationRules = [
  body("ids")
    .isArray({ min: 1 })
    .withMessage("Ids cannot be empty")
    .custom((value: string[]) => {
      const isValid = value.every(
        (id) =>
          typeof id === "string" &&
          mongoose.Types.ObjectId.isValid(id) &&
          new mongoose.Types.ObjectId(id).toString() === id,
      );
      if (!isValid) throw new Error("Invalid notification _id");
      return true;
    }),
];

export const updateCartValidationRules = [
  body("cart")
    .isArray({ min: 1 })
    .withMessage("CartPage must be an array and cannot be empty.")
    .custom((cartItems) => {
      for (const item of cartItems) {
        if (
          !mongoose.Types.ObjectId.isValid(item.product) ||
          typeof item.quantity !== "number" ||
          item.quantity <= 0
        ) {
          throw new Error(
            "Each cart item must be an object with a valid productId and a positive quantity.",
          );
        }
      }
      return true;
    }),

  body("cart.*.product").custom(async (product) => {
    const productExists = await Product.exists({ _id: product });
    if (!productExists) {
      throw new Error(`Invalid productId: ${product}`);
    }
    return true;
  }),
];

export const updateProfileValidationRules = [
  body("firstName").exists().withMessage("firstname is required!"),
  body("lastName").exists().withMessage("lastname is required!"),
  body("email").exists().withMessage("email is required!"),
  body("phoneNumber").exists().withMessage("phoneNumber is required!"),
  body("homeAddress.address")
    .notEmpty()
    .withMessage("Home address is required!"),
  body("homeAddress.city").notEmpty().withMessage("Home city is required!"),
  body("homeAddress.postalCode")
    .notEmpty()
    .withMessage("Home postal code is required!"),
  body("deliveryAddress.address")
    .notEmpty()
    .withMessage("Delivery address is required!"),
  body("deliveryAddress.city")
    .notEmpty()
    .withMessage("Delivery city is required!"),
  body("deliveryAddress.postalCode")
    .notEmpty()
    .withMessage("Delivery postal code is required!"),
];
