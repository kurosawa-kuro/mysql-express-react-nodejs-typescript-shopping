// backend\routes\userRoutes.js

// External Imports
import express from 'express';

// Internal Imports
import {
  loginUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

// Create Router
const router = express.Router();

// User Registration Route
router.route('/register').post(registerUser);

// User Login and Logout Routes
router.post('/login', loginUser);
router.post('/logout', logoutUser);

// User Profile Routes (Get and Update)
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// User Management Routes (Admin Access Only)
router
  .route('/:id')
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser);

// Get Users Route (Admin Access Only)
router.route('/').get(protect, admin, getUsers);

// Export Router
export default router;
