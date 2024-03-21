import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectMongoDB } from "./lib/dbConnect";
import { compilerRouter } from "./routes/compilerRouter";
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/compiler", compilerRouter);

connectMongoDB();
app.listen(5000, () => {
  console.log("server connected to Port : 5000");
});
