import jwt from "jsonwebtoken";
import "dotenv/config";
import { NextFunction, Request, Response } from "express";

function auth(req: Request, res: Response, next: NextFunction) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied. No token found.");

  try {
    const decoded = jwt.verify(token, process.env.JwtPrivateKey!);
    req.body.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send("Invalid Token");
  }
}

export default auth;
