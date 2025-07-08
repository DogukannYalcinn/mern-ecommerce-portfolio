import express from "express";
import * as categoryController from "../controller/category.controller";
import { body } from "express-validator";
import { deleteCategory } from "../controller/category.controller";
import verifyAdminJWT from "../middleware/verify.admin.jwt";

const router = express.Router();
//PUBLIC
router.get("/", categoryController.getCategories);

//ADMIN
router.post(
  "/",
  verifyAdminJWT,
  [body("name").notEmpty().withMessage("Category name is required!")],
  categoryController.createCategory,
);

router.put(
  "/:id",
  verifyAdminJWT,
  [body("name").notEmpty().withMessage("Category name is required!")],
  categoryController.editCategory,
);

router.delete("/:id", verifyAdminJWT, deleteCategory);
export default router;
