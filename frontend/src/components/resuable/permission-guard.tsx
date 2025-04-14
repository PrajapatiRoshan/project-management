import React from 'react';
import { PermissionType } from '@/constant';
import { useAuthContext } from '@/context/auth-provider';

type PermissionsGuardProps = {
  requiredPermission: PermissionType;
  children: React.ReactNode;
  showMessage?: boolean;
};

const PermissionsGuard: React.FC<PermissionsGuardProps> = ({
  requiredPermission,
  showMessage = false,
  children,
}) => {
  const { hasPermission } = useAuthContext();
  if (!hasPermission(requiredPermission)) {
    return (
      showMessage && (
        <div
          className="text-center 
      text-sm pt-3
      italic
      w-full
      text-muted-foreground"
        >
          You dont have the permission to view this{' '}
        </div>
      )
    );
  }
  return <>{children}</>;
};

export default PermissionsGuard;

