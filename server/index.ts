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

const app = express();
app.use(
  cors({
    origin: ["https://kathir-code-editor.netlify.app", "http://localhost:3000"],
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
app.use("/.well-known/assetlinks.json", (req, res) => {
  res.status(200).json([
    {
      relation: ["delegate_permission/common.handle_all_urls"],
      target: {
        namespace: "android_app",
        package_name: "com.expensetracker",
        sha256_cert_fingerprints: [
          "FA:C6:17:45:DC:09:03:78:6F:B9:ED:E6:2A:96:2B:39:9F:73:48:F0:BB:6F:89:9B:83:32:66:75:91:03:3B:9C",
        ],
      },
    },
    {
      relation: ["delegate_permission/common.get_login_creds"],
      target: {
        namespace: "web",
        site: "https://montra.com",
      },
    },
    {
      relation: ["delegate_permission/common.get_login_creds"],
      target: {
        namespace: "android_app",
        package_name: "com.expensetracker",
        sha256_cert_fingerprints: [
          "FA:C6:17:45:DC:09:03:78:6F:B9:ED:E6:2A:96:2B:39:9F:73:48:F0:BB:6F:89:9B:83:32:66:75:91:03:3B:9C",
        ],
      },
    },
  ]);
});

connectMongoDB();
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`server connected to Port : ${port}`);
});
