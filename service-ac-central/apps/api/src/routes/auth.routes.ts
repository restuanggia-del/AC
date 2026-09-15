import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { requireAuth } from "../middlewares/auth";
import { validateBody } from "../middlewares/validate";
import { loginSchema, refreshSchema, updateProfileSchema } from "../validators/auth.validator";

const router = Router();

router.post("/login", validateBody(loginSchema), authController.login);
router.post("/refresh", validateBody(refreshSchema), authController.refresh);
router.post("/logout", requireAuth, authController.logout);
router.get("/me", requireAuth, authController.me);
router.put("/me", requireAuth, validateBody(updateProfileSchema), authController.updateProfile);

export default router;
