import { ErrorCodeEnum } from '../enums/error-code.enum';
import MemberModel from '../models/member.model';
import WorkspaceModel from '../models/workspace.model';
import { NotFoundException, UnauthorizedException } from '../utils/appError';

export const getMemberRoleWorkspace = async (userId: string, workspaceId: string) => {
  const workspace = await WorkspaceModel.findById(workspaceId);

  if (!workspace) {
    throw new NotFoundException('Workspace not found');
  }

  const member = await MemberModel.findOne({
    userId,
    workspaceId,
  }).populate('role');

  if (!member) {
    throw new UnauthorizedException(
      'Your are not member of this workspace ',
      ErrorCodeEnum.AUTH_UNAUTHORIZED_ACCESS
    );
  }

  return { role: member.role?.name };
};

