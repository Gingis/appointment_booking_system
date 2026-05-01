import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { User } from '../models/User';
import { Appointment } from '../models/Appointment';

export const uploadAvatar = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No file uploaded' });
      return;
    }
    const imageUrl = (req.file as Express.Multer.File & { path: string }).path;
    const user = await User.findByIdAndUpdate(req.user?._id, { avatar: imageUrl }, { new: true });
    res.json({ success: true, data: { url: imageUrl, user } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Upload failed', error });
  }
};

export const uploadAppointmentAttachment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No file uploaded' });
      return;
    }
    const fileUrl = (req.file as Express.Multer.File & { path: string }).path;
    const appointmentId = req.params.appointmentId;

    if (appointmentId) {
      await Appointment.findByIdAndUpdate(appointmentId, { $push: { attachments: fileUrl } });
    }

    res.json({ success: true, data: { url: fileUrl } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Upload failed', error });
  }
};

export const uploadServiceImage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No file uploaded' });
      return;
    }
    const imageUrl = (req.file as Express.Multer.File & { path: string }).path;
    res.json({ success: true, data: { url: imageUrl } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Upload failed', error });
  }
};
