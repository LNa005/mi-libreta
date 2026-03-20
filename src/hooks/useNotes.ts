import { useState, useEffect, useCallback } from 'react'
import type { Note } from '../types'

export function useNotes(subjectId?: number) {
  const [notes, setNotes] = useState<Note[]>([])

  const load = useCallback(async () => {
    const data = await window.db.getNotes(subjectId ?? null)
    setNotes(data)
  }, [subjectId])

  useEffect(() => { load() }, [load])

  const add = useCallback(async (title: string, content: string, noteDate?: string) => {
    await window.db.createNote(subjectId ?? null, title, content, noteDate)
    load()
  }, [subjectId, load])

  const update = useCallback(async (id: number, title: string, content: string, noteDate?: string) => {
    await window.db.updateNote(id, title, content, noteDate)
    load()
  }, [load])

  const remove = useCallback(async (id: number) => {
    await window.db.deleteNote(id)
    load()
  }, [load])

  return { notes, add, update, remove, reload: load }
}