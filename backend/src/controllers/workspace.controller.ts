// Importing necessary types and modules
import { NextFunction, Request, Response } from 'express'; // Types from Express
import { asyncHandler } from '../middlewares/asyncHandler.middleware'; // Middleware for handling async errors
import {
  createWorkSpaceSchema,
  workspaceIdSchema,
} from '../validation/workspace.validation'; // Schema validation for workspace data
import { HTTPSTATUS } from '../config/http.config'; // HTTP status codes
import {
  createWorkSpaceService,
  getAllWorkspacesUserIsMemberService,
  getWorkspaceByIdService,
  getWorkspaceMembersService,
} from '../services/workspace.service'; // Workspace-related service functions
import { getMemberRoleWorkspace } from '../services/member.service'; // Service to get the role of a member in a workspace
import { Permissions } from '../enums/role.enum'; // Enumeration for role permissions
import { roleGuard } from '../utils/roleGuard'; // Utility function to check role-based permissions

// Controller to create a new workspace
export const createWorkSpaceController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Validate the request body using the schema
    const body = createWorkSpaceSchema.parse(req.body);

    // Extract the user ID from the request object
    const userId = req.user?._id;

    // Call the service to create a workspace
    const { workspace } = await createWorkSpaceService(userId, body);

    // Send a success response with the created workspace data
    return res.status(HTTPSTATUS.CREATED).json({
      message: 'Workspace created successfully',
      workspace,
    });
  }
);

// Controller to get all workspaces the current user is a member of
export const getAllWorkspacesUserIsMemberController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Extract the user ID from the request object
    const userId = req.user?._id;

    // Call the service to get all workspaces where the user is a member
    const { workspaces } = await getAllWorkspacesUserIsMemberService(userId);

    // Send a success response with the list of workspaces
    return res.status(HTTPSTATUS.OK).json({
      message: 'User workspaces fetched successfully',
      workspaces,
    });
  }
);

// Controller to get workspace details by ID
export const getWorkspaceByIdController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Validate the workspace ID from the request parameters
    const workspaceId = workspaceIdSchema.parse(req.params.id);

    // Extract the user ID from the request object
    const userId = req.user?._id;

    // Check the user's role within the workspace to ensure access
    await getMemberRoleWorkspace(userId, workspaceId);

    // Call the service to get workspace details
    const { workspace } = await getWorkspaceByIdService(workspaceId);

    // Send a success response with workspace details
    return res.status(HTTPSTATUS.OK).json({
      message: 'User workspace fetched successfully',
      workspace,
    });
  }
);

// Controller to get all members of a workspace
export const getWorkSpaceMembersController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Validate the workspace ID from the request parameters
    const workspaceId = workspaceIdSchema.parse(req.params.id);

    // Extract the user ID from the request object
    const userId = req.user?._id;

    // Get the user's role within the workspace to check permissions
    const { role } = await getMemberRoleWorkspace(userId, workspaceId);

    // Check if the user has at least VIEW_ONLY permission to view members
    roleGuard(role, [Permissions.VIEW_ONLY]);

    // Call the service to get the list of members and their roles
    const { members, roles } = await getWorkspaceMembersService(workspaceId);

    // Send a success response with the members and their roles
    return res.status(HTTPSTATUS.OK).json({
      message: 'Workspace members fetched successfully',
      members,
      roles,
    });
  }
);

/**
 * Validation:
Uses zod schemas to validate input data from request bodies and parameters.
Asynchronous Handling:
Uses asyncHandler to catch and handle asynchronous errors efficiently.

* Service Usage:
Makes use of various services to handle the actual logic for creating workspaces, retrieving workspaces, and fetching members.

* Role and Permission Check:
Uses getMemberRoleWorkspace to fetch the role of the current user.
Uses roleGuard to enforce permission checks before proceeding.

* Response Handling:
Sends appropriate HTTP status codes (201 for creation and 200 for successful retrieval).
Provides meaningful success messages.
 * 
 */
