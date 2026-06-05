import express from "express";
import { getClientById, getMyClients, updateClientStage, addNote, getClientNotes, getClientMatches, revealContactInfo } from "../controllers/client.controller.js";
import {sendMatch} from "../controllers/match.controller.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

router.get("/", isAuthenticated, getMyClients);
router.get("/:id", isAuthenticated, getClientById);
router.patch("/:id/stage", isAuthenticated, updateClientStage);
router.post("/:id/notes", isAuthenticated, addNote);
router.get("/:id/notes", isAuthenticated, getClientNotes);
router.get("/:id/matches", isAuthenticated, getClientMatches);
router.post("/:id/matches/:matchId/send", isAuthenticated, sendMatch);
router.get("/:id/contact-reveal", isAuthenticated, revealContactInfo);

export default router;