import { Router } from "express";
import { portfolioController } from "../controllers/portfolio.controller";
import { requireAuth } from "../middlewares/auth";

const router = Router();

router.get("/", portfolioController.getAll);
router.get("/:id", portfolioController.getOne);
router.post("/", requireAuth, portfolioController.create);
router.put("/:id", requireAuth, portfolioController.update);
router.delete("/:id", requireAuth, portfolioController.remove);

export default router;
