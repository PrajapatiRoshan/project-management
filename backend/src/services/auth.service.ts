import mongoose from 'mongoose';
import { Roles } from '../enums/role.enum';
import AccountModel from '../models/account.model';
import MemberModel from '../models/member.model';
import RoleModel from '../models/roles-permission.model';
import UserModel from '../models/user.model';
import WorkspaceModel from '../models/workspace.model';
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '../utils/appError';
import { ProviderEnum } from '../enums/account-provider.enum';

export const loginOrCreateAccountService = async (data: {
  provider: string; // Authentication provider (e.g., Google, Facebook)
  displayName: string; // User's display name
  providerId: string; // Unique ID from the provider
  picture?: string; // Optional profile picture URL
  email?: string; // Optional email address
}) => {
  const { provider, displayName, providerId, picture, email } = data; // Destructure input data
  const session = await mongoose.startSession(); // Start a new MongoDB session
  try {
    session.startTransaction(); // Begin a transaction
    console.log('Started Session....'); // Log session start

    let user = await UserModel.findOne({ email }).session(session); // Check if a user with the given email exists

    if (!user) {
      // If user does not exist, create a new user
      user = new UserModel({
        email, // Set the user's email
        name: displayName, // Set the user's display name
        profilePicture: picture || null, // Set the profile picture or null if not provided
      });
      await user.save({ session }); // Save the new user in the database within the session

      const account = new AccountModel({
        userId: user._id, // Link the account to the newly created user
        provider, // Set the provider
        providerId, // Set the provider ID
      });
      await account.save({ session }); // Save the account in the database within the session

      const workspace = new WorkspaceModel({
        name: 'My Workspace', // Default workspace name
        description: `Workspace created for ${user.name}`, // Description for the workspace
        owner: user._id, // Set the user as the owner of the workspace
      });
      await workspace.save({ session }); // Save the workspace in the database within the session

      const ownerRole = await RoleModel.findOne({ name: Roles.OWNER }).session(session); // Fetch the owner role
      if (!ownerRole) {
        throw new Error('Owner role not found'); // Throw an error if the owner role is not found
      }

      const memeber = new MemberModel({
        userId: user._id, // Link the member to the user
        workspaceId: workspace._id, // Link the member to the workspace
        role: ownerRole._id, // Assign the owner role to the member
        joinedAt: new Date(), // Set the join date to the current date
      });
      await memeber.save({ session }); // Save the member in the database within the session

      user.currentWorkspace = workspace._id as mongoose.Types.ObjectId; // Set the user's current workspace
      await user.save({ session }); // Save the updated user in the database within the session
    }
    await session.commitTransaction(); // Commit the transaction
    session.endSession(); // End the session
    console.log('End session...'); // Log session end
    return { user }; // Return the user object
  } catch (error) {
    await session.abortTransaction(); // Abort the transaction in case of an error
    session.endSession(); // End the session
    throw error; // Rethrow the error
  } finally {
    session.endSession(); // Ensure the session is ended
  }
};

export const registerUserService = async (body: {
  email: string; // User's email address
  name: string; // User's name
  password: string; // User's password
}) => {
  const { email, name, password } = body; // Destructure the input body
  const session = await mongoose.startSession(); // Start a new MongoDB session
  try {
    session.startTransaction(); // Begin a transaction
    const existingUser = await UserModel.findOne({ email }).session(session); // Check if a user with the given email already exists
    if (existingUser) {
      throw new BadRequestException('User already exists'); // Throw an error if the user exists
    }
    const user = new UserModel({
      email, // Set the user's email
      name, // Set the user's name
      password, // Set the user's password
    });
    await user.save({ session }); // Save the new user in the database within the session

    const account = new AccountModel({
      userId: user._id, // Link the account to the newly created user
      provider: ProviderEnum.EMAIL, // Set the provider as email
      providerId: email, // Use the email as the provider ID
    });
    await account.save({ session }); // Save the account in the database within the session

    const workspace = new WorkspaceModel({
      name: 'My Workspace',
      description: `Workspace created for ${user.name}`,
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

    await session.commitTransaction();
    session.endSession();
    return { userId: user._id, workspaceId: workspace._id };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  } finally {
    session.endSession();
  }
};

export const verifyUserService = async ({
  email, // User's email address
  password, // User's password
  provider = ProviderEnum.EMAIL, // Default provider is email
}: {
  email: string; // Email address
  password: string; // Password
  provider?: string; // Optional provider
}) => {
  const account = await AccountModel.findOne({ provider, providerId: email }); // Find the account by provider and provider ID
  if (!account) {
    throw new BadRequestException('Invalid email or password'); // Throw an error if the account is not found
  }
  const user = await UserModel.findById(account.userId); // Find the user by the account's user ID
  if (!user) {
    throw new NotFoundException('User not found'); // Throw an error if the user is not found
  }
  const isPasswordValid = await user.comparePassword(password); // Validate the password
  if (!isPasswordValid) {
    throw new UnauthorizedException('Invalid email or password'); // Throw an error if the password is invalid
  }
  return user.omitPassword(); // Return the user object without the password
};

export const findUserById = async (userId: string) => {
  const user = await UserModel.findById(userId, {
    password: false,
  }); // Find the user by their ID
  return user || null; // Return the user object
};

