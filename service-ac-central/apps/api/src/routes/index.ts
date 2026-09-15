import { Router } from "express";
import authRoutes from "./auth.routes";
import serviceRoutes from "./service.routes";
import pricePackageRoutes from "./pricePackage.routes";
import portfolioRoutes from "./portfolio.routes";
import teamRoutes from "./team.routes";
import locationRoutes from "./location.routes";
import testimonialRoutes from "./testimonial.routes";
import faqRoutes from "./faq.routes";
import contactRoutes from "./contact.routes";
import settingsRoutes from "./settings.routes";
import uploadRoutes from "./upload.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/services", serviceRoutes);
router.use("/packages", pricePackageRoutes);
router.use("/portfolio", portfolioRoutes);
router.use("/team", teamRoutes);
router.use("/locations", locationRoutes);
router.use("/testimonials", testimonialRoutes);
router.use("/faqs", faqRoutes);
router.use("/contact", contactRoutes);
router.use("/settings", settingsRoutes);
router.use("/upload", uploadRoutes);

export default router;
