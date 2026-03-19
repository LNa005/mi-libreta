import { useState, useEffect, useCallback } from 'react'
import type { Subject } from '../types'

declare global {
  interface Window {
    db: any
  }
}

export function useSubjects() {
  const [subjects, setSubjects] = useState<Subject[]>([])

  const load = useCallback(async () => {
    const data = await window.db.getSubjects()
    setSubjects(data)
  }, [])

  useEffect(() => { load() }, [load])

  const add = useCallback(async (name: string, color: string) => {
    await window.db.createSubject(name, color)
    load()
  }, [load])

  const remove = useCallback(async (id: number) => {
    await window.db.deleteSubject(id)
    load()
  }, [load])

  return { subjects, add, remove, reload: load }
}