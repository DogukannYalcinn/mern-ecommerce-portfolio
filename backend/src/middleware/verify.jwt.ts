import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../constants";

const verifyJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  const refreshToken = req.cookies.jwt;

  if (
    !authHeader ||
    (typeof authHeader === "string" &&
      authHeader &&
      !authHeader.startsWith("Bearer "))
  ) {
    return res.sendStatus(401);
  }
  const token =
    typeof authHeader === "string" ? authHeader.split(" ")[1] : null;

  if (!token) {
    return res.sendStatus(401);
  }

  if (!refreshToken) return res.sendStatus(401);

  if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error("ACCESS TOKEN SECRET is not defined!");
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(401);
    req.authenticatedUserId = (
      decoded as { UserInfo: { id: string; username: string } }
    ).UserInfo.id;
    next();
  });
};

export default verifyJWT;
