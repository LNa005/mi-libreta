export interface Subject {
  id: number
  name: string
  color: string
  created_at: string
}

export interface Note {
  id: number
  subject_id: number | null
  title: string
  content: string
  created_at: string
  updated_at: string
}

export interface Deadline {
  id: number
  subject_id: number | null
  title: string
  due_date: string
  done: boolean
  created_at: string
}

export interface Event {
  id: number
  subject_id: number | null
  title: string
  event_date: string
  description: string
  created_at: string
}

export interface Medical {
  id: number
  title: string
  appointment_date: string
  doctor: string
  notes: string
  created_at: string
}

export interface Video {
  id: number
  subject_id: number | null
  title: string
  file_path: string
  current_minute: number
  total_minutes: number
  notes: string
  created_at: string
}

export type UpcomingItem =
  | ({ kind: 'deadline' } & Deadline)
  | ({ kind: 'event' } & Event)
  | ({ kind: 'medical' } & Medical)