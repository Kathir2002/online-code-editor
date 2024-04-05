import express from "express";
import Compiler from "../controllers/compilerController";
import { verifyAnonymousToken } from "../middlewares/verifyAnonymousToken";
import { verifyToken } from "../middlewares/verifyToken";

export const compilerRouter = express.Router();

compilerRouter.post("/save", verifyAnonymousToken, Compiler.saveCode);
compilerRouter.get("/my-codes", verifyToken, Compiler.getMyCodes);
compilerRouter.post("/getCode", Compiler.getCode);
