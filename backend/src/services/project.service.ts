import { TaskStatusEnum } from '../enums/task.enum';
import ProjectModel from '../models/project.model';
import TaskModel from '../models/task.model';
import { NotFoundException } from '../utils/appError';

export const createProjectService = async (
  userId: string,
  workspaceId: string,
  body: {
    name: string;
    emoji?: string | undefined;
    description?: string | undefined;
  }
) => {
  const project = new ProjectModel({
    ...(body.emoji && { emoji: body.emoji }),
    description: body.description,
    name: body.name,
    workspace: workspaceId,
    createdBy: userId,
  });
  await project.save();

  return { project };
};

export const getAllProjectsWorkspaceService = async (
  workspaceId: string,
  pageSize: number,
  pageNumber: number
) => {
  const totalProjectsCount = await ProjectModel.countDocuments({
    workspace: workspaceId,
  });
  const skip = (pageNumber - 1) * pageSize;
  const projects = await ProjectModel.find({ workspace: workspaceId })
    .skip(skip)
    .limit(pageSize)
    .populate('createdBy', '_id name email profilePicture -password')
    .sort({ createdAt: -1 });
  const totalPages = Math.ceil(totalProjectsCount / pageSize);

  return { projects, totalProjectsCount, totalPages, skip };
};

export const getProjectByIdAndWorkspaceIdService = async (
  workspaceId: string,
  projectId: string
) => {
  const project = await ProjectModel.findOne({
    workspace: workspaceId,
    _id: projectId,
  }).select('_id name emoji description createdBy');

  if (!project) {
    throw new NotFoundException(
      'Project not found or does not present in this workspace'
    );
  }

  return { project };
};

export const getProjectAnalyticsService = async (
  projectId: string,
  workspaceId: string
) => {
  const project = await ProjectModel.findById(projectId);

  if (!project || project.workspace.toString() !== workspaceId) {
    throw new NotFoundException(
      'Project not found or does not present in this workspace'
    );
  }

  const currentDae = new Date();
  const taskAnalytics = await TaskModel.aggregate([
    {
      $match: {
        project: project._id,
      },
    },
    {
      $facet: {
        totalTasks: [{ $count: 'count' }],
        overdueTask: [
          {
            $match: {
              dueDate: { $lt: currentDae },
              status: { $ne: TaskStatusEnum.DONE },
            },
          },
          { $count: 'count' },
        ],
        completedTasks: [
          {
            $match: {
              status: TaskStatusEnum.DONE,
            },
          },
          { $count: 'count' },
        ],
        pendingTasks: [
          {
            $match: {
              status: { $nin: [TaskStatusEnum.DONE, TaskStatusEnum.BACKLOG] },
            },
          },
          { $count: 'count' },
        ],
        tasksByPriority: [
          {
            $group: {
              _id: '$priority',
              count: { $sum: 1 },
            },
          },
        ],
        tasksByStatus: [
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 },
            },
          },
        ],
        tasksByUser: [
          {
            $group: {
              _id: '$assignedTo',
              count: { $sum: 1 },
            },
          },
        ],
        tasksDueToday: [
          {
            $match: {
              dueDate: { $eq: new Date().toISOString().split('T')[0] },
              status: { $ne: TaskStatusEnum.DONE },
            },
          },
          { $count: 'count' },
        ],
        completedOverTime: [
          {
            $match: {
              status: TaskStatusEnum.DONE,
              completedAt: {
                $gte: new Date(new Date().setDate(new Date().getDate() - 30)),
              },
            },
          },
          {
            $group: {
              _id: { $dateToString: { format: '%Y-%m-%d', date: '$completedAt' } },
              count: { $sum: 1 },
            },
          },
        ],
        averageCompletionTime: [
          {
            $match: {
              status: TaskStatusEnum.DONE,
            },
          },
          {
            $project: {
              completionTime: { $subtract: ['$completedAt', '$createdAt'] },
            },
          },
          {
            $group: {
              _id: null,
              averageTime: { $avg: '$completionTime' },
            },
          },
        ],
      },
    },
  ]);

  const _analytic = taskAnalytics[0];
  const analytics = {
    totalTasks: _analytic.totalTasks[0]?.count || 0,
    overdueTask: _analytic.overdueTask[0]?.count || 0,
    completedTasks: _analytic.completedTasks[0]?.count || 0,
    pendingTasks: _analytic.pendingTasks[0]?.count || 0,
    tasksByPriority: _analytic?.tasksByPriority,
    tasksByStatus: _analytic?.tasksByStatus,
    tasksByUser: _analytic?.tasksByUser,
    tasksDueToday: _analytic?.tasksDueToday[0]?.count || 0,
    completedOverTime: _analytic?.completedOverTime,
    averageCompletionTime: _analytic?.averageCompletionTime[0]?.averageTime || 0,
  };
  return { analytics };
};

export const updateProjectByIdAndWorkspaceIdService = async (
  workspaceId: string,
  projectId: string,
  body: {
    name: string;
    emoji?: string | undefined;
    description?: string | undefined;
  }
) => {
  const { name, emoji, description } = body;

  const project = await ProjectModel.findOne({
    workspace: workspaceId,
    _id: projectId,
  });

  if (!project) {
    throw new NotFoundException(
      'Project not found or does not present in this workspace'
    );
  }
  if (emoji) project.emoji = emoji;

  if (description) project.description = description;

  if (name) project.name = name;

  await project.save();

  return { project };
};

export const deleteProjectByIdAndWorkspaceIdService = async (
  workspaceId: string,
  projectId: string
) => {
  const project = await ProjectModel.findOne({
    workspace: workspaceId,
    _id: projectId,
  });

  if (!project) {
    throw new NotFoundException(
      'Project not found or does not present in this workspace'
    );
  }
  await project.deleteOne();
  await TaskModel.deleteMany({ project: projectId });

  return { project };
};

