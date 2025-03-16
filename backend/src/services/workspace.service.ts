import mongoose from 'mongoose'; // Import mongoose library
import { Roles } from '../enums/role.enum'; // Import Roles enum
import MemberModel from '../models/member.model'; // Import MemberModel
import RoleModel from '../models/roles-permission.model'; // Import RoleModel
import UserModel from '../models/user.model'; // Import UserModel
import WorkspaceModel from '../models/workspace.model'; // Import WorkspaceModel
import { BadRequestException, NotFoundException } from '../utils/appError'; // Import NotFoundException
import TaskModel from '../models/task.model';
import { TaskStatusEnum } from '../enums/task.enum';
import ProjectModel from '../models/project.model';

export const createWorkSpaceService = async (
  // Define the createWorkSpaceService function
  userId: string, // The user ID
  body: {
    // The request body
    name: string; // The workspace name
    description?: string | undefined; // The workspace description (optional)
  }
) => {
  const { name, description } = body; // Destructure the name and description from the body

  const user = await UserModel.findById(userId); // Find the user by ID

  if (!user) {
    // If the user is not found
    throw new NotFoundException('User not found'); // Throw a NotFoundException
  }
  const ownerRole = await RoleModel.findOne({
    // Find the owner role
    name: Roles.OWNER, // The role name should be OWNER
  });
  if (!ownerRole) {
    // If the owner role is not found
    throw new NotFoundException('Owner role not found'); // Throw a NotFoundException
  }

  const workspace = new WorkspaceModel({
    // Create a new workspace
    name, // Set the workspace name
    description, // Set the workspace description
    owner: user._id, // Set the workspace owner
  });
  await workspace.save(); // Save the workspace

  const member = new MemberModel({
    // Create a new member
    userId: user._id, // Set the user ID
    workspaceId: workspace._id, // Set the workspace ID
    role: ownerRole._id, // Set the role ID
    joinedAt: new Date(), // Set the joined date
  });
  await member.save(); // Save the member

  user.currentWorkspace = workspace._id as mongoose.Types.ObjectId; // Set the user's current workspace
  await user.save(); // Save the user

  return { workspace }; // Return the workspace
};

export const getAllWorkspacesUserIsMemberService = async (userId: string) => {
  // Define the getAllWorkspacesUserIsMemberService function
  const memberships = await MemberModel.find({ userId }) // Find all memberships for the user
    .populate('workspaceId') // Populate the workspace ID
    .select('-password') // Exclude the password field
    .exec(); // Execute the query

  const workspaces = memberships.map((member) => member.workspaceId); // Map the memberships to workspaces
  return { workspaces }; // Return the workspaces
};

export const getWorkspaceByIdService = async (workspaceId: string) => {
  // Define the getWorkspaceByIdService function
  const workspace = await WorkspaceModel.findById(workspaceId); // Find the workspace by ID

  if (!workspace) {
    // If the workspace is not found
    throw new NotFoundException('Workspace not found'); // Throw a NotFoundException
  }
  const members = await MemberModel.find({
    // Find all members of the workspace
    workspaceId, // The workspace ID
  }).populate('role'); // Populate the role

  const workspaceWithMembers = {
    // Create an object with the workspace and its members
    ...workspace.toObject(), // Convert the workspace to an object
    members, // Add the members
  };

  return {
    // Return the workspace with members
    workspace: workspaceWithMembers,
  };
};

export const getWorkspaceMembersService = async (workspaceId: string) => {
  // Define the getWorkspaceMembersService function
  const members = await MemberModel.find({ workspaceId }) // Find all members of the workspace
    .populate('userId', 'name email profilePicture -password') // Populate the user ID with name, email, and profile picture, excluding the password
    .populate('role', 'name'); // Populate the role with name

  const roles = await RoleModel.find(
    // Find all roles
    {}, // No filter
    {
      name: 1, // Include the name field
      _id: 1, // Include the _id field
    }
  )
    .select('-permission') // Exclude the permission field
    .lean(); // Return plain JavaScript objects

  return {
    // Return the members and roles
    members,
    roles,
  };
};

export const getWorkspaceAnalyticsService = async (workspaceId: string) => {
  const currentDate = new Date();
  const totalTasks = await TaskModel.countDocuments({
    workspace: workspaceId,
  });
  const overDueTasks = await TaskModel.countDocuments({
    workspace: workspaceId,
    dueDate: { $lt: currentDate },
    status: {
      $ne: TaskStatusEnum.DONE,
    },
  });
  const complatedTasks = await TaskModel.countDocuments({
    workspace: workspaceId,
    status: TaskStatusEnum.DONE,
  });
  const analytics = {
    totalTasks,
    overDueTasks,
    complatedTasks,
  };
  return {
    analytics,
  };
};

export const changeMemberRoleService = async (
  workspaceId: string,
  memberId: string,
  roleId: string
) => {
  const workspace = await WorkspaceModel.findById(workspaceId);
  if (!workspace) {
    throw new NotFoundException('Workspace not found');
  }

  const role = await RoleModel.findById(roleId);
  if (!role) {
    throw new NotFoundException('Role not found');
  }

  const member = await MemberModel.findOne({
    workspaceId,
    userId: memberId,
  });

  if (!member) {
    throw new NotFoundException('Member not found in the workspace');
  }

  member.role = role;
  await member.save();

  return {
    member,
  };
};

export const updateWorkspaceByIdService = async (
  workspaceId: string,
  name: string,
  description?: string
) => {
  const workspace = await WorkspaceModel.findById(workspaceId);
  if (!workspace) {
    throw new NotFoundException('Workspace not found');
  }
  name && (workspace.name = name);
  description && (workspace.description = description);
  await workspace.save();
  return {
    workspace,
  };
};

export const deleteWorkspaceByIdService = async (workspaceId: string, userId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const workspace = await WorkspaceModel.findById(workspaceId).session(session);
    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }
    const user = await UserModel.findById(userId).session(session);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (workspace.owner.toString() !== userId) {
      throw new BadRequestException('You are not the owner of this workspace');
    }

    await ProjectModel.deleteMany({ workspace: workspace._id }).session(session);
    await TaskModel.deleteMany({ workspace: workspace._id }).session(session);
    await MemberModel.deleteMany({ workspaceId: workspace._id }).session(session);

    if (user?.currentWorkspace?.equals(workspaceId)) {
      const memeberWorkspace = await MemberModel.findOne({
        userId,
      }).session(session);
      user.currentWorkspace = memeberWorkspace?.workspaceId || null;
      await user.save({ session });
    }

    await workspace.deleteOne({ session });

    await session.commitTransaction();
    session.endSession();
    return {
      currentWorkspace: user?.currentWorkspace,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  } finally {
    session.endSession();
  }
};

