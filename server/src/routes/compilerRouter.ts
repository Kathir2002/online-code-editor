import express from "express";
import Compiler from "../controllers/compilerController";

export const compilerRouter = express.Router();

compilerRouter.post("/save", Compiler.saveCode);
compilerRouter.post("/getCode", Compiler.getCode);
