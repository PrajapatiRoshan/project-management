import { PermissionType } from '../enums/role.enum'; // Import the PermissionType enum
import { UnauthorizedException } from './appError'; // Import the UnauthorizedException class
import { RolePermissions } from './role-permission'; // Import the RolePermissions object

export const roleGuard = (
  // Define the roleGuard function
  role: keyof typeof RolePermissions, // The role parameter should be a key of RolePermissions
  requiredPermission: PermissionType[] // The requiredPermission parameter should be an array of PermissionType
) => {
  const permission = RolePermissions[role]; // Get the permissions for the given role

  const hasPermission = requiredPermission.every((permis) => permission.includes(permis)); // Check if the role has all the required permissions

  if (!hasPermission) {
    // If the role does not have the required permissions
    throw new UnauthorizedException( // Throw an UnauthorizedException
      'You dont have necessary permission to perform this action' // Custom error message
    );
  }
};

