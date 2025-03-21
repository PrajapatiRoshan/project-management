import { TaskPriorityEnum, TaskStatusEnum } from '../enums/task.enum';
import MemberModel from '../models/member.model';
import ProjectModel from '../models/project.model';
import TaskModel from '../models/task.model';
import WorkspaceModel from '../models/workspace.model';
import { BadRequestException, NotFoundException } from '../utils/appError';

export const createTaskService = async (
  workspaceId: string,
  projectId: string,
  userId: string,
  body: {
    title: string;
    description?: string;
    priority: string;
    status: string;
    assignedTo?: string | null;
    dueDate?: string;
  }
) => {
  const { title, description, priority, status, assignedTo, dueDate } = body;
  const project = await ProjectModel.findById(projectId);
  if (!project || project.workspace.toString() !== workspaceId) {
    throw new NotFoundException('Project not found');
  }

  if (assignedTo) {
    const isAssignedUserMember = await MemberModel.exists({
      userId: assignedTo,
      workspaceId: workspaceId,
    });

    if (!isAssignedUserMember) {
      throw new NotFoundException('Assigned user is not a member of the workspace');
    }
  }

  const task = new TaskModel({
    title,
    description,
    priority: priority || TaskPriorityEnum.MEDIUM,
    status: status || TaskStatusEnum.TODO,
    assignedTo,
    dueDate,
    workspace: workspaceId,
    project: projectId,
    createdBy: userId,
  });

  await task.save();

  return { task };
};

export const updateTaskService = async (
  workspaceId: string,
  projectId: string,
  taskId: string,
  body: {
    title?: string;
    description?: string;
    priority?: string;
    status?: string;
    assignedTo?: string | null;
    dueDate?: string;
  }
) => {
  const { title, description, priority, status, assignedTo, dueDate } = body;

  const project = await ProjectModel.findById(projectId);
  if (!project || project.workspace.toString() !== workspaceId) {
    throw new NotFoundException('Project not found or does not belong to this workspace');
  }

  const task = await TaskModel.findById(taskId);
  if (!task || task.project.toString() !== projectId) {
    throw new NotFoundException('Task not found or task is not part of this project');
  }

  const updatedTask = await TaskModel.findByIdAndUpdate(
    taskId,
    {
      title,
      description,
      priority,
      status,
      assignedTo,
      dueDate,
    },
    { new: true }
  );

  if (!updatedTask) {
    throw new BadRequestException('Failed to update task');
  }

  return { task: updatedTask };
};

export const getAllTasksService = async (
  workspaceId: string,
  filters: {
    projectId?: string;
    status?: string[];
    priority?: string[];
    assignedTo?: string[];
    dueDate?: string;
    keyword?: string;
  },
  pagination: {
    pageSize: number;
    pageNumber: number;
  }
) => {
  const query: Record<string, any> = { workspace: workspaceId };
  const { projectId, status, priority, assignedTo, dueDate, keyword } = filters;
  const { pageSize, pageNumber } = pagination;

  if (projectId) {
    query.project = projectId;
  }

  if (status && status.length > 0) {
    query.status = { $in: status };
  }

  if (priority && priority.length > 0) {
    query.priority = { $in: priority };
  }

  if (assignedTo && assignedTo.length > 0) {
    query.assignedTo = { $in: assignedTo };
  }

  if (keyword) {
    query.title = { $regex: keyword, $options: 'i' };
  }

  if (dueDate) {
    query.dueDate = {
      $eq: new Date(dueDate),
    };
  }

  const skip = (pageNumber - 1) * pageSize;
  const [tasks, totalCount] = await Promise.all([
    TaskModel.find(query)
      .skip(skip)
      .limit(pageSize)
      .sort({ createdAt: -1 })
      .populate('assignedTo', '_id name profilePicture -password')
      .populate('project', '_id emoji name'),
    TaskModel.countDocuments(query),
  ]);
  const totalPages = Math.ceil(totalCount / pageSize);
  return {
    tasks,
    paginaion: {
      pageSize,
      pageNumber,
      totalCount,
      totalPages,
      skip,
    },
  };
};

export const getTaskByIdService = async (
  workspaceId: string,
  projectId: string,
  taskId: string
) => {
  const project = await ProjectModel.findById(projectId);

  if (!project || project.workspace.toString() !== workspaceId) {
    throw new NotFoundException('Project not found');
  }

  const task = await TaskModel.findOne({
    _id: taskId,
    project: projectId,
    workspace: workspaceId,
  }).populate('assignedTo', '_id name profilePicture -password');

  if (!task) {
    throw new NotFoundException('Task not found');
  }

  return {
    task,
  };
};

export const deleteTaskByIdService = async (workspaceId: string, taskId: string) => {
  const task = await TaskModel.findOneAndDelete({
    _id: taskId,
    workspace: workspaceId,
  });
  if (!task) {
    throw new NotFoundException('Task not found or does not belong to this');
  }

  return { task };
};

