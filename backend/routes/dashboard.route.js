import express from  "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { getDashboardStats } from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/stats", isAuthenticated, getDashboardStats);

export default router;