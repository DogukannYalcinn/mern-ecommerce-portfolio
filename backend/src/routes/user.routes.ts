import { Router } from "express";
import * as userController from "../controller/user.controller";
import * as userValidator from "../validations/user.validator";
import verifyJWT from "../middleware/verify.jwt";
import {
  refreshTokenRateLimiter,
  loginRateLimiter,
} from "../utils/create.rate.limit";
import verifyAdminJWT from "../middleware/verify.admin.jwt";
const router = Router();

router.post(
  "/contact",
  userValidator.contactFormValidationRules,
  userController.submitContactForm,
);

router.post(
  "/login",
  loginRateLimiter,
  userValidator.loginValidationRules,
  userController.loginUser,
);

router.post("/logout", userController.logoutUser);

router.post(
  "/register",
  userValidator.registerValidationRules,
  userController.registerUser,
);

router.put(
  "/",
  verifyJWT,
  userValidator.updateProfileValidationRules,
  userController.updateUserProfile,
);

router.post(
  "/refresh-token",
  refreshTokenRateLimiter,
  userController.refreshAccessToken,
);

router.get("/check-session", userController.checkSession);

router.get("/cart", verifyJWT, userController.getUserCart);

router.put(
  "/cart",
  verifyJWT,
  userValidator.updateCartValidationRules,
  userController.updateUserCart,
);

router.post("/review", verifyJWT, userController.submitProductReview);

router.patch(
  "/toggle-favorite",
  verifyJWT,
  userController.toggleFavoriteProduct,
);

router.get("/stats", verifyJWT, userController.getUserStats);

router.get("/notifications", userController.getUserNotifications);

router.get(
  "/notifications/unread-count",
  userController.getUserUnreadNotificationCount,
);

router.patch(
  "/notifications/read",
  verifyJWT,
  userValidator.notificationsValidationRules,
  userController.markNotificationsAsRead,
);

router.post("/payment-method", verifyJWT, userController.addPaymentMethod);

router.delete(
  "/payment-method/:method",
  verifyJWT,
  userController.deletePaymentMethod,
);

router.get("/", verifyAdminJWT, userController.getAllUsers);

export default router;
