import { NextFunction, Request, Response } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler.middleware';
import {
  createWorkSpaceSchema,
  workspaceIdSchema,
} from '../validation/workspace.validation';
import { HTTPSTATUS } from '../config/http.config';
import {
  createWorkSpaceService,
  getAllWorkspacesUserIsMemberService,
  getWorkspaceByIdService,
  getWorkspaceMembersService,
} from '../services/workspace.service';
import { getMemberRoleWorkspace } from '../services/member.service';
import { Permissions } from '../enums/role.enum';
import { roleGuard } from '../utils/roleGuard';

export const createWorkSpaceController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const body = createWorkSpaceSchema.parse(req.body);
    const userId = req.user?._id;
    const { workspace } = await createWorkSpaceService(userId, body);
    return res.status(HTTPSTATUS.CREATED).json({
      message: 'Workspace create successfully',
      workspace,
    });
  }
);

export const getAllWorkspacesUserIsMemberController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id;
    const { workspaces } = await getAllWorkspacesUserIsMemberService(userId);
    return res.status(HTTPSTATUS.OK).json({
      message: 'User workspace fetched successfully',
      workspaces,
    });
  }
);

export const getWorkspaceByIdController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const workspaceId = workspaceIdSchema.parse(req.params.id);
    const userId = req.user?._id;
    await getMemberRoleWorkspace(userId, workspaceId);
    const { workspace } = await getWorkspaceByIdService(workspaceId);
    return res.status(HTTPSTATUS.OK).json({
      message: 'User workspace fetched successfully',
      workspace,
    });
  }
);

export const getWorkSpaceMembersController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const workspaceId = workspaceIdSchema.parse(req.params.id);
    const userId = req.user?._id;
    const { role } = await getMemberRoleWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.VIEW_ONLY]);
    const { members, roles } = await getWorkspaceMembersService(workspaceId);
    return res.status(HTTPSTATUS.OK).json({
      message: 'Workspace members fetched successfully',
      members,
      roles,
    });
  }
);

