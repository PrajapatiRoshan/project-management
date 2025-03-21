import { Router } from 'express';
import {
  createTaskController,
  deleteTaskByIdController,
  getAllTasksController,
  getTaskByIdController,
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

taskRoutes.get('/:id/project/:projectId/workspace/:workspaceId', getTaskByIdController);

taskRoutes.delete('/:id/workspace/:workspaceId/delete', deleteTaskByIdController);

export default taskRoutes;

