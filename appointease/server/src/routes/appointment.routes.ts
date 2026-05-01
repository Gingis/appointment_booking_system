import { Router } from 'express';
import {
  createAppointment, getAppointments, getAppointmentById,
  updateAppointment, cancelAppointment, getStats
} from '../controllers/appointment.controller';
import { authenticate, authorizeAdmin } from '../middleware/auth.middleware';
import { appointmentValidation, paginationValidation, mongoIdValidation } from '../middleware/validation.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Appointments
 *   description: Appointment management
 */

/**
 * @swagger
 * /api/appointments:
 *   get:
 *     tags: [Appointments]
 *     summary: Get appointments (admin sees all, users see own)
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [pending, confirmed, completed, cancelled, rejected] }
 *       - in: query
 *         name: startDate
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: endDate
 *         schema: { type: string, format: date }
 *     responses:
 *       200:
 *         description: List of appointments with pagination
 */
router.get('/', authenticate, paginationValidation, getAppointments);

/**
 * @swagger
 * /api/appointments/stats:
 *   get:
 *     tags: [Appointments]
 *     summary: Get appointment statistics (Admin only)
 *     responses:
 *       200:
 *         description: Appointment stats
 */
router.get('/stats', authenticate, authorizeAdmin, getStats);

/**
 * @swagger
 * /api/appointments/{id}:
 *   get:
 *     tags: [Appointments]
 *     summary: Get single appointment by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Appointment data
 *       404:
 *         description: Not found
 */
router.get('/:id', authenticate, mongoIdValidation, getAppointmentById);

/**
 * @swagger
 * /api/appointments:
 *   post:
 *     tags: [Appointments]
 *     summary: Book a new appointment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [service, date, timeSlot]
 *             properties:
 *               service: { type: string, description: "Service ID" }
 *               date: { type: string, format: date }
 *               timeSlot: { type: string, example: "09:00" }
 *               notes: { type: string }
 *     responses:
 *       201:
 *         description: Appointment booked
 *       409:
 *         description: Time slot already taken
 */
router.post('/', authenticate, appointmentValidation, createAppointment);

/**
 * @swagger
 * /api/appointments/{id}:
 *   put:
 *     tags: [Appointments]
 *     summary: Update appointment
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Updated appointment
 */
router.put('/:id', authenticate, mongoIdValidation, updateAppointment);

/**
 * @swagger
 * /api/appointments/{id}/cancel:
 *   patch:
 *     tags: [Appointments]
 *     summary: Cancel an appointment
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Appointment cancelled
 */
router.patch('/:id/cancel', authenticate, mongoIdValidation, cancelAppointment);

export default router;
