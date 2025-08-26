export type UserRole = 'user' | 'patient' | 'doctor';

export interface User {
  id: string;
  email: string;
  username?: string;
  role: UserRole;
  first_name?: string;
  last_name?: string;
  details?: any;
  created_at: string;
}

export interface Doctor {
  id: string;
  doctor_id: string;
  name: string;
  email: string;
  specialization: string;
  created_at: string;
}

export interface Appointment {
  id: string;
  patient_id?: string;
  family_id?: string;
  therapist_id?: string;
  patient_name: string;
  username: string;
  details: string;
  appointment_date: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
  notes?: string;
}

export interface PatientProgress {
  id: string;
  patient_id: string;
  week: string;
  health_score: number;
  symptoms: string[];
  notes: string;
  created_at: string;
}

export interface Schedule {
  id: string;
  patient_id: string;
  doctor_id: string;
  title: string;
  description: string;
  schedule_date: string;
  time: string;
  created_at: string;
}