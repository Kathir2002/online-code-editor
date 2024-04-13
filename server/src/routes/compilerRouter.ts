import express from "express";
import Compiler from "../controllers/compilerController";
import { verifyAnonymousToken } from "../middlewares/verifyAnonymousToken";
import { verifyToken } from "../middlewares/verifyToken";

export const compilerRouter = express.Router();

compilerRouter.post("/save", verifyAnonymousToken, Compiler.saveCode);
compilerRouter.get("/my-codes", verifyToken, Compiler.getMyCodes);
compilerRouter.post("/getCode", verifyAnonymousToken, Compiler.getCode);
compilerRouter.delete("/delete/:id", verifyToken, Compiler.deleteCode);
compilerRouter.put("/edit/:id", verifyToken, Compiler.editCode);
compilerRouter.get("/get-all-codes", Compiler.getAllCodes);
