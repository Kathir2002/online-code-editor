// routes/github.ts
import express from 'express';
import axios from 'axios';
import RepoController from '../controllers/repoController';

export const repoRouter = express.Router();

repoRouter.post('/create', RepoController.createRepo);
repoRouter.post('/push-file', RepoController.pushFile);
repoRouter.delete('/delete-file', RepoController.deleteFile);
repoRouter.delete('/delete', RepoController.deleteRepo);

