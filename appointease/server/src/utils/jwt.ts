import jwt, { SignOptions } from 'jsonwebtoken';
import { IUser } from '../models/User';

export const generateToken = (user: IUser): string => {
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as SignOptions['expiresIn']
  };
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET as string,
    options
  );
};

export const generateRefreshToken = (user: IUser): string => {
  const options: SignOptions = {
    expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '30d') as SignOptions['expiresIn']
  };
  return jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET as string,
    options
  );
};

export const getPaginationParams = (page: string | undefined, limit: string | undefined) => {
  const pageNum = Math.max(1, parseInt(page || '1'));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit || '10')));
  const skip = (pageNum - 1) * limitNum;
  return { page: pageNum, limit: limitNum, skip };
};