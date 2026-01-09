
export type Role = 'ADMIN' | 'STUDENT';

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  price: number;
  duration: string;
  image: string;
  status: 'active' | 'inactive';
}

export interface Session {
  id: string;
  courseId: string;
  startDate: Date;
  endDate: Date;
  capacity: number;
  enrolledCount: number;
}

export interface Enrollment {
  id: string;
  sessionId: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  enrollmentDate: Date;
  status: 'confirmed' | 'cancelled';
}

export interface DashboardStats {
  activeCourses: number;
  totalEnrollments: number;
  totalRevenue: number;
  pendingReviews: number;
}
