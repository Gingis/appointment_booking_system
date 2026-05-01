import { Request, Response, NextFunction } from 'express';
import { validationResult, body, param, query } from 'express-validator';

export const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array().map((e) => ({ field: e.type, message: e.msg })) });
    return;
  }
  next();
};

export const registerValidation = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').optional().isMobilePhone('any').withMessage('Invalid phone number'),
  body('studentId').optional().trim(),
  body('course').optional().trim(),
  body('yearLevel').optional().trim(),
  validate,
];

export const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Invalid email'),
  body('password').notEmpty().withMessage('Password is required'),
  validate,
];

export const appointmentValidation = [
  body('service').isMongoId().withMessage('Invalid service ID'),
  body('date').isISO8601().toDate().withMessage('Invalid date format'),
  body('timeSlot').matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Invalid time format (HH:MM)'),
  body('purpose').optional().isLength({ max: 300 }).withMessage('Purpose max 300 characters'),
  body('notes').optional().isLength({ max: 500 }).withMessage('Notes max 500 characters'),
  validate,
];

export const serviceValidation = [
  body('name').trim().isLength({ min: 2, max: 150 }).withMessage('Name must be 2-150 characters'),
  body('description').trim().isLength({ min: 10, max: 600 }).withMessage('Description 10-600 characters'),
  body('duration').isInt({ min: 5, max: 240 }).withMessage('Duration must be 5-240 minutes'),
  body('department').trim().notEmpty().withMessage('Department is required'),
  body('category').notEmpty().withMessage('Category is required'),
  validate,
];

export const paginationValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be 1-100'),
  validate,
];

export const mongoIdValidation = [
  param('id').isMongoId().withMessage('Invalid ID format'),
  validate,
];
