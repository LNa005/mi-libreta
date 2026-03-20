import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('db', {
  getSubjects: () => ipcRenderer.invoke('db:getSubjects'),
  createSubject: (name: string, color: string) => ipcRenderer.invoke('db:createSubject', name, color),
  deleteSubject: (id: number) => ipcRenderer.invoke('db:deleteSubject', id),

  getNotes: (subjectId?: number) => ipcRenderer.invoke('db:getNotes', subjectId),
  createNote: (subjectId: number | null, title: string, content: string, noteDate?: string) => ipcRenderer.invoke('db:createNote', subjectId, title, content, noteDate),
  updateNote: (id: number, title: string, content: string, noteDate?: string) => ipcRenderer.invoke('db:updateNote', id, title, content, noteDate),
  deleteNote: (id: number) => ipcRenderer.invoke('db:deleteNote', id),

  getDeadlines: () => ipcRenderer.invoke('db:getDeadlines'),
  createDeadline: (subjectId: number | null, title: string, dueDate: string) => ipcRenderer.invoke('db:createDeadline', subjectId, title, dueDate),
  toggleDeadline: (id: number, done: boolean) => ipcRenderer.invoke('db:toggleDeadline', id, done),
  deleteDeadline: (id: number) => ipcRenderer.invoke('db:deleteDeadline', id),

  getEvents: () => ipcRenderer.invoke('db:getEvents'),
  createEvent: (subjectId: number | null, title: string, eventDate: string, description: string) => ipcRenderer.invoke('db:createEvent', subjectId, title, eventDate, description),
  deleteEvent: (id: number) => ipcRenderer.invoke('db:deleteEvent', id),

  getMedical: () => ipcRenderer.invoke('db:getMedical'),
  createMedical: (title: string, appointmentDate: string, doctor: string, notes: string) => ipcRenderer.invoke('db:createMedical', title, appointmentDate, doctor, notes),
  deleteMedical: (id: number) => ipcRenderer.invoke('db:deleteMedical', id),

  getUpcoming: () => ipcRenderer.invoke('db:getUpcoming'),

  getVideos: (subjectId?: number) => ipcRenderer.invoke('db:getVideos', subjectId),
  createVideo: (subjectId: number | null, title: string, filePath: string, totalMinutes: number) => ipcRenderer.invoke('db:createVideo', subjectId, title, filePath, totalMinutes),
  updateVideoProgress: (id: number, currentMinute: number) => ipcRenderer.invoke('db:updateVideoProgress', id, currentMinute),
  deleteVideo: (id: number) => ipcRenderer.invoke('db:deleteVideo', id),
  winMinimize: () => ipcRenderer.invoke('win:minimize'),
  winMaximize: () => ipcRenderer.invoke('win:maximize'),
  winClose: () => ipcRenderer.invoke('win:close'),
})