import mongoose from 'mongoose'; // Import mongoose library
import { Roles } from '../enums/role.enum'; // Import Roles enum
import MemberModel from '../models/member.model'; // Import MemberModel
import RoleModel from '../models/roles-permission.model'; // Import RoleModel
import UserModel from '../models/user.model'; // Import UserModel
import WorkspaceModel from '../models/workspace.model'; // Import WorkspaceModel
import { BadRequestException, NotFoundException } from '../utils/appError'; // Import custom exceptions
import TaskModel from '../models/task.model'; // Import TaskModel
import { TaskStatusEnum } from '../enums/task.enum'; // Import TaskStatusEnum
import ProjectModel from '../models/project.model'; // Import ProjectModel

export const createWorkSpaceService = async (
  userId: string, // The ID of the user creating the workspace
  body: { name: string; description?: string } // The request body containing workspace details
) => {
  const { name, description } = body; // Destructure name and description from the body

  const user = await UserModel.findById(userId); // Find the user by their ID
  if (!user) {
    throw new NotFoundException('User not found'); // Throw an error if the user is not found
  }

  const ownerRole = await RoleModel.findOne({ name: Roles.OWNER }); // Find the owner role
  if (!ownerRole) {
    throw new NotFoundException('Owner role not found'); // Throw an error if the owner role is not found
  }

  const workspace = new WorkspaceModel({
    name, // Set the workspace name
    description, // Set the workspace description
    owner: user._id, // Set the owner of the workspace
  });
  await workspace.save(); // Save the workspace to the database

  const member = new MemberModel({
    userId: user._id, // Set the user ID
    workspaceId: workspace._id, // Set the workspace ID
    role: ownerRole._id, // Set the role ID
    joinedAt: new Date(), // Set the join date
  });
  await member.save(); // Save the member to the database

  user.currentWorkspace = workspace._id as mongoose.Types.ObjectId; // Update the user's current workspace
  await user.save(); // Save the user

  return { workspace }; // Return the created workspace
};

export const getAllWorkspacesUserIsMemberService = async (userId: string) => {
  const memberships = await MemberModel.find({ userId }) // Find all memberships for the user
    .populate('workspaceId') // Populate the workspace details
    .select('-password') // Exclude the password field
    .exec(); // Execute the query

  const workspaces = memberships.map((member) => member.workspaceId); // Extract workspace IDs from memberships
  return { workspaces }; // Return the list of workspaces
};

export const getWorkspaceByIdService = async (workspaceId: string) => {
  const workspace = await WorkspaceModel.findById(workspaceId); // Find the workspace by ID
  if (!workspace) {
    throw new NotFoundException('Workspace not found'); // Throw an error if the workspace is not found
  }

  const members = await MemberModel.find({ workspaceId }) // Find all members of the workspace
    .populate('role'); // Populate the role details

  const workspaceWithMembers = {
    ...workspace.toObject(), // Convert the workspace to a plain object
    members, // Add the members to the workspace object
  };

  return { workspace: workspaceWithMembers }; // Return the workspace with members
};

export const getWorkspaceMembersService = async (workspaceId: string) => {
  const members = await MemberModel.find({ workspaceId }) // Find all members of the workspace
    .populate('userId', 'name email profilePicture -password') // Populate user details excluding the password
    .populate('role', 'name'); // Populate role details

  const roles = await RoleModel.find({}, { name: 1, _id: 1 }) // Find all roles with only name and ID
    .select('-permission') // Exclude the permission field
    .lean(); // Return plain JavaScript objects

  return { members, roles }; // Return the members and roles
};

export const getWorkspaceAnalyticsService = async (workspaceId: string) => {
  const currentDate = new Date(); // Get the current date
  const totalTasks = await TaskModel.countDocuments({ workspace: workspaceId }); // Count total tasks in the workspace
  const overdueTask = await TaskModel.countDocuments({
    workspace: workspaceId, // Filter by workspace ID
    dueDate: { $lt: currentDate }, // Filter tasks with due dates in the past
    status: { $ne: TaskStatusEnum.DONE }, // Exclude completed tasks
  });
  const completedTasks = await TaskModel.countDocuments({
    workspace: workspaceId, // Filter by workspace ID
    status: TaskStatusEnum.DONE, // Filter completed tasks
  });

  const analytics = {
    totalTasks, // Total number of tasks
    overdueTask, // Number of overdue tasks
    completedTasks, // Number of completed tasks
  };

  return { analytics }; // Return the analytics data
};

export const changeMemberRoleService = async (
  workspaceId: string, // The ID of the workspace
  memberId: string, // The ID of the member
  roleId: string // The ID of the new role
) => {
  const workspace = await WorkspaceModel.findById(workspaceId); // Find the workspace by ID
  if (!workspace) {
    throw new NotFoundException('Workspace not found'); // Throw an error if the workspace is not found
  }

  const role = await RoleModel.findById(roleId); // Find the role by ID
  if (!role) {
    throw new NotFoundException('Role not found'); // Throw an error if the role is not found
  }

  const member = await MemberModel.findOne({ workspaceId, userId: memberId }); // Find the member in the workspace
  if (!member) {
    throw new NotFoundException('Member not found in the workspace'); // Throw an error if the member is not found
  }

  member.role = role; // Update the member's role
  await member.save(); // Save the updated member

  return { member }; // Return the updated member
};

export const updateWorkspaceByIdService = async (
  workspaceId: string, // The ID of the workspace
  name: string, // The new name for the workspace
  description?: string // The new description for the workspace (optional)
) => {
  const workspace = await WorkspaceModel.findById(workspaceId); // Find the workspace by ID
  if (!workspace) {
    throw new NotFoundException('Workspace not found'); // Throw an error if the workspace is not found
  }

  name && (workspace.name = name); // Update the name if provided
  description && (workspace.description = description); // Update the description if provided
  await workspace.save(); // Save the updated workspace

  return { workspace }; // Return the updated workspace
};

export const deleteWorkspaceByIdService = async (
  workspaceId: string, // The ID of the workspace
  userId: string // The ID of the user attempting to delete the workspace
) => {
  const session = await mongoose.startSession(); // Start a new database session
  session.startTransaction(); // Begin a transaction

  try {
    const workspace = await WorkspaceModel.findById(workspaceId).session(session); // Find the workspace by ID
    if (!workspace) {
      throw new NotFoundException('Workspace not found'); // Throw an error if the workspace is not found
    }

    const user = await UserModel.findById(userId).session(session); // Find the user by ID
    if (!user) {
      throw new NotFoundException('User not found'); // Throw an error if the user is not found
    }

    if (workspace.owner.toString() !== userId.toString()) {
      throw new BadRequestException('You are not the owner of this workspace'); // Throw an error if the user is not the owner
    }

    await ProjectModel.deleteMany({ workspace: workspace._id }).session(session); // Delete all projects in the workspace
    await TaskModel.deleteMany({ workspace: workspace._id }).session(session); // Delete all tasks in the workspace
    await MemberModel.deleteMany({ workspaceId: workspace._id }).session(session); // Delete all members in the workspace

    if (user?.currentWorkspace?.equals(workspaceId)) {
      const memeberWorkspace = await MemberModel.findOne({ userId }).session(session); // Find another workspace for the user
      user.currentWorkspace = memeberWorkspace?.workspaceId || null; // Update the user's current workspace
      await user.save({ session }); // Save the updated user
    }

    await workspace.deleteOne({ session }); // Delete the workspace

    await session.commitTransaction(); // Commit the transaction
    session.endSession(); // End the session
    return { currentWorkspace: user?.currentWorkspace }; // Return the user's current workspace
  } catch (error) {
    await session.abortTransaction(); // Abort the transaction in case of an error
    session.endSession(); // End the session
    throw error; // Rethrow the error
  } finally {
    session.endSession(); // Ensure the session is ended
  }
};

