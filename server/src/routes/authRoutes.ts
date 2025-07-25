import express from "express";
import Auth from "../controllers/authControllers";
import passport from "passport";
import jwt from "jsonwebtoken";
import { verifyToken } from "../middlewares/verifyToken";
import { encryptDetails } from "../lib/functions";
export const authRouter = express.Router();

authRouter.get("/user-details", verifyToken, Auth.userDetails);
authRouter.post("/signup", Auth.signup);
authRouter.post("/login", Auth.login);

authRouter.get(
  "/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
    session: true,
  })
);

authRouter.get("/github", passport.authenticate("github"));

authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: process.env.CLIENT_BASE_URL + "/login",
    session: true,
  }),
  function (req: any, res) {
    if (!req.user) {
      console.log("User not found!");
    } else {
      const jwtToken = jwt.sign(
        {
          _id: req.user._id,
          email: req.user.email,
        },
        process.env.JWT_KEY as string,
      );
      const encryptedToken = encryptDetails(jwtToken);
      // Explicitly save the session before redirecting!
      req.session.save(() => {
        res
          ?.cookie("token", encryptedToken, {
            path: "/",
            expires: new Date(Date.now() + 1000 * 60 * 60 * 2),
            sameSite: "none",
            secure: true,
          })
          .redirect(process.env.CLIENT_BASE_URL as string);
      });
    }
  }
);

authRouter.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: process.env.CLIENT_BASE_URL + "/login",
    session: true,
  }),
  function (req:any, res) {    
    if (!req.user) {
      console.log("User not found!");
    } else {
      const jwtToken = jwt.sign(
        {
          _id: req.user._id,
          email: req.user.username,
        },
        process.env.JWT_KEY!,
      );
      const encryptedToken = encryptDetails(jwtToken);
      // Explicitly save the session before redirecting!
      req.session.save(() => {
        // res
        //   ?.cookie("token", encryptedToken, {
        //     path: "/",
        //     expires: new Date(Date.now() + 1000 * 60 * 60 * 2),
        //     sameSite: "none",
        //     secure: true,
        //   })
        res?.cookie("token", encryptedToken, {
          path: "/",
          maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
          sameSite: "none",
          secure: true,
          httpOnly: true, // strongly recommended for security
        }).redirect(process.env.CLIENT_BASE_URL!);
      });
    }
  }
);

authRouter.post("/logout", (req, res) => {
  try {
    res.clearCookie("token", { path: "/", sameSite: "none", secure: true });
    res.clearCookie("connect.sid", {
      path: "/",
      sameSite: "none",
      secure: true,
    });
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
      }
    });

    return res
      .status(200)
      .json({ status: true, message: "Logged out successfully!" });
  } catch (error) {
    return res.status(500).json({ message: "Error logging out!", error });
  }
});
