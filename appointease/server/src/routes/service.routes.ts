import { Router } from 'express';
import {
  getServices, getServiceById, createService,
  updateService, deleteService, getCategories
} from '../controllers/service.controller';
import { authenticate, authorizeAdmin } from '../middleware/auth.middleware';
import { serviceValidation, paginationValidation, mongoIdValidation } from '../middleware/validation.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Services
 *   description: Service management
 */

/**
 * @swagger
 * /api/services:
 *   get:
 *     tags: [Services]
 *     summary: Get all active services
 *     security: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of services
 */
router.get('/', paginationValidation, getServices);
router.get('/categories', getCategories);
router.get('/:id', mongoIdValidation, getServiceById);

/**
 * @swagger
 * /api/services:
 *   post:
 *     tags: [Services]
 *     summary: Create a new service (Admin only)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, description, duration, price, category]
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               duration: { type: integer, description: "Minutes" }
 *               price: { type: number }
 *               category: { type: string }
 *               image: { type: string }
 *     responses:
 *       201:
 *         description: Service created
 */
router.post('/', authenticate, authorizeAdmin, serviceValidation, createService);
router.put('/:id', authenticate, authorizeAdmin, mongoIdValidation, updateService);
router.delete('/:id', authenticate, authorizeAdmin, mongoIdValidation, deleteService);

export default router;
