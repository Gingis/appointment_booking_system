import { Response } from 'express';
import { Appointment } from '../models/Appointment';
import { AuthRequest } from '../middleware/auth.middleware';
import { getPaginationParams } from '../utils/jwt';

export const createAppointment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { service, date, timeSlot, notes } = req.body;

    // Check for conflicts
    const conflict = await Appointment.findOne({
      service,
      date: new Date(date),
      timeSlot,
      status: { $in: ['pending', 'confirmed'] },
    });
    if (conflict) {
      res.status(409).json({ success: false, message: 'This time slot is already booked' });
      return;
    }

    const appointment = await Appointment.create({
      user: req.user?._id,
      service,
      date: new Date(date),
      timeSlot,
      notes,
    });
    await appointment.populate(['user', 'service']);
    res.status(201).json({ success: true, data: { appointment } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create appointment', error });
  }
};

export const getAppointments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query.page as string, req.query.limit as string);
    const { status, search, startDate, endDate } = req.query;

    const filter: Record<string, unknown> = {};

    // Regular users only see their own appointments
    if (req.user?.role !== 'admin') {
      filter.user = req.user?._id;
    }

    if (status) filter.status = status;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) (filter.date as Record<string, unknown>).$gte = new Date(startDate as string);
      if (endDate) (filter.date as Record<string, unknown>).$lte = new Date(endDate as string);
    }

    const [appointments, total] = await Promise.all([
      Appointment.find(filter)
        .populate('user', 'name email phone')
        .populate('service', 'name duration price category')
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit),
      Appointment.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: {
        appointments,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch appointments', error });
  }
};

export const getAppointmentById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('user', 'name email phone avatar')
      .populate('service');

    if (!appointment) {
      res.status(404).json({ success: false, message: 'Appointment not found' });
      return;
    }

    // Non-admins can only view their own
    if (req.user?.role !== 'admin' && appointment.user._id.toString() !== req.user?._id.toString()) {
      res.status(403).json({ success: false, message: 'Access denied' });
      return;
    }

    res.json({ success: true, data: { appointment } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch appointment', error });
  }
};

export const updateAppointment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      res.status(404).json({ success: false, message: 'Appointment not found' });
      return;
    }

    // Ownership check for non-admins
    if (req.user?.role !== 'admin' && appointment.user.toString() !== req.user?._id.toString()) {
      res.status(403).json({ success: false, message: 'Access denied' });
      return;
    }

    const allowedUpdates = req.user?.role === 'admin'
      ? ['status', 'adminNotes', 'date', 'timeSlot', 'service']
      : ['date', 'timeSlot', 'notes', 'service'];

    const updates: Record<string, unknown> = {};
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const updated = await Appointment.findByIdAndUpdate(req.params.id, updates, { new: true })
      .populate('user', 'name email')
      .populate('service');

    res.json({ success: true, data: { appointment: updated } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Update failed', error });
  }
};

export const cancelAppointment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      res.status(404).json({ success: false, message: 'Appointment not found' });
      return;
    }
    if (req.user?.role !== 'admin' && appointment.user.toString() !== req.user?._id.toString()) {
      res.status(403).json({ success: false, message: 'Access denied' });
      return;
    }
    if (['completed', 'cancelled'].includes(appointment.status)) {
      res.status(400).json({ success: false, message: `Cannot cancel a ${appointment.status} appointment` });
      return;
    }
    appointment.status = 'cancelled';
    await appointment.save();
    res.json({ success: true, message: 'Appointment cancelled', data: { appointment } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Cancellation failed', error });
  }
};

export const getStats = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [total, pending, confirmed, completed, cancelled] = await Promise.all([
      Appointment.countDocuments(),
      Appointment.countDocuments({ status: 'pending' }),
      Appointment.countDocuments({ status: 'confirmed' }),
      Appointment.countDocuments({ status: 'completed' }),
      Appointment.countDocuments({ status: 'cancelled' }),
    ]);
    res.json({ success: true, data: { stats: { total, pending, confirmed, completed, cancelled } } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch stats', error });
  }
};
