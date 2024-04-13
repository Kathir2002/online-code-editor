import express from "express";
import cors from "cors";
import { config } from "dotenv";
config();
import { connectMongoDB } from "./src/lib/dbConnect";
import cookieParser from "cookie-parser";
import { compilerRouter } from "./src/routes/compilerRouter";
import { authRouter } from "./src/routes/authRoutes";
import MongoStore from "connect-mongo";
import session from "express-session";
import passport from "passport";
import morgan from "morgan";
import "./src/passport/googlePassport";

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

// required for passport session
app.use(
  session({
    secret: "secrettexthere",
    saveUninitialized: true,
    resave: true,
    store: new MongoStore({
      mongoUrl: process.env.MONGO_CONNECT_URI!,
      collectionName: "sessions",
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/compiler", compilerRouter);
app.use("/api/auth", authRouter);

connectMongoDB();

app.listen(5000, () => {
  console.log("server connected to Port : 5000");
});
