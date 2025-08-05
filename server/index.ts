import express from "express";
import cors from "cors";
import { config } from "dotenv";
config();
import { connectMongoDB } from "./src/lib/dbConnect";
import cookieParser from "cookie-parser";
import { compilerRouter } from "./src/routes/compilerRouter";
import { authRouter } from "./src/routes/authRoutes";
import session from "express-session";
import passport from "passport";
import morgan from "morgan";
import "./src/passport/googlePassport";
import "./src/passport/github.auth";

import bodyParser from "body-parser";
import { repoRouter } from "./src/routes/repoRoures";
import { verifyToken } from "./src/middlewares/verifyToken";

const app = express();
app.use(
  cors({
    origin: ["http://localhost:3000", "https://sniplet.netlify.app"],
    credentials: true,
  })
);
// app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app;
app.use(cookieParser());
app.use(morgan("tiny"));

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/compiler", compilerRouter);
app.use("/api/auth", authRouter);
app.use("/api/repo", verifyToken, repoRouter);

app.get("/", async (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

// Handle 404
app.use("*", (req, res) => {
  return res.status(404).json({ error: "Not Found" });
});
connectMongoDB();
const port = process.env.X_ZOHO_CATALYST_LISTEN_PORT || 8000;
app.listen(port, () => {
  console.log(`server connected to Port : ${port}`);
});
