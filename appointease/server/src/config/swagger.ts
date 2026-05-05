import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'School Appointment Booking System API',
      version: '1.0.0',
      description: 'Full-Stack Appointment Booking System API',
      contact: { name: 'SchoolBook Team' },
    },
    servers: [
      { url: 'https://appointment-booking-system-akmq.onrender.com', description: 'Production' },
      { url: 'http://localhost:3000', description: 'Development' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);