import { NextFunction, Response } from "express";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { decryptDetails } from "../lib/functions";

export const verifyAnonymousToken = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  if (!req?.headers?.cookie?.includes("token")) {
    return next();
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
