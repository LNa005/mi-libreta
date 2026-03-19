import { useState, useEffect, useRef } from 'react'
import type { Subject } from '../../types'
import type { useAgenda } from '../../hooks/useAgenda'
import type { useMedical } from '../../hooks/useMedical'
import type { View } from '../../App'

interface Props {
  onClose: () => void
  subjects: Subject[]
  agenda: ReturnType<typeof useAgenda>
  medical: ReturnType<typeof useMedical>
  setView: (v: View) => void
}

type CmdKind = 'note' | 'deadline' | 'event' | 'medical'

const COMMANDS = [
  { label: 'Nueva entrada de notas', kind: 'note' as CmdKind, tag: 'Nota' },
  { label: 'Nueva entrega', kind: 'deadline' as CmdKind, tag: 'Agenda' },
  { label: 'Nuevo evento', kind: 'event' as CmdKind, tag: 'Agenda' },
  { label: 'Nueva cita médica', kind: 'medical' as CmdKind, tag: 'Médico' },
]

export default function CommandPalette({ onClose, subjects, agenda, medical, setView }: Props) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const [step, setStep] = useState<null | CmdKind>(null)
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [subjectId, setSubjectId] = useState<number | ''>('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { inputRef.current?.focus() }, [step])

  const filtered = COMMANDS.filter(c => c.label.toLowerCase().includes(query.toLowerCase()))

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
    if (e.key === 'ArrowDown') setSelected(s => Math.min(s + 1, filtered.length - 1))
    if (e.key === 'ArrowUp') setSelected(s => Math.max(s - 1, 0))
    if (e.key === 'Enter' && !step) {
      if (filtered[selected]) setStep(filtered[selected].kind)
    }
  }

  const handleSubmit = () => {
    if (!title.trim() || !date) return
    if (step === 'deadline') { agenda.addDeadline(subjectId === '' ? null : subjectId, title, date); setView('agenda') }
    if (step === 'event') { agenda.addEvent(subjectId === '' ? null : subjectId, title, date, ''); setView('agenda') }
    if (step === 'medical') { medical.add(title, date, '', ''); setView('medical') }
    if (step === 'note') { setView('notes') }
    onClose()
  }

  const inputStyle = {
    padding: '7px 10px', borderRadius: 7, border: '1px solid var(--border-card)',
    background: 'var(--bg-card)', color: 'var(--text-primary)',
    fontFamily: 'var(--font-main)', fontSize: 13, outline: 'none', width: '100%',
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'absolute', inset: 0,
        background: 'rgba(15,20,60,0.25)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        paddingTop: 90, borderRadius: 14, zIndex: 100,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: 420, background: 'var(--bg-sidebar)',
          backdropFilter: 'var(--blur)', borderRadius: 12,
          border: '1px solid var(--border-card)', overflow: 'hidden',
        }}
      >
        {!step ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 15px', borderBottom: '1px solid var(--border-card)' }}>
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="var(--accent)" strokeWidth="1.5">
                <circle cx="6.5" cy="6.5" r="4"/><path d="M11 11l2.5 2.5"/>
              </svg>
              <input
                ref={inputRef}
                value={query}
                onChange={e => { setQuery(e.target.value); setSelected(0) }}
                onKeyDown={handleKey}
                placeholder="Escribe un comando..."
                style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', color: 'var(--text-primary)', fontFamily: 'var(--font-main)', fontSize: 14 }}
              />
              <kbd style={{ fontSize: 10, background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 4, padding: '2px 6px', color: 'var(--text-muted)' }}>Esc</kbd>
            </div>
            <div style={{ padding: '5px 0 8px' }}>
              {filtered.map((cmd, i) => (
                <div
                  key={cmd.kind}
                  onClick={() => setStep(cmd.kind)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '8px 15px', cursor: 'pointer',
                    background: i === selected ? 'var(--bg-nav-hover)' : 'transparent',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <span style={{ flex: 1, fontSize: 13 }}>{cmd.label}</span>
                  <span style={{ fontSize: 10, background: 'var(--accent-soft)', color: 'var(--accent)', padding: '2px 7px', borderRadius: 4 }}>{cmd.tag}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 4 }}>
              {COMMANDS.find(c => c.kind === step)?.label}
            </div>
            <input ref={inputRef} style={inputStyle} placeholder="Título..." value={title} onChange={e => setTitle(e.target.value)} onKeyDown={e => e.key === 'Escape' && onClose()} />
            {step !== 'note' && (
              <input style={inputStyle} type={step === 'medical' ? 'datetime-local' : 'date'} value={date} onChange={e => setDate(e.target.value)} />
            )}
            {(step === 'deadline' || step === 'event') && (
              <select style={inputStyle} value={subjectId} onChange={e => setSubjectId(e.target.value === '' ? '' : Number(e.target.value))}>
                <option value="">Sin asignatura</option>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            )}
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={handleSubmit} style={{ padding: '6px 14px', borderRadius: 7, border: 'none', background: 'var(--accent)', color: '#fff', cursor: 'pointer', fontFamily: 'var(--font-main)', fontSize: 13 }}>Crear</button>
              <button onClick={() => setStep(null)} style={{ padding: '6px 14px', borderRadius: 7, border: '1px solid var(--border-card)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', fontFamily: 'var(--font-main)', fontSize: 13 }}>Atrás</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}