import { Request, Response } from "express";
import { Code } from "../models/codeModel";

class compiler {
  async saveCode(req: Request, res: Response) {
    try {
      const { fullCode } = req.body;
      const newCode = await Code.create({
        fullCode,
      });
      return res.status(201).json({ url: newCode._id, message: "Saved" });
    } catch (error) {
      return res.status(500).json({ message: "Error in saving code", error });
    }
  }
  async getCode(req: Request, res: Response) {
    try {
      const { urlId } = req.body;
      if (urlId) {
        const existingCode = await Code.findById(urlId);
        if (!existingCode) {
          return res
            .status(404)
            .json({ message: "Code Not Found!", status: false });
        }
        return res
          .status(200)
          .json({ fullCode: existingCode.fullCode, status: true });
      } else {
        return res
          ?.status(422)
          .json({ message: "No ID provided", status: false });
      }
    } catch (error) {
      return res.status(500).json({ message: "Error in saving code", error });
    }
  }
}

const Compiler = new compiler();
export default Compiler;
