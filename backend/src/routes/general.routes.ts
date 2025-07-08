import express from "express";
import * as generalController from "../controller/general.controller";

const router = express.Router();

router.get("/announcements", generalController.getActiveAnnouncements);
router.get("/sliders", generalController.getSliders);
router.get("/order-rules", generalController.getOrderRules);
router.get("/most-popular-brands", generalController.getMostPopularBrands);
export default router;
