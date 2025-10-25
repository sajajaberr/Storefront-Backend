import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const { TOKEN_SECRET } = process.env;

export const verifyAuthToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      res.status(401).json({ error: "Access denied. No token provided." });
      return;
    }

    const token = authorizationHeader.split(" ")[1];

    if (!token) {
      res.status(401).json({ error: "Access denied. Invalid token format." });
      return;
    }

    const decoded = jwt.verify(token, TOKEN_SECRET as string);
    (req as any).user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
    return;
  }
};
