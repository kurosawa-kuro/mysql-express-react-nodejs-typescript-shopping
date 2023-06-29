// frontend\src\components\routing\PrivateRoute.tsx

import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../state/store";

export const PrivateRoute: React.FC = () => {
  const { userInfo } = useAuthStore(); // Use the userInfo from Zustand store
  return userInfo ? <Outlet /> : <Navigate to="/login" replace />;
};
