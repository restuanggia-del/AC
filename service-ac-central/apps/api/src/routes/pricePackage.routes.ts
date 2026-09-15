import { Router } from "express";
import { pricePackageController } from "../controllers/pricePackage.controller";
import { requireAuth } from "../middlewares/auth";

const router = Router();

router.get("/", pricePackageController.getAll);
router.get("/:id", pricePackageController.getOne);
router.post("/", requireAuth, pricePackageController.create);
router.put("/:id", requireAuth, pricePackageController.update);
router.delete("/:id", requireAuth, pricePackageController.remove);

export default router;
