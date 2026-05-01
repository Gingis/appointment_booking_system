import mongoose, { Document, Schema } from 'mongoose';

export interface IService extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  duration: number;
  department: string;
  category: string;
  image?: string;
  slots: string[];
  availableDays: number[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const serviceSchema = new Schema<IService>(
  {
    name: { type: String, required: [true, 'Service name is required'], trim: true, maxlength: 150 },
    description: { type: String, required: [true, 'Description is required'], maxlength: 600 },
    duration: { type: Number, required: [true, 'Duration is required'], min: 5, max: 240 },
    department: { type: String, required: [true, 'Department is required'], trim: true },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Academic Advising', 'Faculty Consultation', 'Enrollment Assistance',
        'Clearance', 'Scholarship', 'Student Affairs', 'Registrar',
        'Guidance Counseling', 'Library Services', 'Other',
      ],
    },
    image: { type: String },
    slots: {
      type: [String],
      default: ['08:00','09:00','10:00','11:00','13:00','14:00','15:00','16:00'],
    },
    availableDays: { type: [Number], default: [1, 2, 3, 4, 5] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Service = mongoose.model<IService>('Service', serviceSchema);
