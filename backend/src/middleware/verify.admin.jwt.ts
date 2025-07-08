import {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";

const verifyAdminJWT = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt;

    if (!token) {
        return res.sendStatus(401);
    }

    if (!process.env.ACCESS_TOKEN_SECRET) {
        throw new Error("ACCESS TOKEN SECRET is not defined!");
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err:any, decoded:any) => {
        console.log("verifying... token ....");
        if (err) return res.sendStatus(401);
        next();
    });
};

export default verifyAdminJWT;
