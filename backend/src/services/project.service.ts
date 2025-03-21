import { TaskStatusEnum } from '../enums/task.enum'; // Importing TaskStatusEnum for task status constants
import ProjectModel from '../models/project.model'; // Importing ProjectModel for database operations on projects
import TaskModel from '../models/task.model'; // Importing TaskModel for database operations on tasks
import { NotFoundException } from '../utils/appError'; // Importing custom error class for handling not found exceptions

// Service to create a new project
export const createProjectService = async (
  userId: string, // ID of the user creating the project
  workspaceId: string, // ID of the workspace where the project is created
  body: { name: string; emoji?: string; description?: string } // Project details
) => {
  const project = new ProjectModel({
    ...(body.emoji && { emoji: body.emoji }), // Add emoji if provided
    description: body.description, // Add description
    name: body.name, // Add project name
    workspace: workspaceId, // Associate project with workspace
    createdBy: userId, // Associate project with creator
  });
  await project.save(); // Save the project to the database

  return { project }; // Return the created project
};

// Service to get all projects in a workspace with pagination
export const getAllProjectsWorkspaceService = async (
  workspaceId: string, // ID of the workspace
  pageSize: number, // Number of projects per page
  pageNumber: number // Current page number
) => {
  const totalProjectsCount = await ProjectModel.countDocuments({
    workspace: workspaceId, // Count projects in the workspace
  });
  const skip = (pageNumber - 1) * pageSize; // Calculate documents to skip for pagination
  const projects = await ProjectModel.find({ workspace: workspaceId }) // Find projects in the workspace
    .skip(skip) // Skip documents for pagination
    .limit(pageSize) // Limit the number of documents
    .populate('createdBy', '_id name email profilePicture -password') // Populate creator details
    .sort({ createdAt: -1 }); // Sort projects by creation date in descending order
  const totalPages = Math.ceil(totalProjectsCount / pageSize); // Calculate total pages

  return { projects, totalProjectsCount, totalPages, skip }; // Return paginated projects and metadata
};

// Service to get a project by its ID and workspace ID
export const getProjectByIdAndWorkspaceIdService = async (
  workspaceId: string, // ID of the workspace
  projectId: string // ID of the project
) => {
  const project = await ProjectModel.findOne({
    workspace: workspaceId, // Match workspace ID
    _id: projectId, // Match project ID
  }).select('_id name emoji description createdBy'); // Select specific fields

  if (!project) {
    throw new NotFoundException(
      'Project not found or does not present in this workspace' // Throw error if project not found
    );
  }

  return { project }; // Return the project
};

// Service to get analytics for a project
export const getProjectAnalyticsService = async (
  projectId: string, // ID of the project
  workspaceId: string // ID of the workspace
) => {
  const project = await ProjectModel.findById(projectId); // Find project by ID

  if (!project || project.workspace.toString() !== workspaceId) {
    throw new NotFoundException(
      'Project not found or does not present in this workspace' // Throw error if project not found or mismatched workspace
    );
  }

  const currentDae = new Date(); // Get current date
  const taskAnalytics = await TaskModel.aggregate([
    {
      $match: {
        project: project._id, // Match tasks belonging to the project
      },
    },
    {
      $facet: {
        totalTasks: [{ $count: 'count' }], // Count total tasks
        overdueTask: [
          {
            $match: {
              dueDate: { $lt: currentDae }, // Match overdue tasks
              status: { $ne: TaskStatusEnum.DONE }, // Exclude completed tasks
            },
          },
          { $count: 'count' }, // Count overdue tasks
        ],
        completedTasks: [
          {
            $match: {
              status: TaskStatusEnum.DONE, // Match completed tasks
            },
          },
          { $count: 'count' }, // Count completed tasks
        ],
        pendingTasks: [
          {
            $match: {
              status: { $nin: [TaskStatusEnum.DONE, TaskStatusEnum.BACKLOG] }, // Match pending tasks
            },
          },
          { $count: 'count' }, // Count pending tasks
        ],
        tasksByPriority: [
          {
            $group: {
              _id: '$priority', // Group tasks by priority
              count: { $sum: 1 }, // Count tasks in each priority
            },
          },
        ],
        tasksByStatus: [
          {
            $group: {
              _id: '$status', // Group tasks by status
              count: { $sum: 1 }, // Count tasks in each status
            },
          },
        ],
        tasksByUser: [
          {
            $group: {
              _id: '$assignedTo', // Group tasks by assigned user
              count: { $sum: 1 }, // Count tasks assigned to each user
            },
          },
        ],
        tasksDueToday: [
          {
            $match: {
              dueDate: { $eq: new Date().toISOString().split('T')[0] }, // Match tasks due today
              status: { $ne: TaskStatusEnum.DONE }, // Exclude completed tasks
            },
          },
          { $count: 'count' }, // Count tasks due today
        ],
        completedOverTime: [
          {
            $match: {
              status: TaskStatusEnum.DONE, // Match completed tasks
              completedAt: {
                $gte: new Date(new Date().setDate(new Date().getDate() - 30)), // Match tasks completed in the last 30 days
              },
            },
          },
          {
            $group: {
              _id: { $dateToString: { format: '%Y-%m-%d', date: '$completedAt' } }, // Group by completion date
              count: { $sum: 1 }, // Count tasks completed on each date
            },
          },
        ],
        averageCompletionTime: [
          {
            $match: {
              status: TaskStatusEnum.DONE, // Match completed tasks
            },
          },
          {
            $project: {
              completionTime: { $subtract: ['$completedAt', '$createdAt'] }, // Calculate completion time
            },
          },
          {
            $group: {
              _id: null, // Group all tasks
              averageTime: { $avg: '$completionTime' }, // Calculate average completion time
            },
          },
        ],
      },
    },
  ]);

  const _analytic = taskAnalytics[0]; // Extract analytics data
  const analytics = {
    totalTasks: _analytic.totalTasks[0]?.count || 0, // Total tasks
    overdueTask: _analytic.overdueTask[0]?.count || 0, // Overdue tasks
    completedTasks: _analytic.completedTasks[0]?.count || 0, // Completed tasks
    pendingTasks: _analytic.pendingTasks[0]?.count || 0, // Pending tasks
    tasksByPriority: _analytic?.tasksByPriority, // Tasks grouped by priority
    tasksByStatus: _analytic?.tasksByStatus, // Tasks grouped by status
    tasksByUser: _analytic?.tasksByUser, // Tasks grouped by user
    tasksDueToday: _analytic?.tasksDueToday[0]?.count || 0, // Tasks due today
    completedOverTime: _analytic?.completedOverTime, // Tasks completed over time
    averageCompletionTime: _analytic?.averageCompletionTime[0]?.averageTime || 0, // Average completion time
  };
  return { analytics }; // Return analytics
};

// Service to update a project by its ID and workspace ID
export const updateProjectByIdAndWorkspaceIdService = async (
  workspaceId: string, // ID of the workspace
  projectId: string, // ID of the project
  body: { name: string; emoji?: string; description?: string } // Updated project details
) => {
  const { name, emoji, description } = body;

  const project = await ProjectModel.findOne({
    workspace: workspaceId, // Match workspace ID
    _id: projectId, // Match project ID
  });

  if (!project) {
    throw new NotFoundException(
      'Project not found or does not present in this workspace' // Throw error if project not found
    );
  }
  if (emoji) project.emoji = emoji; // Update emoji if provided

  if (description) project.description = description; // Update description if provided

  if (name) project.name = name; // Update name if provided

  await project.save(); // Save updated project to the database

  return { project }; // Return updated project
};

// Service to delete a project by its ID and workspace ID
export const deleteProjectByIdAndWorkspaceIdService = async (
  workspaceId: string, // ID of the workspace
  projectId: string // ID of the project
) => {
  const project = await ProjectModel.findOne({
    workspace: workspaceId, // Match workspace ID
    _id: projectId, // Match project ID
  });

  if (!project) {
    throw new NotFoundException(
      'Project not found or does not present in this workspace' // Throw error if project not found
    );
  }
  await project.deleteOne(); // Delete the project
  await TaskModel.deleteMany({ project: projectId }); // Delete all tasks associated with the project

  return { project }; // Return deleted project
};

