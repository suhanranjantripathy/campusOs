// Types for Newton School data structures

export interface NewtonProfile {
  name: string;
  email: string;
  rollNumber: string;
  semester: string;
  department: string;
  batch: string;
  avatarUrl: string;
  xp?: number;
}

export interface NewtonAttendanceSubject {
  id: string;
  name: string;
  code?: string;
  faculty: string;
  attended: number;
  total: number;
  percentage: number;
}

export interface NewtonLectureRecord {
  id: string;
  title: string;
  subject?: string;
  date: string;
  duration?: string;
  attended: boolean;
  notesIncluded?: boolean;
}

export interface NewtonAttendance {
  overall: number;
  overallPercentage?: number;
  attendedCount?: number;
  totalCount?: number;
  attendedLectures?: number;
  totalLectures?: number;
  subjects: NewtonAttendanceSubject[];
  lectures?: NewtonLectureRecord[];
}

export interface NewtonAssignment {
  id: string;
  title: string;
  subject: string;
  description: string;
  dueDate: string;
  status: "todo" | "in_progress" | "completed";
  priority: "low" | "medium" | "high";
  tag?: "In Class" | "Post Class" | "Quiz" | "Contest" | "Homework" | string;
  solvedText?: string;
  solveUrl?: string;
  submissionLink?: string;
}

export interface NewtonSyncResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface SessionToken {
  cookies?: string;
  token?: string;
  refreshToken?: string;
  timestamp: number;
}

