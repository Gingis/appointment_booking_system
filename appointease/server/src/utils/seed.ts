import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { User } from '../models/User';
import { Service } from '../models/Service';

dotenv.config();

const academicServices = [
  {
    name: 'Grade Inquiry / Consultation',
    description: 'Consult with your professor or department chair about your grades, grading criteria, or request a grade review.',
    duration: 30,
    category: 'Faculty Consultation',
    department: 'Academic Affairs',
    isActive: true,
  },
  {
    name: 'Enrollment & Shifting Assistance',
    description: 'Get help with course enrollment, program shifting procedures, adding/dropping of subjects, and cross-enrollment.',
    duration: 45,
    category: 'Enrollment Assistance',
    department: 'Registrar',
    isActive: true,
  },
  {
    name: 'Transcript of Records Request',
    description: 'Request your official Transcript of Records (TOR) for employment, transfer, or further studies.',
    duration: 15,
    category: 'Registrar',
    department: 'Registrar',
    isActive: true,
  },
  {
    name: 'Guidance Counseling Session',
    description: 'Confidential counseling sessions for academic stress, personal concerns, career guidance, or mental health support.',
    duration: 60,
    category: 'Guidance Counseling',
    department: 'Guidance Office',
    isActive: true,
  },
  {
    name: 'Scholarship Application Consultation',
    description: 'Get guidance on available scholarships, requirements, application procedures, and deadlines.',
    duration: 30,
    category: 'Scholarship',
    department: 'Scholarship Office',
    isActive: true,
  },
  {
    name: 'Research / Thesis Consultation',
    description: 'Schedule a meeting with your thesis adviser to discuss your research progress, methodology, or paper review.',
    duration: 60,
    category: 'Academic Advising',
    department: 'Research Office',
    isActive: true,
  },
  {
    name: 'Library Research Assistance',
    description: 'Get help from library staff on accessing academic journals, referencing tools, and research databases.',
    duration: 30,
    category: 'Library Services',
    department: 'Library',
    isActive: true,
  },
  {
    name: 'Certificate of Enrollment',
    description: 'Request a Certificate of Enrollment for government IDs, scholarship requirements, or other official purposes.',
    duration: 10,
    category: 'Registrar',
    department: 'Registrar',
    isActive: true,
  },
  {
    name: 'Clearance Processing',
    description: 'Process your student clearance for graduation, transfer, or end-of-semester requirements.',
    duration: 30,
    category: 'Clearance',
    department: 'Student Affairs',
    isActive: true,
  },
  {
    name: 'Medical / Clinic Consultation',
    description: 'Consult the school clinic for health concerns, medical certificate requests, or vaccination records.',
    duration: 30,
    category: 'Other',
    department: 'Health Services',
    isActive: true,
  },
  {
    name: 'Financial Aid / Tuition Assistance',
    description: 'Discuss tuition payment schemes, financial aid options, or emergency assistance with the finance office.',
    duration: 30,
    category: 'Other',
    department: 'Finance Office',
    isActive: true,
  },
  {
    name: 'Student Organization Accreditation',
    description: 'Get guidance on student organization accreditation, renewal requirements, and event permit procedures.',
    duration: 45,
    category: 'Student Affairs',
    department: 'Student Affairs',
    isActive: true,
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI as string, { dbName: 'schoolbook' });
    console.log('Connected to MongoDB');

    // Clear existing
    await Service.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing data');

    // Create services
    await Service.insertMany(academicServices);
    console.log(`Seeded ${academicServices.length} academic services`);

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    await User.create({
      name: 'System Administrator',
      email: 'admin@isufst.edu.ph',
      password: adminPassword,
      role: 'admin',
      isActive: true,
    });
    console.log('Created admin user: admin@isufst.edu.ph / admin123');

    // Create sample student
    const studentPassword = await bcrypt.hash('student123', 12);
    await User.create({
      name: 'Johnny Jani Yespapang',
      email: 'Johnnyyespapang@isufst.edu.ph',
      password: studentPassword,
      role: 'user',
      studentId: '2021-00001',
      course: 'BS Information Technology',
      yearLevel: '3rd Year',
      phone: '+639123456789',
      isActive: true,
    });
    console.log('Created student user: Johnnyyespapang@isufst.edu.ph / student123');

    console.log('\nDatabase seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();