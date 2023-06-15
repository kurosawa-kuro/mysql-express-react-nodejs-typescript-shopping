// frontend\src\components\routing\PrivateRoute.jsx

import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../state/store";

export const PrivateRoute: React.FC = () => {
  const { userInformation } = useAuthStore(); // Use the userInfo from Zustand store
  return userInformation ? <Outlet /> : <Navigate to="/login" replace />;
};
