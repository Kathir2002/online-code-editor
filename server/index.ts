import express from "express";
// import cors from "cors";
import { config } from "dotenv";
config();
import { connectMongoDB } from "./lib/dbConnect";
import cookieParser from "cookie-parser";
import path from "path";
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
// app.use(
//   cors({
//     credentials: true,
//     origin: "https://kathir-code-editor.netlify.app",
//   })
// );
const dirname = path.resolve();

app.use(
  session({ secret: "keyboard cat", resave: false, saveUninitialized: false })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/compiler", compilerRouter);
app.use("/api/auth", authRouter);

connectMongoDB();

app.use(express.static(path.join(dirname, "/client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(dirname, "client", "dist", "index.html"));
});

app.listen(5000, () => {
  console.log("server connected to Port : 5000");
});
