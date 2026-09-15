import { Router } from "express";
import { faqController } from "../controllers/faq.controller";
import { requireAuth } from "../middlewares/auth";

const router = Router();

router.get("/", faqController.getAll);
router.get("/:id", faqController.getOne);
router.post("/", requireAuth, faqController.create);
router.put("/:id", requireAuth, faqController.update);
router.delete("/:id", requireAuth, faqController.remove);

export default router;
