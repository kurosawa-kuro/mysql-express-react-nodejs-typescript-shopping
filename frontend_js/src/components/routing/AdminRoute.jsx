// frontend\src\components\routing\AdminRoute.jsx

import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../state/store';  // Import Zustand store

const AdminRoute = () => {
  const { userInfo } = useAuthStore(); // Use the userInfo from Zustand store
  return userInfo && userInfo.isAdmin ? (
    <Outlet />
  ) : (
    <Navigate to='/login' replace />
  );
};
export default AdminRoute;
