
import { Course, Session, Enrollment } from './types';

export const INITIAL_COURSES: Course[] = [
  {
    id: '1',
    title: 'Fotografía Básica Digital',
    description: 'Aprende los fundamentos de la fotografía digital, desde el manejo de la cámara hasta la composición básica.',
    instructor: 'Marco Polo',
    price: 150,
    duration: '20 horas',
    image: 'https://picsum.photos/seed/photo/800/600',
    status: 'active'
  },
  {
    id: '2',
    title: 'Marketing Digital Avanzado',
    description: 'Estrategias avanzadas de SEO, SEM y Redes Sociales para negocios en crecimiento.',
    instructor: 'Lucía Fernández',
    price: 299,
    duration: '40 horas',
    image: 'https://picsum.photos/seed/marketing/800/600',
    status: 'active'
  },
  {
    id: '3',
    title: 'Introducción a Python',
    description: 'Comienza tu carrera en programación con el lenguaje más versátil y popular del momento.',
    instructor: 'Alan Turing Jr.',
    price: 199,
    duration: '30 horas',
    image: 'https://picsum.photos/seed/python/800/600',
    status: 'active'
  },
  {
    id: '4',
    title: 'Cocina Italiana Tradicional',
    description: 'Domina el arte de la pasta fresca y las salsas clásicas de la Nonna.',
    instructor: 'Giuseppe Rossi',
    price: 85,
    duration: '8 horas',
    image: 'https://picsum.photos/seed/cooking/800/600',
    status: 'active'
  }
];

// Generate some sessions for the current month
const now = new Date();
const year = now.getFullYear();
const month = now.getMonth();

export const INITIAL_SESSIONS: Session[] = [
  {
    id: 's1',
    courseId: '1',
    startDate: new Date(year, month, 14, 10, 0),
    endDate: new Date(year, month, 14, 13, 0),
    capacity: 15,
    enrolledCount: 5
  },
  {
    id: 's2',
    courseId: '3',
    startDate: new Date(year, month, 16, 18, 0),
    endDate: new Date(year, month, 16, 21, 0),
    capacity: 20,
    enrolledCount: 18
  },
  {
    id: 's3',
    courseId: '4',
    startDate: new Date(year, month, 22, 17, 0),
    endDate: new Date(year, month, 22, 20, 0),
    capacity: 10,
    enrolledCount: 10
  },
  {
    id: 's4',
    courseId: '2',
    startDate: new Date(year, month, 5, 9, 0),
    endDate: new Date(year, month, 5, 12, 0),
    capacity: 25,
    enrolledCount: 12
  },
  {
    id: 's5',
    courseId: '1',
    startDate: new Date(year, month, 10, 15, 0),
    endDate: new Date(year, month, 10, 18, 0),
    capacity: 15,
    enrolledCount: 14
  },
  {
    id: 's6',
    courseId: '3',
    startDate: new Date(year, month, 28, 10, 0),
    endDate: new Date(year, month, 28, 13, 0),
    capacity: 20,
    enrolledCount: 2
  }
];

export const INITIAL_ENROLLMENTS: Enrollment[] = [
  {
    id: 'e1',
    sessionId: 's1',
    studentName: 'Juan Pérez',
    studentEmail: 'juan@example.com',
    studentPhone: '123456789',
    enrollmentDate: new Date(),
    status: 'confirmed'
  },
  {
    id: 'e2',
    sessionId: 's2',
    studentName: 'Maria Garcia',
    studentEmail: 'maria@example.com',
    studentPhone: '987654321',
    enrollmentDate: new Date(),
    status: 'confirmed'
  }
];
