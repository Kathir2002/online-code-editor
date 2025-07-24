import express from "express";
import Compiler from "../controllers/compilerController";
import { verifyToken } from "../middlewares/verifyToken";

export const compilerRouter = express.Router();

compilerRouter.post("/save", verifyToken, Compiler.saveCode);
compilerRouter.get("/my-codes", verifyToken, Compiler.getMyCodes);
compilerRouter.post("/getCode", Compiler.getCode);
compilerRouter.delete("/delete/:id", verifyToken, Compiler.deleteCode);
compilerRouter.put("/edit/:id", verifyToken, Compiler.editCode);
