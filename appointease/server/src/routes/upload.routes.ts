import { Router } from 'express';
import { uploadAvatar, uploadAppointmentAttachment, uploadServiceImage } from '../controllers/upload.controller';
import { authenticate, authorizeAdmin } from '../middleware/auth.middleware';
import { upload } from '../config/cloudinary';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: File upload endpoints
 */

/**
 * @swagger
 * /api/upload/avatar:
 *   post:
 *     tags: [Upload]
 *     summary: Upload user avatar
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Avatar uploaded, returns URL
 */
router.post('/avatar', authenticate, upload.single('avatar'), uploadAvatar);

/**
 * @swagger
 * /api/upload/appointment/{appointmentId}:
 *   post:
 *     tags: [Upload]
 *     summary: Upload appointment attachment
 *     parameters:
 *       - in: path
 *         name: appointmentId
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: File uploaded, returns URL
 */
router.post('/appointment/:appointmentId', authenticate, upload.single('file'), uploadAppointmentAttachment);

/**
 * @swagger
 * /api/upload/service:
 *   post:
 *     tags: [Upload]
 *     summary: Upload service image (Admin only)
 *     responses:
 *       200:
 *         description: Image uploaded
 */
router.post('/service', authenticate, authorizeAdmin, upload.single('image'), uploadServiceImage);

export default router;
