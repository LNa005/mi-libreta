import { useState } from 'react'
import type { Subject } from '../../types'
import { useAgenda } from '../../hooks/useAgenda'

interface Props {
  subjects: Subject[]
  agenda: ReturnType<typeof useAgenda>
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  const d = new Date(year, month, 1).getDay()
  return d === 0 ? 6 : d - 1
}

const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
const DAYS = ['L','M','X','J','V','S','D']

export default function CalendarPage({ subjects, agenda }: Props) {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())

  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)
  const today = now.toISOString().split('T')[0]

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1) } else setMonth(m => m - 1) }
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1) } else setMonth(m => m + 1) }

  const getItemsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const deadlines = agenda.deadlines.filter(d => d.due_date === dateStr)
    const events = agenda.events.filter(e => e.event_date === dateStr)
    return [...deadlines.map(d => ({ ...d, kind: 'deadline' })), ...events.map(e => ({ ...e, kind: 'event' }))]
  }

  const cells: (number | null)[] = [
  ...Array.from({ length: firstDay }, () => null),
  ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '16px 22px', overflow: 'hidden' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '27px 1fr 27px', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <button onClick={prevMonth} style={{ width: 27, height: 27, borderRadius: 7, cursor: 'pointer', background: 'var(--bg-card)', border: '1px solid var(--border-card)', color: 'var(--accent)', fontSize: 14 }}>‹</button>
        <div style={{ textAlign: 'center', fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 500, color: 'var(--text-primary)' }}>
          {MONTHS[month]} {year}
        </div>
        <button onClick={nextMonth} style={{ width: 27, height: 27, borderRadius: 7, cursor: 'pointer', background: 'var(--bg-card)', border: '1px solid var(--border-card)', color: 'var(--accent)', fontSize: 14 }}>›</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 4 }}>
        {DAYS.map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '4px 0' }}>{d}</div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3, flex: 1, overflowY: 'auto' }}>
        {cells.map((day, i) => {
          if (!day) return <div key={i} />
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const isToday = dateStr === today
          const items = getItemsForDay(day)

          return (
            <div key={i} style={{
              minHeight: 64, borderRadius: 7, padding: '5px 6px',
              background: isToday ? 'var(--accent-soft)' : 'var(--bg-card)',
              border: `1px solid ${isToday ? 'var(--accent)' : 'var(--border-card)'}`,
            }}>
              <div style={{ fontSize: 12, fontWeight: isToday ? 600 : 400, color: isToday ? 'var(--accent)' : 'var(--text-secondary)', marginBottom: 3 }}>
                {day}
              </div>
              {items.slice(0, 2).map((item: any, j: number) => {
                const subject = subjects.find(s => s.id === item.subject_id)
                return (
                  <div key={j} style={{
                    fontSize: 9, padding: '1px 4px', borderRadius: 3, marginBottom: 2,
                    background: subject ? subject.color + '55' : '#eef1ff',
                    color: 'var(--text-secondary)',
                    overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
                  }}>
                    {item.title}
                  </div>
                )
              })}
              {items.length > 2 && <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>+{items.length - 2}</div>}
            </div>
          )
        })}
      </div>
    </div>
  )
}