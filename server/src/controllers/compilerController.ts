import { Request, Response } from "express";
import { Code } from "../models/codeModel";
import User from "../models/userModel";
import { AuthRequest } from "../middlewares/verifyToken";
import axios from "axios";

interface FullCodeType {
  fullCode: {
    html: string;
    css: string;
    javascript: string;
  }
  javascript: string
  title?: string;
  isCompiler: boolean,
  description?: string,
  filePath?: string
}
class compiler {
  async saveCode(req: AuthRequest, res: Response) {
    try {
      const { fullCode, title, isCompiler, description, filePath, javascript }: FullCodeType = req.body;

      const user = await User.findById(req._id);
      if (!user) return res.status(404).json({ message: "User not found" });

      const isMissingCode = isCompiler
        ? !javascript?.trim()
        : !fullCode?.html?.trim() || !fullCode?.css?.trim() || !fullCode?.javascript?.trim();

      if (isMissingCode) {
        return res.status(422).json({ message: "Code can't be blank!" });
      }
      let response;

      if (isCompiler) {
        if (!user?.isFromGithub) {
          return res?.status(401).json({ message: "You need to login with github to use this feature", success: false })
        }
        if (!user?.repoName) {
          return res.status(400).json({ message: "You need to create repo!" })
        }
        const encodedContent = Buffer.from(javascript).toString('base64');

        let sha: string | undefined = undefined;
        try {
          const existing = await axios.get(`https://api.github.com/repos/${user?.repoOwner}/${user?.repoName?.split(" ").join("-")}/contents/${filePath}`, {
            headers: {
              Authorization: `Bearer ${user?.githubAccessToken}`,
              Accept: 'application/vnd.github+json',
            },
          });

          sha = existing.data.sha;

        } catch (err: any) {
          // File doesn't exist, so we'll create it (ignore 404)
          if (err.response?.status !== 404) throw err;
        }

        // Step 2: Create or update the file
        response = await axios.put(
          `https://api.github.com/repos/${user?.repoOwner}/${user?.repoName?.split(" ").join("-")}/contents/${filePath}`,
          {
            message: description || `Update ${filePath}`,
            content: encodedContent,
            sha: sha, // only needed for updates
          },
          {
            headers: {
              Authorization: `Bearer ${user?.githubAccessToken}`,
              Accept: 'application/vnd.github+json',
            },
          });
      }

      const newCode = await Code.create({
        fullCode: isCompiler ? { javascript } : fullCode,
        ownerName: user?.username,
        ownerInfo: user?._id,
        title,
        filePath: filePath,
        githubFilePath: response?.data?.content?.html_url
      });

      if (user) {
        user?.savedCodes.push(newCode._id);
        await user.save();
      }
      return res.status(201).json({ url: newCode._id, message: "Saved" });
    } catch (error) {
      console.log(error);

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
          .json({
            data: existingCode,
            isOwner, status: true
          });
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

      if (existingCode?.githubFilePath) {
        // Step 1: Get the file SHA
        const fileInfo = await axios.get(`https://api.github.com/repos/${owner?.repoOwner}/${owner?.repoName}/contents/${existingCode?.filePath}`, {
          headers: {
            Authorization: `Bearer ${owner?.githubAccessToken}`,
            Accept: 'application/vnd.github+json',
          },
          params: {
            ref: 'main',
          },
        });

        const sha = fileInfo.data.sha;

        // Step 2: Delete the file
        const response = await axios.delete(`https://api.github.com/repos/${owner?.repoOwner}/${owner?.repoName}/contents/${existingCode?.filePath}`, {
          headers: {
            Authorization: `Bearer ${owner?.githubAccessToken}`,
            Accept: 'application/vnd.github+json',
          },
          data: {
            message: `Delete ${existingCode?.filePath}`,
            sha,
            branch: 'main',
          },
        });
      }

      const deleteCode = await Code.findByIdAndDelete(id);
      // Filter out the code by its ObjectId
      owner.savedCodes = owner.savedCodes?.filter(
        savedCode => savedCode?._id.toString() !== id
      );

      // Save the updated user document
      await owner.save();
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
      const { fullCode, javascript } = req.body;
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

      let response;
      if (existingPost?.githubFilePath) {
        if (existingPost?.githubFilePath ? !javascript : !fullCode) {
          return res.status(422).json({ message: "Code can't be blank!", success: false })
        }
        let sha: string | undefined = undefined;
        const encodedContent = Buffer.from(fullCode).toString('base64');
        try {
          const existing = await axios.get(`https://api.github.com/repos/${owner?.repoOwner}/${owner?.repoName?.split(" ").join("-")}/contents/${existingPost?.filePath}`, {
            headers: {
              Authorization: `Bearer ${owner?.githubAccessToken}`,
              Accept: 'application/vnd.github+json',
            },
          });

          sha = existing.data.sha;

        } catch (err: any) {
          // File doesn't exist, so we'll create it (ignore 404)
          if (err.response?.status !== 404) throw err;
        }

        // Step 2: Create or update the file
        response = await axios.put(
          `https://api.github.com/repos/${owner?.repoOwner}/${owner?.repoName?.split(" ").join("-")}/contents/${existingPost?.filePath}`,
          {
            message: `Updated ${existingPost?.filePath}`,
            content: encodedContent,
            sha: sha, // only needed for updates
          },
          {
            headers: {
              Authorization: `Bearer ${owner?.githubAccessToken}`,
              Accept: 'application/vnd.github+json',
            },
          });
      }
      const editPost = await Code.findByIdAndUpdate(postId, {
        fullCode: existingPost?.githubFilePath ? { javascript } : fullCode,
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
