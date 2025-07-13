import { NextFunction, Request, Response } from "express";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { decryptDetails } from "../lib/functions";

export interface AuthRequest extends Request {
  _id?: string;
}

export const verifyToken = async (
  req: any,
  res: Response,
  next: NextFunction
) => {  
  if (!req?.headers?.cookie?.includes("token")) {
    return res.status(401).send({ message: "You are unauthorized." });
  } else {
    const encryptedTokenString = req.headers.cookie.match(/token=([^;]*)/)[1];

    // Decoding URI component
    const encryptedToken = decodeURIComponent(encryptedTokenString);

    const token: string = decryptDetails(encryptedToken)!;

    jwt.verify(
      token,
      process.env.JWT_KEY!,
      (err: JsonWebTokenError | null, data: any) => {
        if (err) {
          return res.status(401).send({ message: "You are unauthorized." });
        }
        req._id = data._id;
        next();
      }
    );
  }
};
