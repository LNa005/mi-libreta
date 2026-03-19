import { useState, useEffect, useCallback } from 'react'
import type { Medical } from '../types'

export function useMedical() {
  const [appointments, setAppointments] = useState<Medical[]>([])

  const load = useCallback(async () => {
    const data = await window.db.getMedical()
    setAppointments(data)
  }, [])

  useEffect(() => { load() }, [load])

  const add = useCallback(async (title: string, appointmentDate: string, doctor: string, notes: string) => {
    await window.db.createMedical(title, appointmentDate, doctor, notes)
    load()
  }, [load])

  const remove = useCallback(async (id: number) => {
    await window.db.deleteMedical(id)
    load()
  }, [load])

  return { appointments, add, remove, reload: load }
}