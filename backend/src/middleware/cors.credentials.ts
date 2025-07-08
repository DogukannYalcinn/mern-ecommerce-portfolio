import { Request, Response, NextFunction } from "express";
import allowedOrigins from "../config/allowed.origins";

const setCorsCredential = (req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Credentials", "true");
  } else if (process.env.NODE_ENV === "development" && !origin) {
    res.header("Access-Control-Allow-Credentials", "true");
  }
  next();
};

export default setCorsCredential;
