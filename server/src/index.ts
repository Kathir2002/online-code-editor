import express from "express";
import cors from "cors";
import { config } from "dotenv";
config();
import { connectMongoDB } from "./lib/dbConnect";
import cookieParser from "cookie-parser";
import { compilerRouter } from "./routes/compilerRouter";
import { authRouter } from "./routes/authRoutes";
import session from "express-session";
import passport from "passport";
import morgan from "morgan";
import "./passport/googlePassport";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(morgan("tiny"));
app.use(
  cors({
    credentials: true,
    origin: "https://kathir-code-editor.netlify.app",
  })
);

app.use(
  session({ secret: "keyboard cat", resave: false, saveUninitialized: false })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/compiler", compilerRouter);
app.use("/api/auth", authRouter);

connectMongoDB();

app.listen(5000, () => {
  console.log("server connected to Port : 5000");
});
