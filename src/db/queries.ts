import db from './database'
import type { Subject, Note, Deadline, Event, Medical } from '../types'

// ── Subjects ──────────────────────────────────────────
export const getSubjects = (): Subject[] =>
  db.prepare('SELECT * FROM subjects ORDER BY name').all() as Subject[]

export const createSubject = (name: string, color: string): Subject =>
  db.prepare('INSERT INTO subjects (name, color) VALUES (?, ?) RETURNING *')
    .get(name, color) as Subject

export const deleteSubject = (id: number) =>
  void db.prepare('DELETE FROM subjects WHERE id = ?').run(id)

// ── Notes ─────────────────────────────────────────────
export const getNotes = (subjectId?: number): Note[] => {
  if (subjectId) {
    return db.prepare('SELECT * FROM notes WHERE subject_id = ? ORDER BY updated_at DESC')
      .all(subjectId) as Note[]
  }
  return db.prepare('SELECT * FROM notes ORDER BY updated_at DESC').all() as Note[]
}

export const createNote = (subjectId: number | null, title: string, content: string): Note =>
  db.prepare('INSERT INTO notes (subject_id, title, content) VALUES (?, ?, ?) RETURNING *')
    .get(subjectId, title, content) as Note

export const updateNote = (id: number, title: string, content: string) =>
  void db.prepare("UPDATE notes SET title = ?, content = ?, updated_at = datetime('now') WHERE id = ?")
    .run(title, content, id)

export const deleteNote = (id: number) =>
  void db.prepare('DELETE FROM notes WHERE id = ?').run(id)

// ── Deadlines ─────────────────────────────────────────
export const getDeadlines = (done?: boolean): Deadline[] => {
  if (done !== undefined) {
    return db.prepare('SELECT * FROM deadlines WHERE done = ? ORDER BY due_date ASC')
      .all(done ? 1 : 0) as Deadline[]
  }
  return db.prepare('SELECT * FROM deadlines ORDER BY due_date ASC').all() as Deadline[]
}

export const createDeadline = (subjectId: number | null, title: string, dueDate: string): Deadline =>
  db.prepare('INSERT INTO deadlines (subject_id, title, due_date) VALUES (?, ?, ?) RETURNING *')
    .get(subjectId, title, dueDate) as Deadline

export const toggleDeadline = (id: number, done: boolean) =>
  void db.prepare('UPDATE deadlines SET done = ? WHERE id = ?').run(done ? 1 : 0, id)

export const deleteDeadline = (id: number) =>
  void db.prepare('DELETE FROM deadlines WHERE id = ?').run(id)

// ── Events ────────────────────────────────────────────
export const getEvents = (): Event[] =>
  db.prepare('SELECT * FROM events ORDER BY event_date ASC').all() as Event[]

export const createEvent = (subjectId: number | null, title: string, eventDate: string, description: string): Event =>
  db.prepare('INSERT INTO events (subject_id, title, event_date, description) VALUES (?, ?, ?, ?) RETURNING *')
    .get(subjectId, title, eventDate, description) as Event

export const deleteEvent = (id: number) =>
  void db.prepare('DELETE FROM events WHERE id = ?').run(id)

// ── Medical ───────────────────────────────────────────
export const getMedical = (): Medical[] =>
  db.prepare('SELECT * FROM medical ORDER BY appointment_date ASC').all() as Medical[]

export const createMedical = (title: string, appointmentDate: string, doctor: string, notes: string): Medical =>
  db.prepare('INSERT INTO medical (title, appointment_date, doctor, notes) VALUES (?, ?, ?, ?) RETURNING *')
    .get(title, appointmentDate, doctor, notes) as Medical

export const deleteMedical = (id: number) =>
  void db.prepare('DELETE FROM medical WHERE id = ?').run(id)

// ── Upcoming (todo mezclado por fecha) ────────────────
export const getUpcoming = (limit = 20) => {
  const deadlines = db.prepare(`
    SELECT 'deadline' as kind, id, title, due_date as date, subject_id, NULL as doctor
    FROM deadlines WHERE done = 0 AND due_date >= date('now')
  `).all()

  const events = db.prepare(`
    SELECT 'event' as kind, id, title, event_date as date, subject_id, NULL as doctor
    FROM events WHERE event_date >= date('now')
  `).all()

  const medical = db.prepare(`
    SELECT 'medical' as kind, id, title, appointment_date as date, NULL as subject_id, doctor
    FROM medical WHERE appointment_date >= date('now')
  `).all()

  return [...deadlines, ...events, ...medical]
    .sort((a: any, b: any) => a.date.localeCompare(b.date))
    .slice(0, limit)
}