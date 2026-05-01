import { Request, Response } from 'express';
import { User } from '../models/User';
import { generateToken, generateRefreshToken } from '../utils/jwt';
import { AuthRequest } from '../middleware/auth.middleware';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, phone } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      res.status(409).json({ success: false, message: 'Email already registered' });
      return;
    }
    const user = await User.create({ name, email, password, phone });
    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);
    res.status(201).json({ success: true, message: 'Registration successful', data: { user, token, refreshToken } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Registration failed', error });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !user.isActive) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }
    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);
    res.json({ success: true, message: 'Login successful', data: { user, token, refreshToken } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Login failed', error });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  res.json({ success: true, data: { user: req.user } });
};

export const logout = async (_req: AuthRequest, res: Response): Promise<void> => {
  res.json({ success: true, message: 'Logged out successfully' });
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, phone, studentId, course, yearLevel } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user?._id,
      { name, phone, studentId, course, yearLevel },
      { new: true, runValidators: true }
    );
    res.json({ success: true, data: { user } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Update failed', error });
  }
};

export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user?._id).select('+password');
    if (!user || !(await user.comparePassword(currentPassword))) {
      res.status(400).json({ success: false, message: 'Current password is incorrect' });
      return;
    }
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Password change failed', error });
  }
};
