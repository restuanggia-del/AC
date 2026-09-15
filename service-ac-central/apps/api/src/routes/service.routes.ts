import { Router } from "express";
import { serviceController } from "../controllers/service.controller";
import { requireAuth } from "../middlewares/auth";

const router = Router();

router.get("/", serviceController.getAll);
router.get("/:id", serviceController.getOne);
router.post("/", requireAuth, serviceController.create);
router.put("/:id", requireAuth, serviceController.update);
router.delete("/:id", requireAuth, serviceController.remove);

export default router;
