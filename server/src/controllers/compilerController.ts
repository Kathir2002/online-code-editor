import { Request, Response } from "express";
import { Code } from "../models/codeModel";
import User from "../models/userModel";
import { AuthRequest } from "../middlewares/verifyToken";

interface FullCodeType {
  fullCode: {
    html: string;
    css: string;
    javascript: string;
  };
  title?: string;
}
class compiler {
  async saveCode(req: AuthRequest, res: Response) {
    try {
      const { fullCode, title }: FullCodeType = req.body;
      let ownerName = "Anonymous";
      let user = undefined;
      let ownerInfo = undefined;
      let isAuthenticated = false;

      if (req._id) {
        user = await User.findById(req._id);
        if (!user) return res.status(404).json({ message: "User not found" });
        ownerName = user?.username;
        ownerInfo = user._id;
        isAuthenticated = true;
      }
      if (!fullCode.html || !fullCode.css || !fullCode.javascript)
        return res.status(422).json({ message: "Code can't be blank!" });
      const newCode = await Code.create({
        fullCode,
        ownerName,
        ownerInfo,
        title,
      });
      if (isAuthenticated && user) {
        user?.savedCodes.push(newCode._id);
        await user.save();
      }

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
  async getMyCodes(req: AuthRequest, res: Response) {
    const userId = req._id;

    try {
      const user = await User.findById(userId).populate("savedCodes");
      if (!user) return res.status(404).json({ message: "User not found." });
      return res.status(200).json({ myCodes: user?.savedCodes, status: true });
    } catch (err) {
      res.status(500).json({ message: "Error loading my codes", error: err });
    }
  }
  async getAllCodes(req: Request, res: Response) {
    try {
      const allCodes = await Code.find().sort({ createdAt: -1 });
      return res.status(200).send(allCodes);
    } catch (error) {
      return res.status(500).send({ message: "Error editing code!", error });
    }
  }
}

const Compiler = new compiler();
export default Compiler;
