import { Router } from "express";
import * as productController from "../controller/product.controller";
import verifyAdminJWT from "../middleware/verify.admin.jwt";
import * as productValidator from "../validations/product.validator";

const router = Router();

// Public
router.get("/", productController.getProducts);
router.get("/search", productController.getSearchProducts);
router.get("/on-sale", productController.getOnSale);
router.get("/best-sellers", productController.getBestSeller);
router.get("/new-arrivals", productController.getNewArrivals);
router.get("/featured", productController.getFeatured);

router.post(
  "/bulk",
  productValidator.bulkProductIdsValidationRules,
  productController.getProductsByIds,
);
router.get("/:id/reviews", productController.getReviews);
router.get("/:slug", productController.fetchProductBySlug);

//ADMIN
router.post(
  "/",
  verifyAdminJWT,
  productValidator.productValidationRules,
  productController.createProduct,
);

router.put(
  "/:id",
  verifyAdminJWT,
  productValidator.productValidationRules,
  productController.editProduct,
);

router.delete(
  "/:productId/images/:imageId",
  productController.deleteProductImageById,
);

router.delete("/:id", verifyAdminJWT, productController.deleteProduct);

export default router;
