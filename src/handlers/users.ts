import express, { Request, Response } from "express";
import { User, UserStore } from "../models/user";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { verifyAuthToken } from "../middleware/auth";

dotenv.config();

const store = new UserStore();

// Get all users
const index = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await store.index();
    res.json(users);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

// Get user by ID
const show = async (_req: Request, res: Response): Promise<void> => {
  try {
    const user = await store.show(_req.params.id);
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

// Create new user (sign up)
const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const user: User = {
      username: req.body.username,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      password: req.body.password,
    };

    if (!user.username || !user.firstname || !user.lastname || !user.password) {
      res.status(400).json({
        error:
          "Missing required fields: username, firstname, lastname, password",
      });
      return;
    }

    const newUser = await store.create(user);

    if (!process.env.TOKEN_SECRET) {
      res
        .status(500)
        .json({ error: "Server misconfiguration: TOKEN_SECRET is missing" });
      return;
    }

    const token = jwt.sign(
      { user: newUser },
      process.env.TOKEN_SECRET as string
    );
    res.json({ token, user: newUser });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

// Authenticate user (login)
const authenticate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ error: "Username and password are required" });
      return;
    }

    const user = await store.authenticate(username, password);

    if (user === null) {
      res.status(401).json({ error: "Invalid username or password" });
      return;
    }

    if (!process.env.TOKEN_SECRET) {
      res
        .status(500)
        .json({ error: "Server misconfiguration: TOKEN_SECRET is missing" });
      return;
    }
    const token = jwt.sign({ user }, process.env.TOKEN_SECRET as string);
    res.json({ token, user });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

const usersRoutes = (app: express.Application): void => {
  app.get("/users", verifyAuthToken, index);
  app.get("/users/:id", verifyAuthToken, show);
  app.post("/users", create);
  app.post("/users/authenticate", authenticate);
};

export default usersRoutes;
