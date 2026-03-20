import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'node:path'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const Database = require('better-sqlite3')
const __dirname = path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Z]:)/, '$1')
let win: BrowserWindow | null

const db = new Database(path.join(app.getPath('userData'), 'mi-libreta.db'))

db.exec(`
  CREATE TABLE IF NOT EXISTS subjects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    color TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  subject_id INTEGER REFERENCES subjects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT DEFAULT '',
  note_date TEXT DEFAULT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS deadlines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject_id INTEGER REFERENCES subjects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    due_date TEXT NOT NULL,
    done INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject_id INTEGER REFERENCES subjects(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    event_date TEXT NOT NULL,
    description TEXT DEFAULT '',
    created_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS medical (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    appointment_date TEXT NOT NULL,
    doctor TEXT DEFAULT '',
    notes TEXT DEFAULT '',
    created_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS videos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject_id INTEGER REFERENCES subjects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    file_path TEXT NOT NULL,
    current_minute INTEGER DEFAULT 0,
    total_minutes INTEGER DEFAULT 0,
    notes TEXT DEFAULT '',
    created_at TEXT DEFAULT (datetime('now'))
  );
`)
try {
  db.prepare('ALTER TABLE notes ADD COLUMN note_date TEXT DEFAULT NULL').run()
} catch {}

ipcMain.handle('db:getSubjects', () => db.prepare('SELECT * FROM subjects ORDER BY name').all())
ipcMain.handle('db:createSubject', (_, name, color) => db.prepare('INSERT INTO subjects (name, color) VALUES (?, ?) RETURNING *').get(name, color))
ipcMain.handle('db:deleteSubject', (_, id) => db.prepare('DELETE FROM subjects WHERE id = ?').run(id))

ipcMain.handle('db:getNotes', (_, subjectId) => {
  if (subjectId) return db.prepare('SELECT * FROM notes WHERE subject_id = ? ORDER BY updated_at DESC').all(subjectId)
  return db.prepare('SELECT * FROM notes ORDER BY updated_at DESC').all()
})
ipcMain.handle('db:createNote', (_, subjectId, title, content, noteDate) =>
  db.prepare('INSERT INTO notes (subject_id, title, content, note_date) VALUES (?, ?, ?, ?) RETURNING *')
    .get(subjectId, title, content, noteDate ?? null))

ipcMain.handle('db:updateNote', (_, id, title, content, noteDate) =>
  db.prepare("UPDATE notes SET title = ?, content = ?, note_date = ?, updated_at = datetime('now') WHERE id = ?")
    .run(title, content, noteDate ?? null, id))
ipcMain.handle('db:deleteNote', (_, id) => db.prepare('DELETE FROM notes WHERE id = ?').run(id))

ipcMain.handle('db:getDeadlines', () => db.prepare('SELECT * FROM deadlines ORDER BY due_date ASC').all())
ipcMain.handle('db:createDeadline', (_, subjectId, title, dueDate) => db.prepare('INSERT INTO deadlines (subject_id, title, due_date) VALUES (?, ?, ?) RETURNING *').get(subjectId, title, dueDate))
ipcMain.handle('db:toggleDeadline', (_, id, done) => db.prepare('UPDATE deadlines SET done = ? WHERE id = ?').run(done ? 1 : 0, id))
ipcMain.handle('db:deleteDeadline', (_, id) => db.prepare('DELETE FROM deadlines WHERE id = ?').run(id))

ipcMain.handle('db:getEvents', () => db.prepare('SELECT * FROM events ORDER BY event_date ASC').all())
ipcMain.handle('db:createEvent', (_, subjectId, title, eventDate, description) => db.prepare('INSERT INTO events (subject_id, title, event_date, description) VALUES (?, ?, ?, ?) RETURNING *').get(subjectId, title, eventDate, description))
ipcMain.handle('db:deleteEvent', (_, id) => db.prepare('DELETE FROM events WHERE id = ?').run(id))

ipcMain.handle('db:getMedical', () => db.prepare('SELECT * FROM medical ORDER BY appointment_date ASC').all())
ipcMain.handle('db:createMedical', (_, title, appointmentDate, doctor, notes) => db.prepare('INSERT INTO medical (title, appointment_date, doctor, notes) VALUES (?, ?, ?, ?) RETURNING *').get(title, appointmentDate, doctor, notes))
ipcMain.handle('db:deleteMedical', (_, id) => db.prepare('DELETE FROM medical WHERE id = ?').run(id))

ipcMain.handle('db:getVideos', (_, subjectId) => {
  if (subjectId) return db.prepare('SELECT * FROM videos WHERE subject_id = ? ORDER BY created_at DESC').all(subjectId)
  return db.prepare('SELECT * FROM videos ORDER BY created_at DESC').all()
})
ipcMain.handle('db:createVideo', (_, subjectId, title, filePath, totalMinutes) =>
  db.prepare('INSERT INTO videos (subject_id, title, file_path, total_minutes) VALUES (?, ?, ?, ?) RETURNING *').get(subjectId, title, filePath, totalMinutes))
ipcMain.handle('db:updateVideoProgress', (_, id, currentMinute) =>
  db.prepare('UPDATE videos SET current_minute = ? WHERE id = ?').run(currentMinute, id))
ipcMain.handle('db:deleteVideo', (_, id) =>
  db.prepare('DELETE FROM videos WHERE id = ?').run(id))

ipcMain.handle('db:getUpcoming', () => {
  const deadlines = db.prepare(`SELECT 'deadline' as kind, id, title, due_date as date, subject_id, NULL as doctor FROM deadlines WHERE done = 0 AND due_date >= date('now')`).all()
  const events = db.prepare(`SELECT 'event' as kind, id, title, event_date as date, subject_id, NULL as doctor FROM events WHERE event_date >= date('now')`).all()
  const medical = db.prepare(`SELECT 'medical' as kind, id, title, appointment_date as date, NULL as subject_id, doctor FROM medical WHERE appointment_date >= date('now')`).all()
  return [...deadlines, ...events, ...medical].sort((a: any, b: any) => a.date.localeCompare(b.date)).slice(0, 20)
})
ipcMain.handle('win:minimize', () => win?.minimize())
ipcMain.handle('win:maximize', () => { if (win?.isMaximized()) win.unmaximize(); else win?.maximize() })
ipcMain.handle('win:close', () => win?.close())

function createWindow() {
win = new BrowserWindow({
  width: 900,
  height: 650,
  minWidth: 700,
  minHeight: 500,
  frame: false,
  transparent: true,
  backgroundMaterial: 'acrylic',
  webPreferences: {
    preload: path.join(__dirname, '../dist-electron/preload.js'),
    contextIsolation: true,
    nodeIntegration: false,
  },
})

  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:5173')
    win.webContents.openDevTools()
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') { app.quit(); win = null }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})