import { body } from "express-validator";

export const sliderValidationRules = [
  body("title").exists().withMessage("title is required!"),
  body("description").exists().withMessage("description is required!"),
  body("link").exists().withMessage("link is required!"),
  body("subtitle").exists().withMessage("subtitle is required!"),
];

export const loginValidationRules = [
  body("username").exists().withMessage("username is required!"),
  body("password").exists().withMessage("password is required!"),
];

export const messageValidationRules = [
  body("message").notEmpty().withMessage("message is required!"),
];
