import { Router } from "express";
import * as adminValidator from "../validations/admin.validator";
import * as adminController from "../controller/admin.controller";
import { loginRateLimiter } from "../utils/create.rate.limit";
import verifyAdminJWT from "../middleware/verify.admin.jwt";
import { adminOrderRulesValidationRules } from "../validations/order.validator";

const router = Router();

router.get("/contacts", verifyAdminJWT, adminController.getContactForms);

router.get(
  "/contacts/unread",
  verifyAdminJWT,
  adminController.getUnreadContactFormCount,
);

router.patch(
  "/contacts/:id/read",
  verifyAdminJWT,
  adminController.markContactAsRead,
);

router.post(
  "/login",
  loginRateLimiter,
  adminValidator.loginValidationRules,
  adminController.adminLogin,
);

router.post("/logout", verifyAdminJWT, adminController.adminLogout);

router.get("/dashboard", verifyAdminJWT, adminController.getAdminDashboard);

router.get("/slider", verifyAdminJWT, adminController.getSliders);

router.post(
  "/slider",
  verifyAdminJWT,
  adminValidator.sliderValidationRules,
  adminController.createSlider,
);

router.put(
  "/slider/:id",
  verifyAdminJWT,
  adminValidator.sliderValidationRules,
  adminController.editSlider,
);

router.delete("/slider/:id", verifyAdminJWT, adminController.deleteSlider);

router.get("/promo", verifyAdminJWT, adminController.getPromos);

router.post(
  "/promo",
  verifyAdminJWT,
  adminValidator.messageValidationRules,
  adminController.createPromo,
);

router.delete("/promo/:id", verifyAdminJWT, adminController.deletePromo);

router.get("/announcement", verifyAdminJWT, adminController.getAnnouncements);

router.post(
  "/announcement",
  verifyAdminJWT,
  adminValidator.messageValidationRules,
  adminController.createAnnouncement,
);
router.patch(
  "/announcement/:id/toggle",
  verifyAdminJWT,
  adminController.toggleAnnouncement,
);

router.delete(
  "/announcement/:id",
  verifyAdminJWT,
  adminController.deleteAnnouncement,
);

router.put(
  "/order-rules",
  verifyAdminJWT,
  adminOrderRulesValidationRules,
  adminController.editOrderRules,
);

export default router;
