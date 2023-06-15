// frontend\src\components\routing\AdminRoute.tsx

import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../state/store";

const AdminRoute: React.FC = () => {
  const { userInformation } = useAuthStore();
  return userInformation && userInformation.isAdmin ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default AdminRoute;
