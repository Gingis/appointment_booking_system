import { Router } from 'express';
import { register, login, getMe, logout, updateProfile, changePassword } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { registerValidation, loginValidation } from '../middleware/validation.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string, example: "Juan Dela Cruz" }
 *               email: { type: string, example: "juan@example.com" }
 *               password: { type: string, example: "password123" }
 *               phone: { type: string, example: "+639123456789" }
 *     responses:
 *       201:
 *         description: Registration successful
 *       409:
 *         description: Email already registered
 */
router.post('/register', registerValidation, register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', loginValidation, login);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Get current user
 *     responses:
 *       200:
 *         description: Current user data
 */
router.get('/me', authenticate, getMe);
router.post('/logout', authenticate, logout);
router.put('/profile', authenticate, updateProfile);
router.put('/password', authenticate, changePassword);

export default router;
