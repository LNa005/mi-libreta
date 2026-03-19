import type { Subject } from '../../types'
import { useAgenda } from '../../hooks/useAgenda'
import { useState } from 'react'

interface Props {
  subjects: Subject[]
  agenda: ReturnType<typeof useAgenda>
}

export default function AgendaPage({ subjects, agenda }: Props) {
  const [tab, setTab] = useState<'deadlines' | 'events'>('deadlines')
  const [form, setForm] = useState(false)
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [subjectId, setSubjectId] = useState<number | ''>('')
  const [description, setDescription] = useState('')

  const handleAdd = () => {
    if (!title.trim() || !date) return
    if (tab === 'deadlines') {
      agenda.addDeadline(subjectId === '' ? null : subjectId, title, date)
    } else {
      agenda.addEvent(subjectId === '' ? null : subjectId, title, date, description)
    }
    setTitle(''); setDate(''); setSubjectId(''); setDescription(''); setForm(false)
  }

  const tabStyle = (t: string) => ({
    padding: '6px 16px', borderRadius: 7, border: 'none', cursor: 'pointer',
    fontFamily: 'var(--font-main)', fontSize: 13,
    background: tab === t ? 'var(--accent)' : 'var(--bg-card)',
    color: tab === t ? '#fff' : 'var(--text-secondary)',
  })

  const inputStyle = {
    padding: '7px 10px', borderRadius: 7, border: '1px solid var(--border-card)',
    background: 'var(--bg-card)', color: 'var(--text-primary)',
    fontFamily: 'var(--font-main)', fontSize: 13, outline: 'none', width: '100%',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '16px 22px', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <button style={tabStyle('deadlines')} onClick={() => setTab('deadlines')}>Entregas</button>
          <button style={tabStyle('events')} onClick={() => setTab('events')}>Eventos</button>
        </div>
        <button onClick={() => setForm(f => !f)} style={{
          padding: '6px 14px', borderRadius: 7, border: 'none',
          background: 'var(--accent)', color: '#fff', cursor: 'pointer',
          fontFamily: 'var(--font-main)', fontSize: 13,
        }}>+ Nuevo</button>
      </div>

      {form && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 9, padding: 14, marginBottom: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <input style={inputStyle} placeholder="Título..." value={title} onChange={e => setTitle(e.target.value)} />
          <input style={inputStyle} type="date" value={date} onChange={e => setDate(e.target.value)} />
          <select style={inputStyle} value={subjectId} onChange={e => setSubjectId(e.target.value === '' ? '' : Number(e.target.value))}>
            <option value="">Sin asignatura</option>
            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          {tab === 'events' && (
            <input style={inputStyle} placeholder="Descripción..." value={description} onChange={e => setDescription(e.target.value)} />
          )}
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleAdd} style={{ padding: '6px 14px', borderRadius: 7, border: 'none', background: 'var(--accent)', color: '#fff', cursor: 'pointer', fontFamily: 'var(--font-main)', fontSize: 13 }}>Guardar</button>
            <button onClick={() => setForm(false)} style={{ padding: '6px 14px', borderRadius: 7, border: '1px solid var(--border-card)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', fontFamily: 'var(--font-main)', fontSize: 13 }}>Cancelar</button>
          </div>
        </div>
      )}

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {tab === 'deadlines' && agenda.deadlines.map(d => {
          const subject = subjects.find(s => s.id === d.subject_id)
          return (
            <div key={d.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, opacity: d.done ? 0.5 : 1 }}>
              <input type="checkbox" checked={d.done} onChange={e => agenda.toggleDone(d.id, e.target.checked)} style={{ cursor: 'pointer' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, fontSize: 13, color: 'var(--text-primary)', textDecoration: d.done ? 'line-through' : 'none' }}>{d.title}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 5 }}>
                  {subject && <div style={{ width: 6, height: 6, borderRadius: '50%', background: subject.color }} />}
                  {subject?.name ?? 'General'} · {new Date(d.due_date).toLocaleDateString('es')}
                </div>
              </div>
              <span onClick={() => agenda.removeDeadline(d.id)} style={{ fontSize: 11, color: 'var(--text-muted)', cursor: 'pointer' }}>✕</span>
            </div>
          )
        })}

        {tab === 'events' && agenda.events.map(e => {
          const subject = subjects.find(s => s.id === e.subject_id)
          return (
            <div key={e.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, fontSize: 13, color: 'var(--text-primary)' }}>{e.title}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 5 }}>
                  {subject && <div style={{ width: 6, height: 6, borderRadius: '50%', background: subject.color }} />}
                  {subject?.name ?? 'General'} · {new Date(e.event_date).toLocaleDateString('es')}
                </div>
                {e.description && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{e.description}</div>}
              </div>
              <span onClick={() => agenda.removeEvent(e.id)} style={{ fontSize: 11, color: 'var(--text-muted)', cursor: 'pointer' }}>✕</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}