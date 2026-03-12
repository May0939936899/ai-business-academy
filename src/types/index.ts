import type {
  User,
  Course,
  Lesson,
  Enrollment,
  LessonProgress,
  Quiz,
  QuizQuestion,
  QuizAttempt,
  Certificate,
  Resource,
  WebsiteContent,
  Testimonial,
  FAQ,
  Role,
  UserStatus,
  CourseLevel,
  CourseStatus,
  EnrollmentStatus,
  CorrectAnswer,
} from "@prisma/client";

// ─── Re-exports from Prisma ─────────────────────────────────────────────────

export type {
  User,
  Course,
  Lesson,
  Enrollment,
  LessonProgress,
  Quiz,
  QuizQuestion,
  QuizAttempt,
  Certificate,
  Resource,
  WebsiteContent,
  Testimonial,
  FAQ,
};

export {
  Role,
  UserStatus,
  CourseLevel,
  CourseStatus,
  EnrollmentStatus,
  CorrectAnswer,
};

// ─── API Response Types ──────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// ─── Composite / Extended Types ──────────────────────────────────────────────

export interface CourseWithLessons extends Course {
  lessons: Lesson[];
  instructor: Pick<User, "id" | "fullName" | "profileImage"> | null;
  _count?: {
    enrollments: number;
    lessons: number;
    quizzes: number;
  };
}

export interface CourseWithDetails extends CourseWithLessons {
  quizzes: QuizWithQuestions[];
  enrollments?: Enrollment[];
}

export interface EnrollmentWithCourse extends Enrollment {
  course: Course & {
    _count?: {
      lessons: number;
    };
    instructor: Pick<User, "id" | "fullName" | "profileImage"> | null;
  };
}

export interface EnrollmentWithProgress extends EnrollmentWithCourse {
  lessonProgress?: LessonProgress[];
}

export interface QuizWithQuestions extends Quiz {
  questions: QuizQuestion[];
}

export interface QuizAttemptWithDetails extends QuizAttempt {
  quiz: Quiz & {
    course: Pick<Course, "id" | "title" | "slug">;
  };
}

export interface LessonWithResources extends Lesson {
  resources: Resource[];
}

export interface CertificateWithDetails extends Certificate {
  user: Pick<User, "id" | "fullName" | "email">;
  course: Pick<Course, "id" | "title" | "slug">;
}

// ─── Auth Types ──────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  profileImage: string | null;
  status: UserStatus;
  createdAt: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

// ─── Form / Input Types ─────────────────────────────────────────────────────

export interface CreateCourseInput {
  title: string;
  slug?: string;
  description: string;
  shortDescription?: string;
  category: string;
  level: CourseLevel;
  duration?: string;
  thumbnail?: string;
  isFree?: boolean;
  hasCertificate?: boolean;
  instructorId?: string;
}

export interface CreateLessonInput {
  courseId: string;
  title: string;
  description?: string;
  youtubeUrl?: string;
  lessonOrder: number;
  summary?: string;
}

export interface CreateQuizInput {
  courseId: string;
  title: string;
  passingScore?: number;
  questions: CreateQuizQuestionInput[];
}

export interface CreateQuizQuestionInput {
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: CorrectAnswer;
  explanation?: string;
  sortOrder: number;
}

export interface SubmitQuizInput {
  quizId: string;
  answers: Record<string, CorrectAnswer>;
}

// ─── Dashboard / Analytics Types ─────────────────────────────────────────────

export interface DashboardStats {
  totalStudents: number;
  totalCourses: number;
  totalEnrollments: number;
  totalCertificates: number;
  completionRate: number;
}

export interface CourseStats {
  courseId: string;
  title: string;
  enrollments: number;
  completions: number;
  averageProgress: number;
}
