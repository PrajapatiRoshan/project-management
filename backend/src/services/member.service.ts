// Importing required enums, models, and utility classes
import { ErrorCodeEnum } from '../enums/error-code.enum';
import { Roles } from '../enums/role.enum';
import MemberModel from '../models/member.model';
import RoleModel from '../models/roles-permission.model';
import WorkspaceModel from '../models/workspace.model';
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '../utils/appError';

// Function to get the role of a member in a specific workspace
export const getMemberRoleWorkspace = async (userId: string, workspaceId: string) => {
  // Fetch the workspace by its ID
  const workspace = await WorkspaceModel.findById(workspaceId);

  // Throw an error if the workspace is not found
  if (!workspace) {
    throw new NotFoundException('Workspace not found');
  }

  // Find the member in the workspace and populate the role field
  const member = await MemberModel.findOne({
    userId,
    workspaceId,
  }).populate('role');

  // Throw an error if the member is not part of the workspace
  if (!member) {
    throw new UnauthorizedException(
      'Your are not member of this workspace ',
      ErrorCodeEnum.AUTH_UNAUTHORIZED_ACCESS
    );
  }

  // Return the role of the member
  return { role: member.role?.name };
};

// Function to allow a user to join a workspace using an invite code
export const joinWorkspaceByInviteService = async (
  userId: string,
  inviteCode: string
) => {
  // Find the workspace using the invite code
  const workspace = await WorkspaceModel.findOne({
    inviteCode,
  }).exec();

  // Throw an error if the workspace is not found or the invite code is invalid
  if (!workspace) {
    throw new NotFoundException('Invalid invite code or Workspace not found');
  }

  // Check if the user is already a member of the workspace
  const existingMember = await MemberModel.findOne({
    userId,
    workspaceId: workspace._id,
  }).exec();

  // Throw an error if the user is already a member
  if (existingMember) {
    throw new BadRequestException('You are already member of this workspace');
  }

  // Find the default role for new members (e.g., MEMBER role)
  const role = await RoleModel.findOne({
    name: Roles.MEMBER,
  });

  // Throw an error if the role is not found
  if (!role) {
    throw new NotFoundException('Role not found');
  }

  // Create a new member entry in the database
  const newMember = new MemberModel({
    userId, // ID of the user joining the workspace
    workspaceId: workspace._id, // ID of the workspace
    role: role._id, // Role assigned to the user
    joinedAt: new Date(), // Timestamp of when the user joined
  });

  // Save the new member to the database
  await newMember.save();

  // Return the workspace ID and the role name of the new member
  return { workspaceId: workspace._id, role: role.name };
};

