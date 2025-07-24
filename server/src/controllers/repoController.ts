import { Response } from "express";
import { AuthRequest } from "../middlewares/verifyToken";
import axios from "axios";
import User from "../models/userModel";

class repoController {
    async createRepo(req: AuthRequest, res: Response) {
        try {
            const { name, description, isPrivate } = req.body;
            const userData = await User.findById(req?._id)
            if (!userData) {
                return res.status(404).json({ message: "User not found!", success: false })
            }
            if (!userData?.isFromGithub) {
                return res?.status(401).json({ message: "You need to login with github to use this feature", success: false })
            }
            if (userData?.repoName === name) {
                return res?.status(422).json({ message: "Repo name already exists", success: false })
            }
            const response = await axios.post('https://api.github.com/user/repos',
                {
                    name,
                    description,
                    private: isPrivate || false,
                    auto_init: true, // creates a README.md
                },
                {
                    headers: {
                        Authorization: `Bearer ${userData?.githubAccessToken}`,
                        'Accept': 'application/vnd.github+json',
                    },
                }
            );
            userData.repoOwner = response?.data?.owner?.login
            userData.repoName = name
            await userData.save()
            return res.status(200).json({ success: true, repo: response.data, message: "Repository created!" });
        } catch (error: any) {
            console.error(error.response?.data || error.message);
            return res.status(500).json({ success: false, error: error.message });
        }
    }
    async pushFile(req: AuthRequest, res: Response) {
        try {
            // Step 1: Check if the file already exists to get its SHA (for updates)
            const { path, content, message } = req.body;
            const userData = await User.findById(req?._id)
            if (!userData) {
                return res.status(404).json({ message: "User not found!", success: false })
            }
            if (!userData?.isFromGithub) {
                return res?.status(401).json({ message: "You need to login with github to use this feature", success: false })
            }
            const encodedContent = Buffer.from(content).toString('base64');

            let sha: string | undefined = undefined;
            try {
                const existing = await axios.get(`https://api.github.com/repos/${userData?.repoOwner}/${userData?.repoName}/contents/${path}`, {
                    headers: {
                        Authorization: `Bearer ${userData?.githubAccessToken}`,
                        Accept: 'application/vnd.github+json',
                    },
                });

                sha = existing.data.sha;
            } catch (err: any) {
                // File doesn't exist, so we'll create it (ignore 404)
                if (err.response?.status !== 404) throw err;
            }

            // Step 2: Create or update the file
            const response = await axios.put(
                `https://api.github.com/repos/${userData?.repoOwner}/${userData?.repoName}/contents/${path}`,
                {
                    message: message || `Update ${path}`,
                    content: encodedContent,
                    sha: sha, // only needed for updates
                },
                {
                    headers: {
                        Authorization: `Bearer ${userData?.githubAccessToken}`,
                        Accept: 'application/vnd.github+json',
                    },
                });

            return res.status(200).json({ success: true, content: response.data.content });
        } catch (error: any) {
            console.error(error.response?.data || error.message);
            return res.status(500).json({ success: false, error: error.message });
        }
    }
    async deleteFile(req: AuthRequest, res: Response) {
        try {
            const { path, message, branch } = req.body;
            const userData = await User.findById(req?._id)
            if (!userData) {
                return res.status(404).json({ message: "User not found!", success: false })
            }
            if (!userData?.isFromGithub) {
                return res?.status(401).json({ message: "You need to login with github to use this feature", success: false })
            }
            // Step 1: Get the file SHA
            const fileInfo = await axios.get(`https://api.github.com/repos/${userData?.repoOwner}/${userData?.repoName}/contents/${path}`, {
                headers: {
                    Authorization: `Bearer ${userData?.githubAccessToken}`,
                    Accept: 'application/vnd.github+json',
                },
                params: {
                    ref: branch || 'main',
                },
            });

            const sha = fileInfo.data.sha;

            // Step 2: Delete the file
            const response = await axios.delete(`https://api.github.com/repos/${userData?.repoOwner}/${userData?.repoName}/contents/${path}`, {
                headers: {
                    Authorization: `Bearer ${userData?.githubAccessToken}`,
                    Accept: 'application/vnd.github+json',
                },
                data: {
                    message: message || `Delete ${path}`,
                    sha,
                    branch: branch || 'main',
                },
            });

            res.status(200).json({ success: true, content: response.data.content });
        } catch (error: any) {
            console.error(error.response?.data || error.message);
            res.status(500).json({ success: false, error: error.message });
        }
    }
    async deleteRepo(req: AuthRequest, res: Response) {
        try {
            const userData = await User.findById(req?._id)
            if (!userData) {
                return res.status(404).json({ message: "User not found!", success: false })
            }
            if (!userData?.isFromGithub) {
                return res?.status(401).json({ message: "You need to login with github to use this feature", success: false })
            }

            const response = await axios.delete(`https://api.github.com/repos/${userData?.repoOwner}/${userData?.repoName}`, {
                headers: {
                    Authorization: `Bearer ${userData?.githubAccessToken}`,
                    Accept: 'application/vnd.github+json',
                },
            });
            userData.repoName = ""
            await userData.save()
            res.status(204).json({ success: true, message: 'Repository deleted' });
        } catch (error: any) {
            console.error(error.response?.data || error.message);
            res.status(error.response?.status || 500).json({
                success: false,
                error: error.response?.data?.message || error.message,
            });
        }

    }
}


const RepoController = new repoController();
export default RepoController;