import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { uid } = req.params;
        const user = await prisma.user.findUnique({ where: { uid } });

        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch user" });
    }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, phone, address, profilePic } = req.body;

        const user = await prisma.user.create({
            data: { name, email, phone, address, profilePic },
        });

        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: "Failed to create user" });
    }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { uid } = req.params;
        const { name, email, phone, address, profilePic, isActive } = req.body;

        const updatedUser = await prisma.user.update({
            where: { uid },
            data: { name, email, phone, address, profilePic, isActive },
        });

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: "Failed to update user" });
    }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { uid } = req.params;
        await prisma.user.delete({ where: { uid } });

        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete user" });
    }
};