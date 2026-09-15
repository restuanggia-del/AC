import { Router } from "express";
import { testimonialController } from "../controllers/testimonial.controller";
import { requireAuth } from "../middlewares/auth";

const router = Router();

router.get("/", testimonialController.getAll);
router.get("/:id", testimonialController.getOne);
router.post("/", testimonialController.create); // publik boleh submit testimoni, admin yang approve
router.put("/:id", requireAuth, testimonialController.update);
router.delete("/:id", requireAuth, testimonialController.remove);

export default router;
