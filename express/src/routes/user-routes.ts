import express, { Request, Response } from "express";
import { createUser, deleteUser, getUserById, getUsers, updateUser } from "../controllers/user-controller";

const router = express.Router();

// Route pour récupérer tous les utilisateurs
router.get("/", getUsers);

// Route pour récupérer un utilisateur par son ID
router.get("/:uid", getUserById);

// Route pour créer un nouvel utilisateur
router.post("/", createUser);

// Route pour mettre à jour un utilisateur
router.put("/:uid", updateUser);

// Route pour supprimer un utilisateur
router.delete("/:uid", deleteUser);

export default router;
