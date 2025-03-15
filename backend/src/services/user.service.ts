import UserModel from '../models/user.model'; // Import UserModel
import { BadRequestException } from '../utils/appError'; // Import BadRequestException

export const getCurrentUserService = async (userId: string) => {
  // Define the getCurrentUserService function
  const user = await UserModel.findById(userId) // Find the user by ID
    .populate('currentWorkspace') // Populate the current workspace
    .select('-password'); // Exclude the password field
  if (!user) {
    // If the user is not found
    throw new BadRequestException('User not found'); // Throw a BadRequestException
  }
  return { user }; // Return the user
};

