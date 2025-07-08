import mongoose from "mongoose";
import { body } from "express-validator";

export const productValidationRules = [
  body("title")
    .exists()
    .withMessage("Title is required!")
    .isLength({ min: 6 })
    .withMessage("Title must be at least 6 characters long!"),

  body("price").exists().withMessage("Price is required!"),
  body("stock").exists().withMessage("Stock is required!"),
  body("description").exists().withMessage("Description is required!"),
  body("brand").exists().withMessage("Brand is required!"),
  body("categorySlugs").exists().withMessage("Category slug is required!"),
  body("discountedRatio")
    .optional()
    .isNumeric()
    .withMessage("Discount ratio must be a number between 0 and 100.")
    .bail()
    .custom((value) => Number(value) > 0 && Number(value) < 100)
    .withMessage("Discount ratio must be greater than 0 and less than 100."),
  body("tags")
    .custom((value) => {
      if (!value || typeof value !== "string") return false;
      const tags = value
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "");
      return tags.length > 0;
    })
    .withMessage("At least one tag is required"),
];

export const bulkProductIdsValidationRules = [
  body("productIds")
    .isArray({ min: 1 })
    .withMessage("productIds must be a non-empty array."),
  body("productIds.*")
    .custom((id) => mongoose.Types.ObjectId.isValid(id))
    .withMessage("All productIds must be valid Mongo ObjectIds."),
];
