import { NextFunction, Request, Response } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler.middleware';
import {
  createTaskSchema,
  taskIdSchema,
  updateTaskSchema,
} from '../validation/task.validation';
import { projectIdSchema } from '../validation/project.validation';
import { workspaceIdSchema } from '../validation/workspace.validation';
import { getMemberRoleWorkspace } from '../services/member.service';
import { roleGuard } from '../utils/roleGuard';
import { Permissions } from '../enums/role.enum';
import {
  createTaskService,
  deleteTaskByIdService,
  getAllTasksService,
  getTaskByIdService,
  updateTaskService,
} from '../services/task.service';
import { HTTPSTATUS } from '../config/http.config';

export const createTaskController = asyncHandler(
  async (req: Request, res: Response, nex: NextFunction) => {
    const userId = req.user?._id;
    const body = createTaskSchema.parse(req.body);
    const projectId = projectIdSchema.parse(req.params.projectId);
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
    const { role } = await getMemberRoleWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.CREATE_TASK]);
    const { task } = await createTaskService(workspaceId, projectId, userId, body);

    return res.status(HTTPSTATUS.OK).json({
      message: 'Task created successfully',
      task,
    });
  }
);

export const updateTaskController = asyncHandler(
  async (req: Request, res: Response, nex: NextFunction) => {
    const userId = req.user?._id;
    const body = updateTaskSchema.parse(req.body);
    const projectId = projectIdSchema.parse(req.params.projectId);
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
    const taskId = taskIdSchema.parse(req.params.id);
    const { role } = await getMemberRoleWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.EDIT_TASK]);
    const { task } = await updateTaskService(workspaceId, projectId, taskId, body);
    return res.status(HTTPSTATUS.OK).json({
      message: 'Task updated successfully',
      task,
    });
  }
);

export const getAllTasksController = asyncHandler(
  async (req: Request, res: Response, nex: NextFunction) => {
    const userId = req.user?._id;
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);

    const filters = {
      projectId: req.query.projectId
        ? (projectIdSchema?.parse(req.query.projectId) as string)
        : undefined,
      status: req.query.status ? (req.query.status as string)?.split(',') : undefined,
      priority: req.query.priority
        ? (req.query.priority as string)?.split(',')
        : undefined,
      assignedTo: req.query.assignedTo
        ? (req.query.assignedTo as string)?.split(',')
        : undefined,
      dueDate: req.query.dueDate as string | undefined,
      keyword: req.query.keyword as string | undefined,
    };

    const pagination = {
      pageSize: parseInt(req.query.pageSize as string) || 10,
      pageNumber: parseInt(req.query.pageNumber as string) || 1,
      //  sortBy : req.query.sortBy as string
    };

    const { role } = await getMemberRoleWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.VIEW_ONLY]);
    const { tasks, paginaion } = await getAllTasksService(
      workspaceId,
      filters,
      pagination
    );
    return res.status(HTTPSTATUS.OK).json({
      message: 'All Tasks fetched successfully',
      tasks,
      paginaion,
    });
  }
);

export const getTaskByIdController = asyncHandler(
  async (req: Request, res: Response, nex: NextFunction) => {
    const userId = req.user?._id;
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
    const taskId = taskIdSchema.parse(req.params.id);
    const projectId = projectIdSchema.parse(req.params.projectId);
    const { role } = await getMemberRoleWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.VIEW_ONLY]);
    const { task } = await getTaskByIdService(workspaceId, projectId, taskId);
    return res.status(HTTPSTATUS.OK).json({
      message: 'Task fetched successfully',
      task,
    });
  }
);

export const deleteTaskByIdController = asyncHandler(
  async (req: Request, res: Response, nex: NextFunction) => {
    const userId = req.user?._id;
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
    const taskId = taskIdSchema.parse(req.params.id);
    const { role } = await getMemberRoleWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.DELETE_TASK]);
    const { task } = await deleteTaskByIdService(workspaceId, taskId);
    return res.status(HTTPSTATUS.OK).json({
      message: 'Task deleted successfully',
      task,
    });
  }
);
