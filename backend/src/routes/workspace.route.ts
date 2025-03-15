import { Router } from 'express';
import {
  createWorkSpaceController,
  getAllWorkspacesUserIsMemberController,
  getWorkspaceByIdController,
  getWorkSpaceMembersController,
} from '../controllers/workspace.controller';

const workspaceRoutes = Router();

workspaceRoutes.post('/create/new', createWorkSpaceController);

workspaceRoutes.get('/all', getAllWorkspacesUserIsMemberController);

workspaceRoutes.get('/:id', getWorkspaceByIdController);

workspaceRoutes.get('/members/:id', getWorkSpaceMembersController);

// workspaceRoutes.get('/analytics/:id', getWorkspaceAnalyticsController);

export default workspaceRoutes;

