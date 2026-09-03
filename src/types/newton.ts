// Types for Newton School data structures

export interface NewtonProfile {
  name: string;
  email: string;
  rollNumber: string;
  semester: string;
  department: string;
  batch: string;
  avatarUrl: string;
}

export interface NewtonAttendanceSubject {
  id: string;
  name: string;
  faculty: string;
  attended: number;
  total: number;
  percentage: number;
}

export interface NewtonAttendance {
  overall: number;
  subjects: NewtonAttendanceSubject[];
}

export interface NewtonAssignment {
  id: string;
  title: string;
  subject: string;
  description: string;
  dueDate: string;
  status: "todo" | "in_progress" | "completed";
  priority: "low" | "medium" | "high";
  submissionLink?: string;
}

export interface NewtonSyncResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface SessionToken {
  cookies: string;
  timestamp: number;
}
