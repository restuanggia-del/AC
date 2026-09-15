import { Router } from "express";
import { locationController } from "../controllers/location.controller";
import { requireAuth } from "../middlewares/auth";

const router = Router();

router.get("/", locationController.getAll);
router.get("/:id", locationController.getOne);
router.post("/", requireAuth, locationController.create);
router.put("/:id", requireAuth, locationController.update);
router.delete("/:id", requireAuth, locationController.remove);

export default router;
