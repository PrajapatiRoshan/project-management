import { Router } from 'express';
import {
  createTaskController,
  getAllTasksController,
  updateTaskController,
} from '../controllers/task.controller';

const taskRoutes = Router();

taskRoutes.post(
  '/projects/:projectId/workspace/:workspaceId/create',
  createTaskController
);

taskRoutes.put(
  '/:id/projects/:projectId/workspace/:workspaceId/update',
  updateTaskController
);

taskRoutes.get('/workspace/:workspaceId/all', getAllTasksController);

export default taskRoutes;

