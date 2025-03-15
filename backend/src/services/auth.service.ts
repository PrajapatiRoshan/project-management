import mongoose from 'mongoose';
import { Roles } from '../enums/role.enum';
import AccountModel from '../models/account.model';
import MemberModel from '../models/member.model';
import RoleModel from '../models/roles-permission.model';
import UserModel from '../models/user.model';
import WorkspaceModel from '../models/workspace.model';

export const loginOrCreateAccountService = async (data: {
  provider: string;
  displayName: string;
  providerId: string;
  picture?: string;
  email?: string;
}) => {
  const { provider, displayName, providerId, picture, email } = data;
  const session = await UserModel.startSession();
  try {
    session.startTransaction();
    console.log('Started Session....');

    let user = await UserModel.findOne({ email }).session(session);

    if (!user) {
      user = new UserModel({
        email,
        name: displayName,
        profilePicture: picture || null,
      });
      await user.save({ session });

      const account = new AccountModel({
        userId: user._id,
        provider,
        providerId,
      });
      await account.save({ session });

      const workspace = new WorkspaceModel({
        name: 'My Workspace',
        description: `Worksapce created for ${user.name}}`,
        owner: user._id,
      });
      await workspace.save({ session });

      const ownerRole = await RoleModel.findOne({ name: Roles.OWNER }).session(session);
      if (!ownerRole) {
        throw new Error('Owner role not found');
      }

      const memeber = new MemberModel({
        userId: user._id,
        workspaceId: workspace._id,
        role: ownerRole._id,
        joinedAt: new Date(),
      });
      await memeber.save({ session });

      user.currentWorkspace = workspace._id as mongoose.Types.ObjectId;
      await user.save({ session });
    }
    await session.commitTransaction();
    session.endSession();
    console.log('End session...');
    return { user };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  } finally {
    session.endSession();
  }
};

