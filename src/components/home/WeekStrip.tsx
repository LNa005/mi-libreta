import { useState } from 'react'
import { useAgenda } from '../../hooks/useAgenda'
import type { Subject, Deadline, Event as AgendaEvent } from '../../types'

interface Props {
  agenda: ReturnType<typeof useAgenda>
  subjects: Subject[]
}

const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

function getWeekDates(offset: number): Date[] {
  const now = new Date()
  const day = now.getDay() === 0 ? 6 : now.getDay() - 1
  const monday = new Date(now)
  monday.setDate(now.getDate() - day + offset * 7)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })
}

function formatDate(d: Date): string {
  return d.toISOString().split('T')[0]
}

export default function WeekStrip({ agenda, subjects }: Props) {
  const [weekOffset, setWeekOffset] = useState(0)
  const dates = getWeekDates(weekOffset)
  const today = formatDate(new Date())

  const weekLabel = `Semana del ${dates[0].getDate()} de ${dates[0].toLocaleString('es', { month: 'long' })}`

  const getEventsForDay = (date: string) => {
    const deadlines = agenda.deadlines.filter((d: Deadline) => d.due_date === date)
    const events = agenda.events.filter((e: AgendaEvent) => e.event_date === date)
    return { deadlines, events }
  }

  const getSubjectColor = (subjectId: number | null): string => {
    if (!subjectId) return '#b5c8f0'
    return subjects.find(s => s.id === subjectId)?.color ?? '#b5c8f0'
  }

  const getSubjectShort = (subjectId: number | null): string => {
    if (!subjectId) return 'Ent'
    return subjects.find(s => s.id === subjectId)?.name.slice(0, 4) ?? 'Ent'
  }

  return (
    <div style={{ padding: '16px 22px 0' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '27px 1fr 27px', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <button
          onClick={() => setWeekOffset(w => w - 1)}
          style={{
            width: 27, height: 27, borderRadius: 7, cursor: 'pointer',
            background: 'var(--bg-card)', border: '1px solid var(--border-card)',
            color: 'var(--accent)', fontSize: 14, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}
        >‹</button>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 500, color: 'var(--text-primary)' }}>
            {weekLabel}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
            {agenda.deadlines.filter((d: Deadline) => !d.done).length} entregas · {agenda.events.length} eventos
          </div>
        </div>

        <button
          onClick={() => setWeekOffset(w => w + 1)}
          style={{
            width: 27, height: 27, borderRadius: 7, cursor: 'pointer',
            background: 'var(--bg-card)', border: '1px solid var(--border-card)',
            color: 'var(--accent)', fontSize: 14, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}
        >›</button>
      </div>

      <div style={{ display: 'flex', gap: 5 }}>
        {dates.map((date, i) => {
          const dateStr = formatDate(date)
          const isToday = dateStr === today
          const { deadlines, events } = getEventsForDay(dateStr)

          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: 4 }}>
                {DAYS[i]}
              </div>
              <div style={{
                width: 29, height: 29, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 500,
                background: isToday ? 'var(--accent)' : 'transparent',
                color: isToday ? '#fff' : 'var(--text-secondary)',
              }}>
                {date.getDate()}
              </div>
              <div style={{ width: '100%', marginTop: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {deadlines.map((d: Deadline) => (
                  <div key={d.id} style={{
                    width: '100%', padding: '2px 4px', borderRadius: 4,
                    fontSize: 9, fontWeight: 500, textAlign: 'center',
                    overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
                    background: getSubjectColor(d.subject_id) + '55',
                    color: 'var(--text-secondary)',
                  }}>
                    {getSubjectShort(d.subject_id)}
                  </div>
                ))}
                {events.map((e: AgendaEvent) => (
                  <div key={e.id} style={{
                    width: '100%', padding: '2px 4px', borderRadius: 4,
                    fontSize: 9, fontWeight: 500, textAlign: 'center',
                    overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
                    background: '#eef1ff',
                    color: 'var(--accent)',
                  }}>
                    {e.title.slice(0, 4)}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}