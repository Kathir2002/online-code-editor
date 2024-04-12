import { NextFunction, Response } from "express";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import User from "../models/userModel";

export const verifyAnonymousToken = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;

  if (req.isAuthenticated()) {
    const user = await User.findOne({ email: req?.user?.email });
    req._id = user?._id;
    next();
    return;
  } else {
    if (!token) {
      return next();
    } else {
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
  }
};
