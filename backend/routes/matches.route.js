import express from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
import {
    getMatchHistory
} from "../controllers/match.controller.js";

const router = express.Router();

router.get(
    "/history",
    isAuthenticated,
    getMatchHistory
);

export default router;