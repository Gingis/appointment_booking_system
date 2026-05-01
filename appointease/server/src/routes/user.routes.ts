import { Router } from 'express';
import { getUsers, getUserById, updateUserRole, toggleUserStatus, deleteUser } from '../controllers/user.controller';
import { authenticate, authorizeAdmin } from '../middleware/auth.middleware';
import { paginationValidation, mongoIdValidation } from '../middleware/validation.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management (Admin only)
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags: [Users]
 *     summary: Get all users (Admin only)
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: role
 *         schema: { type: string, enum: [admin, user] }
 *     responses:
 *       200:
 *         description: List of users
 */
router.use(authenticate, authorizeAdmin);

router.get('/', paginationValidation, getUsers);
router.get('/:id', mongoIdValidation, getUserById);
router.put('/:id/role', mongoIdValidation, updateUserRole);
router.patch('/:id/toggle-status', mongoIdValidation, toggleUserStatus);
router.delete('/:id', mongoIdValidation, deleteUser);

export default router;
