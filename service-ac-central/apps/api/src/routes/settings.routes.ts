import { Router } from "express";
import * as settingsController from "../controllers/settings.controller";
import { requireAuth } from "../middlewares/auth";

const router = Router();

router.get("/", settingsController.getSettings);
router.put("/", requireAuth, settingsController.updateSettings);

export default router;
