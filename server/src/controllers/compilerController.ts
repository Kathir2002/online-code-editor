import { Request, Response } from "express";
import { Code } from "../models/codeModel";

class compiler {
  async saveCode(req: Request, res: Response) {
    try {
      const { fullCode } = req.body;
      const newCode = await Code.create({
        fullCode,
      });
      return res.status(201).json({ newCode, status: true });
    } catch (error) {
      return res.status(500).json({ message: "Error in saving code", error });
    }
  }
}

const Compiler = new compiler();
export default Compiler;
