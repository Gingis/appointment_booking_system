export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  avatar?: string;
  phone?: string;
  studentId?: string;
  course?: string;
  yearLevel?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Service {
  _id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  department: string;
  category: string;
  image?: string;
  slots: string[];
  availableDays: number[];
  isActive: boolean;
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected';

export interface Appointment {
  _id: string;
  user: User;
  service: Service;
  date: string;
  timeSlot: string;
  status: AppointmentStatus;
  purpose?: string;
  notes?: string;
  attachments?: string[];
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: { field: string; message: string }[];
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface AppointmentStats {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
}