import { Router } from "express";
import * as contactController from "../controllers/contact.controller";
import { requireAuth } from "../middlewares/auth";

const router = Router();

router.post("/", contactController.submitContact);
router.get("/", requireAuth, contactController.getContacts);
router.put("/:id", requireAuth, contactController.updateContactStatus);
router.delete("/:id", requireAuth, contactController.deleteContact);

export default router;
