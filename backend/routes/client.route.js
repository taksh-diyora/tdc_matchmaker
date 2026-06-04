import express from "express";
import { getClientById, getMyClients, updateClientStage, addNote, getClientNotes } from "../controllers/client.controller.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

router.get("/", isAuthenticated, getMyClients);
router.get("/:id", isAuthenticated, getClientById);
router.patch("/:id/stage", isAuthenticated, updateClientStage);
router.post("/:id/notes", isAuthenticated, addNote);
router.get("/:id/notes", isAuthenticated, getClientNotes);

export default router;