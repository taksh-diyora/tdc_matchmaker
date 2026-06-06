import express from "express";
import { getClientById, getMyClients, updateClientStage, addNote, getClientNotes, getClientMatches, addClient } from "../controllers/client.controller.js";
import {sendMatch} from "../controllers/match.controller.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

router.post("/add", isAuthenticated, addClient);
router.get("/", isAuthenticated, getMyClients);
router.get("/:id", isAuthenticated, getClientById);
router.patch("/:id/stage", isAuthenticated, updateClientStage);
router.post("/:id/notes", isAuthenticated, addNote);
router.get("/:id/notes", isAuthenticated, getClientNotes);
router.get("/:id/matches", isAuthenticated, getClientMatches);
router.post("/:id/matches/:matchId/send", isAuthenticated, sendMatch);

export default router;