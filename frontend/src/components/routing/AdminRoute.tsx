// frontend\src\components\routing\AdminRoute.tsx

import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../state/store";

export const AdminRoute: React.FC = () => {
  const { userInfo } = useAuthStore();
  return userInfo && userInfo.isAdmin ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  );
};
