import { Router } from 'express';
import {
  createProjectController,
  deleteProjectByIdAndWorkspaceIdController,
  getAllProjectsWorkspaceController,
  getProjectAnalyticsController,
  getProjectByIdAndWorkspaceIdController,
  updateProjectByIdAndWorkspaceIdController,
} from '../controllers/project.controller';

const projectRoutes = Router();

projectRoutes.post('/workspace/:workspaceId/create', createProjectController);

projectRoutes.get('/workspace/:workspaceId/all', getAllProjectsWorkspaceController);

projectRoutes.get('/:id/workspace/:workspaceId', getProjectByIdAndWorkspaceIdController);

projectRoutes.get('/:id/workspace/:workspaceId/analytics', getProjectAnalyticsController);

projectRoutes.put(
  '/:id/workspace/:workspaceId/update',
  updateProjectByIdAndWorkspaceIdController
);

projectRoutes.delete(
  '/:id/workspace/:workspaceId/delete',
  deleteProjectByIdAndWorkspaceIdController
);

export default projectRoutes;

