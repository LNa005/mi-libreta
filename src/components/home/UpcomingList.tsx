import type { Subject, Medical } from '../../types'

interface UpcomingItem {
  kind: 'deadline' | 'event' | 'medical'
  id: number
  title: string
  date: string
  subject_id: number | null
  doctor: string | null
}

interface Props {
  upcoming: UpcomingItem[]
  subjects: Subject[]
  medical: Medical[]
}

function getDaysLeft(date: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(date)
  const diff = Math.round((target.getTime() - today.getTime()) / 86400000)
  return diff
}

function getBadge(kind: string, days: number) {
  if (kind === 'event') return { label: 'Evento', cls: 'badge-event' }
  if (kind === 'medical') return { label: 'Médico', cls: 'badge-medical' }
  if (days <= 3) return { label: `${days}d`, cls: 'badge-urgent' }
  if (days <= 10) return { label: `${days}d`, cls: 'badge-soon' }
  return { label: `${days}d`, cls: 'badge-ok' }
}

export default function UpcomingList({ upcoming, subjects }: Props) {
    return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '12px 22px 40px' }}>
      <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', marginBottom: 8 }}>
        Próximamente
      </div>

      {upcoming.length === 0 && (
        <div style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', marginTop: 40 }}>
          Todo al día ✦
        </div>
      )}

      {upcoming.map((item, i) => {
        const date = new Date(item.date)
        const days = getDaysLeft(item.date)
        const badge = getBadge(item.kind, days)
        const subject = subjects.find(s => s.id === item.subject_id)
        const day = date.getDate().toString().padStart(2, '0')
        const month = date.toLocaleString('es', { month: 'short' })

        return (
          <div key={i} className="card" style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 6 }}>
            <div style={{ width: 44, minWidth: 44, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, color: 'var(--accent)', lineHeight: 1 }}>
                {day}
              </span>
              <span style={{ fontSize: 9, textTransform: 'uppercase', color: 'var(--text-muted)', marginTop: 1 }}>
                {month}
              </span>
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 500, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-primary)' }}>
                {item.title}
              </div>
              <div style={{ fontSize: 11, marginTop: 1, display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-muted)' }}>
                {subject && (
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: subject.color, flexShrink: 0 }}/>
                )}
                {item.kind === 'medical' ? (item.doctor ?? 'Cita médica') : (subject?.name ?? 'General')}
              </div>
            </div>

            <span className={`badge ${badge.cls}`}>{badge.label}</span>
          </div>
        )
      })}
    </div>
  )
}