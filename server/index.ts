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
import bodyParser from "body-parser";

const app = express();
app.use(
  cors({
    origin: "https://kathir-code-editor.netlify.app",
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

connectMongoDB();
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`server connected to Port : ${port}`);
});
