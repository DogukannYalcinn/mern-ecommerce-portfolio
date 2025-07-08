import express from "express";
import verifyJWT from "../middleware/verify.jwt";
import verifyAdminJWT from "../middleware/verify.admin.jwt";
import * as orderController from "../controller/order.controller";
import * as orderValidator from "../validations/order.validator";

const router = express.Router();
//USER
router.post(
  "/",
  verifyJWT,
  orderValidator.createValidationRules,
  orderController.createOrder,
);
router.get("/my-orders", verifyJWT, orderController.getUserOrders);

router.get("/my-orders/:id", verifyJWT, orderController.getOrderById);

router.patch(
  "/:id/refund",
  verifyJWT,
  orderValidator.refundRequestValidationRules,
  orderController.requestRefund,
);
//ADMIN
router.get("/", verifyAdminJWT, orderController.getAllOrders);
router.patch("/:id/status", verifyAdminJWT, orderController.updateOrderStatus);
router.get("/:id", verifyAdminJWT, orderController.getOrderById);
export default router;
