import React from "react";
import { PermissionType } from "@/constant";

type PermissionsGuardProps = {
  requiredPermission: PermissionType;
  children: React.ReactNode;
  showMessage?: boolean;
};

const PermissionsGuard: React.FC<PermissionsGuardProps> = () => {
  return <></>;
};

export default PermissionsGuard;
