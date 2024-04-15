import express from "express";
import Auth from "../controllers/authControllers";
import passport from "passport";
import { verifyToken } from "../middlewares/verifyToken";
export const authRouter = express.Router();

authRouter.get("/user-details", verifyToken, Auth.userDetails);
authRouter.post("/signup", Auth.signup);
authRouter.post("/login", Auth.login);

authRouter.get(
  "/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
    prompt: "consent",
    session: true,
  })
);

authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: process.env.CLIENT_BASE_URL + "/login",
    session: true,
  }),
  function (req, res) {
    if (!req.user) {
      console.log("User not found!");
    } else {
      // Explicitly save the session before redirecting!
      req.session.save(() => {
        res.redirect(process.env.CLIENT_BASE_URL as string);
      });
    }
  }
);

authRouter.post("/logout", (req, res) => {
  try {
    res.clearCookie("token", { path: "/", sameSite: "none", secure: true });
    res.clearCookie("connect.sid");
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
