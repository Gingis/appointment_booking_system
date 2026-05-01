import mongoose, { Document, Schema } from 'mongoose';

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected';

export interface IAppointment extends Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  service: mongoose.Types.ObjectId;
  date: Date;
  timeSlot: string;
  status: AppointmentStatus;
  purpose?: string;
  notes?: string;
  attachments?: string[];
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const appointmentSchema = new Schema<IAppointment>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    service: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
    date: { type: Date, required: [true, 'Date is required'] },
    timeSlot: { type: String, required: [true, 'Time slot is required'], match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:MM)'] },
    status: { type: String, enum: ['pending','confirmed','completed','cancelled','rejected'], default: 'pending' },
    purpose: { type: String, maxlength: [300, 'Purpose max 300 characters'] },
    notes: { type: String, maxlength: [500, 'Notes max 500 characters'] },
    attachments: [{ type: String }],
    adminNotes: { type: String, maxlength: 500 },
  },
  { timestamps: true }
);

appointmentSchema.index({ user: 1, date: -1 });
appointmentSchema.index({ date: 1, timeSlot: 1, service: 1 });
appointmentSchema.index({ status: 1 });

export const Appointment = mongoose.model<IAppointment>('Appointment', appointmentSchema);
