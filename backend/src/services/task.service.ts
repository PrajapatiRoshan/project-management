import { TaskPriorityEnum, TaskStatusEnum } from '../enums/task.enum'; // Importing enums for task priority and status
import MemberModel from '../models/member.model'; // Importing the Member model
import ProjectModel from '../models/project.model'; // Importing the Project model
import TaskModel from '../models/task.model'; // Importing the Task model
import WorkspaceModel from '../models/workspace.model'; // Importing the Workspace model
import { BadRequestException, NotFoundException } from '../utils/appError'; // Importing custom error classes

// Service to create a new task
export const createTaskService = async (
  workspaceId: string, // Workspace ID
  projectId: string, // Project ID
  userId: string, // User ID of the creator
  body: {
    // Task details
    title: string; // Task title
    description?: string; // Optional task description
    priority: string; // Task priority
    status: string; // Task status
    assignedTo?: string | null; // Optional user ID to assign the task
    dueDate?: string; // Optional due date for the task
  }
) => {
  const { title, description, priority, status, assignedTo, dueDate } = body; // Destructuring task details
  const project = await ProjectModel.findById(projectId); // Fetching the project by ID
  if (!project || project.workspace.toString() !== workspaceId) {
    // Validating project existence and workspace association
    throw new NotFoundException('Project not found'); // Throwing error if project is invalid
  }

  if (assignedTo) {
    // If the task is assigned to a user
    const isAssignedUserMember = await MemberModel.exists({
      userId: assignedTo, // Checking if the user is a member of the workspace
      workspaceId: workspaceId,
    });

    if (!isAssignedUserMember) {
      // If the user is not a member
      throw new NotFoundException('Assigned user is not a member of the workspace'); // Throw error
    }
  }

  const task = new TaskModel({
    title, // Setting task title
    description, // Setting task description
    priority: priority || TaskPriorityEnum.MEDIUM, // Defaulting priority to MEDIUM if not provided
    status: status || TaskStatusEnum.TODO, // Defaulting status to TODO if not provided
    assignedTo, // Setting assigned user
    dueDate, // Setting due date
    workspace: workspaceId, // Associating task with workspace
    project: projectId, // Associating task with project
    createdBy: userId, // Setting the creator of the task
  });

  await task.save(); // Saving the task to the database

  return { task }; // Returning the created task
};

// Service to update an existing task
export const updateTaskService = async (
  workspaceId: string, // Workspace ID
  projectId: string, // Project ID
  taskId: string, // Task ID
  body: {
    // Task update details
    title?: string; // Optional updated title
    description?: string; // Optional updated description
    priority?: string; // Optional updated priority
    status?: string; // Optional updated status
    assignedTo?: string | null; // Optional updated assigned user
    dueDate?: string; // Optional updated due date
  }
) => {
  const { title, description, priority, status, assignedTo, dueDate } = body; // Destructuring update details

  const project = await ProjectModel.findById(projectId); // Fetching the project by ID
  if (!project || project.workspace.toString() !== workspaceId) {
    // Validating project existence and workspace association
    throw new NotFoundException('Project not found or does not belong to this workspace'); // Throw error if invalid
  }

  const task = await TaskModel.findById(taskId); // Fetching the task by ID
  if (!task || task.project.toString() !== projectId) {
    // Validating task existence and project association
    throw new NotFoundException('Task not found or task is not part of this project'); // Throw error if invalid
  }

  const updatedTask = await TaskModel.findByIdAndUpdate(
    taskId, // Task ID to update
    {
      title, // Updating title
      description, // Updating description
      priority, // Updating priority
      status, // Updating status
      assignedTo, // Updating assigned user
      dueDate, // Updating due date
    },
    { new: true } // Returning the updated document
  );

  if (!updatedTask) {
    // If the update fails
    throw new BadRequestException('Failed to update task'); // Throw error
  }

  return { task: updatedTask }; // Returning the updated task
};

// Service to fetch all tasks with filters and pagination
export const getAllTasksService = async (
  workspaceId: string, // Workspace ID
  filters: {
    // Filters for querying tasks
    projectId?: string; // Optional project ID filter
    status?: string[]; // Optional status filter
    priority?: string[]; // Optional priority filter
    assignedTo?: string[]; // Optional assigned user filter
    dueDate?: string; // Optional due date filter
    keyword?: string; // Optional keyword filter
  },
  pagination: {
    // Pagination details
    pageSize: number; // Number of tasks per page
    pageNumber: number; // Current page number
  }
) => {
  const query: Record<string, any> = { workspace: workspaceId }; // Base query with workspace ID
  const { projectId, status, priority, assignedTo, dueDate, keyword } = filters; // Destructuring filters
  const { pageSize, pageNumber } = pagination; // Destructuring pagination details

  if (projectId) {
    // If project ID filter is provided
    query.project = projectId; // Add project ID to query
  }

  if (status && status.length > 0) {
    // If status filter is provided
    query.status = { $in: status }; // Add status filter to query
  }

  if (priority && priority.length > 0) {
    // If priority filter is provided
    query.priority = { $in: priority }; // Add priority filter to query
  }

  if (assignedTo && assignedTo.length > 0) {
    // If assigned user filter is provided
    query.assignedTo = { $in: assignedTo }; // Add assigned user filter to query
  }

  if (keyword) {
    // If keyword filter is provided
    query.title = { $regex: keyword, $options: 'i' }; // Add keyword filter to query (case-insensitive)
  }

  if (dueDate) {
    // If due date filter is provided
    query.dueDate = {
      $eq: new Date(dueDate), // Add due date filter to query
    };
  }

  const skip = (pageNumber - 1) * pageSize; // Calculate the number of documents to skip
  const [tasks, totalCount] = await Promise.all([
    TaskModel.find(query) // Fetch tasks matching the query
      .skip(skip) // Skip documents for pagination
      .limit(pageSize) // Limit the number of documents per page
      .sort({ createdAt: -1 }) // Sort tasks by creation date in descending order
      .populate('assignedTo', '_id name profilePicture -password') // Populate assigned user details
      .populate('project', '_id emoji name'), // Populate project details
    TaskModel.countDocuments(query), // Count total tasks matching the query
  ]);
  const totalPages = Math.ceil(totalCount / pageSize); // Calculate total pages
  return {
    tasks, // Return fetched tasks
    paginaion: {
      // Return pagination details
      pageSize,
      pageNumber,
      totalCount,
      totalPages,
      skip,
    },
  };
};

// Service to fetch a task by its ID
export const getTaskByIdService = async (
  workspaceId: string, // Workspace ID
  projectId: string, // Project ID
  taskId: string // Task ID
) => {
  const project = await ProjectModel.findById(projectId); // Fetching the project by ID

  if (!project || project.workspace.toString() !== workspaceId) {
    // Validating project existence and workspace association
    throw new NotFoundException('Project not found'); // Throw error if invalid
  }

  const task = await TaskModel.findOne({
    _id: taskId, // Task ID
    project: projectId, // Project ID
    workspace: workspaceId, // Workspace ID
  }).populate('assignedTo', '_id name profilePicture -password'); // Populate assigned user details

  if (!task) {
    // If task is not found
    throw new NotFoundException('Task not found'); // Throw error
  }

  return {
    task, // Return the fetched task
  };
};

// Service to delete a task by its ID
export const deleteTaskByIdService = async (workspaceId: string, taskId: string) => {
  const task = await TaskModel.findOneAndDelete({
    _id: taskId, // Task ID
    workspace: workspaceId, // Workspace ID
  });
  if (!task) {
    // If task is not found
    throw new NotFoundException('Task not found or does not belong to this'); // Throw error
  }

  return { task }; // Return the deleted task
};

