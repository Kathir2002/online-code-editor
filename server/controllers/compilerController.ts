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
  async getCode(req: AuthRequest, res: Response) {
    try {
      const { urlId } = req.body;
      const userId = req._id;
      let isOwner = false;
      if (urlId) {
        const existingCode = await Code.findById(urlId);
        if (!existingCode) {
          return res
            .status(404)
            .json({ message: "Code Not Found!", status: false });
        }
        const user = await User.findById(userId);
        if (user?.username === existingCode.ownerName) {
          isOwner = true;
        }
        return res
          .status(200)
          .json({ fullCode: existingCode.fullCode, isOwner, status: true });
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
      const user = await User.findById(userId).populate({
        path: "savedCodes",
        options: { sort: { createdAt: -1 } },
      });
      if (!user) return res.status(404).json({ message: "User not found." });
      return res.status(200).json({ myCodes: user?.savedCodes, status: true });
    } catch (err) {
      res.status(500).json({ message: "Error loading my codes", error: err });
    }
  }
  async getAllCodes(req: Request, res: Response) {
    try {
      const allCodes = await Code.find().sort({ createdAt: -1 });
      return res.status(200).json(allCodes);
    } catch (error) {
      return res.status(500).json({ message: "Error geting code!", error });
    }
  }

  async deleteCode(req: AuthRequest, res: Response) {
    try {
      const userId = req._id;
      const { id } = req.params;
      const owner = await User.findById(userId);
      if (!owner) {
        return res
          .status(404)
          .json({ message: "Can't find the owner profile" });
      }
      const existingCode = await Code.findById(id);
      if (!existingCode) {
        return res.status(404).json({ message: "Code not found!" });
      }
      if (existingCode.ownerName !== owner.username) {
        return res.status(400).json({
          message: "You can only delete your own code!",
          status: false,
        });
      }
      const deleteCode = await Code.findByIdAndDelete(id);
      if (deleteCode) {
        return res
          .status(200)
          .json({ message: "Code deleted successfully!", status: true });
      } else {
        return res
          .status(200)
          .json({ message: "Code not found!", status: false });
      }
    } catch (error) {
      return res.status(500).send({ message: "Error deleting code!", error });
    }
  }

  async editCode(req: AuthRequest, res: Response) {
    try {
      const userId = req._id;
      const postId = req.params.id;
      const owner = await User.findById(userId);
      const { fullCode } = req.body;
      if (!owner) {
        return res.status(404).json({ message: "Can't find owner!" });
      }
      const existingPost = await Code.findById(postId);
      if (!existingPost) {
        return res.status(404).json({ message: "Can't find post to edit!" });
      }
      if (existingPost.ownerName !== owner.username) {
        return res
          .status(400)
          .json({ message: "You can only edit your own code!" });
      }
      const editPost = await Code.findByIdAndUpdate(postId, {
        fullCode: fullCode,
      });
      if (editPost) {
        return res
          .status(200)
          .json({ message: "Code updated successfully!", status: true });
      } else {
        return res
          .status(200)
          .json({ message: "Failed to update the code!", status: false });
      }
    } catch (error) {
      return res.status(500).send({ message: "Error editing code!", error });
    }
  }
}

const Compiler = new compiler();
export default Compiler;
