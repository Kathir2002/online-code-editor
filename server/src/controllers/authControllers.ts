import { Request, Response } from "express";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel";
import { AuthRequest } from "../middlewares/verifyToken";
import { encryptDetails } from "../lib/functions";

class auth {
  async signup(req: Request, res: Response) {
    const { username, email, password } = req.body;
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    try {
      const existingUser = await User.findOne({ email: email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists!" });
      }
      if (!usernameRegex.test(username)) {
        return res
          ?.status(400)
          ?.json({ message: "Some characters are not allowed!" });
      }
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      const user: any = await User.create({
        email: email,
        password: hashedPassword,
        username: username,
      });
      const userData = {
        username: user.username,
        email: user.email,
        picture: user.picture,
        savedCodes: [],
      };
      return res.status(200).json({
        user: userData,
        status: true,
        message: "Account created successfully!",
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error signing up!", error: error });
    }
  }

  async login(req: Request, res: Response) {
    const { userId, password }: { userId: string; password: string } = req.body;

    try {
      const existingUser = await User.findOne({ email: userId });

      if (!existingUser) {
        return res.status(400).json({ message: "User not found" });
      }
      if (existingUser && !existingUser.password) {
        return res?.status(400).json({
          message:
            'Please login to your account with "Continue With Google" option',
        });
      }

      const passwordMatched = await bcrypt.compare(
        password,
        existingUser.password
      );

      if (!passwordMatched) {
        return res.status(400).json({ message: "Invalid password" });
      }

      const jwtToken = jwt.sign(
        {
          _id: existingUser._id,
          email: existingUser.email,
        },
        process.env.JWT_KEY as string,
      );

      const userData = {
        username: existingUser?.username,
        email: existingUser?.email,
        picture: existingUser?.picture,
        savedCodes: existingUser?.savedCodes,
        profileUrl: existingUser?.profileUrl,
        isFromGithub: existingUser?.isFromGithub,      
        repoName: existingUser?.repoName,
        repoOwner: existingUser?.repoOwner,
      };
      const encryptedToken = encryptDetails(jwtToken);
      return res
        .status(200)
        // .cookie("token", encryptedToken, {
        //   path: "/",
        //   expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
        //   sameSite: "none",
        //   secure: true,
        // })
        ?.cookie("token", encryptedToken, {
          path: "/",
          maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
          sameSite: "none",
          secure: true,
          httpOnly: true, // strongly recommended for security
        })
        .json({ user: userData, token: jwtToken, status: true });
    } catch (error) {
      return res.status(500).json({ message: "Error log in!", error: error });
    }
  }
  async userDetails(req: AuthRequest, res: Response) {
    const userId = req._id;    
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "No user found" });
      }
      
      const userData = {
        username: user.username,
        email: user.email,
        picture: user.picture,
        savedCodes: user.savedCodes,
        profileUrl: user.profileUrl,
        isFromGithub: user.isFromGithub,      
        repoName: user.repoName,
        repoOwner: user.repoOwner,
      }
      res.status(200).json({ user: userData, status: true });
    } catch (error) {
      res.status(500).json({ message: "Can't fetch user details" });
    }
  }
}

const Auth = new auth();

export default Auth;
