import { Router } from "express";
import { teamController } from "../controllers/team.controller";
import { requireAuth } from "../middlewares/auth";

const router = Router();

router.get("/", teamController.getAll);
router.get("/:id", teamController.getOne);
router.post("/", requireAuth, teamController.create);
router.put("/:id", requireAuth, teamController.update);
router.delete("/:id", requireAuth, teamController.remove);

export default router;
