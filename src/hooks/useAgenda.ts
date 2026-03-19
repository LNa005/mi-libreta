import { useState, useEffect, useCallback } from 'react'
import type { Deadline, Event } from '../types'

export function useAgenda() {
  const [deadlines, setDeadlines] = useState<Deadline[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [upcoming, setUpcoming] = useState<any[]>([])

  const load = useCallback(async () => {
    const [d, e, u] = await Promise.all([
      window.db.getDeadlines(),
      window.db.getEvents(),
      window.db.getUpcoming(),
    ])
    setDeadlines(d)
    setEvents(e)
    setUpcoming(u)
  }, [])

  useEffect(() => { load() }, [load])

  const addDeadline = useCallback(async (subjectId: number | null, title: string, dueDate: string) => {
    await window.db.createDeadline(subjectId, title, dueDate)
    load()
  }, [load])

  const toggleDone = useCallback(async (id: number, done: boolean) => {
    await window.db.toggleDeadline(id, done)
    load()
  }, [load])

  const removeDeadline = useCallback(async (id: number) => {
    await window.db.deleteDeadline(id)
    load()
  }, [load])

  const addEvent = useCallback(async (subjectId: number | null, title: string, eventDate: string, description: string) => {
    await window.db.createEvent(subjectId, title, eventDate, description)
    load()
  }, [load])

  const removeEvent = useCallback(async (id: number) => {
    await window.db.deleteEvent(id)
    load()
  }, [load])

  return {
    deadlines, events, upcoming,
    addDeadline, toggleDone, removeDeadline,
    addEvent, removeEvent,
    reload: load,
  }
}