import express from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { generateIntroEmail } from "../controllers/ai.controller.js";

const router = express.Router();

router.post("/generate-intro-email", isAuthenticated, generateIntroEmail);

export default router;