import type { View } from '../../App'
import type { Subject } from '../../types'
import { useState } from 'react'

interface Props {
  view: View
  setView: (v: View) => void
  subjects: Subject[]
  selectedSubject: number | undefined
  setSelectedSubject: (id: number | undefined) => void
  addSubject: (name: string, color: string) => void
  removeSubject: (id: number) => void
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

const PASTEL_COLORS = [
  '#b5c8f0', '#a8d8b9', '#f4c2a1', '#c5b8f0',
  '#f0d0a0', '#a8d4e8', '#f0b8c8', '#b8e0d0',
]

const navItems: { id: View; label: string; icon: string }[] = [
  { id: 'home',     label: 'Inicio',     icon: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z' },
  { id: 'notes',    label: 'Notas',      icon: 'M4 6h16M4 10h16M4 14h10' },
  { id: 'agenda',   label: 'Entregas',   icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  { id: 'calendar', label: 'Calendario', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { id: 'medical',  label: 'Médico',     icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
]

export default function Sidebar({ view, setView, subjects, selectedSubject, setSelectedSubject, addSubject, removeSubject: _removeSubject, theme, toggleTheme }: Props) {
  const [adding, setAdding] = useState(false)
  const [newName, setNewName] = useState('')
  const [newColor, setNewColor] = useState(PASTEL_COLORS[0])

  const handleAdd = () => {
    if (!newName.trim()) return
    addSubject(newName.trim(), newColor)
    setNewName('')
    setNewColor(PASTEL_COLORS[0])
    setAdding(false)
  }

  return (
    <aside style={{
      width: 205,
      minWidth: 205,
      background: 'var(--bg-sidebar)',
      borderRight: '1px solid var(--border-sidebar)',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px 0 12px',
      fontFamily: 'var(--font-main)',
    }}>

      {/* Logo + theme toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px 18px' }}>
        <span style={{ fontSize: 22, fontWeight: 600, color: 'var(--accent)' }}>✦</span>
        <button onClick={toggleTheme} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: 15, color: 'var(--text-muted)',
        }}>
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>

      {/* Nav */}
      <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 16px', marginBottom: 5 }}>Vistas</div>
      {navItems.map(item => (
        <div
          key={item.id}
          className={`nav-item${view === item.id ? ' active' : ''}`}
          onClick={() => setView(item.id)}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d={item.icon} strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {item.label}
        </div>
      ))}

      {/* Divider */}
      <div style={{ height: 1, background: 'var(--border-sidebar)', margin: '10px 0' }}/>

      {/* Subjects */}
      <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 16px', marginBottom: 5 }}>Asignaturas</div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {subjects.map(s => (
          <div
            key={s.id}
            onClick={() => { setSelectedSubject(s.id === selectedSubject ? undefined : s.id); setView('notes') }}
            style={{
              display: 'flex', alignItems: 'center', gap: 9,
              padding: '5px 16px', cursor: 'pointer',
              background: selectedSubject === s.id ? 'var(--bg-nav-hover)' : 'transparent',
              color: 'var(--text-secondary)',
            }}
          >
            <div style={{
              width: 11, height: 11, borderRadius: '50%',
              background: s.color, flexShrink: 0,
              border: '1.5px solid rgba(0,0,0,0.07)',
            }}/>
            <span style={{ fontSize: 12, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {s.name}
            </span>
          </div>
        ))}
      </div>

      {/* Add subject */}
      {adding ? (
        <div style={{ padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <input
            autoFocus
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleAdd(); if (e.key === 'Escape') setAdding(false) }}
            placeholder="Nombre..."
            style={{
              padding: '5px 8px', borderRadius: 6, border: '1px solid var(--border-card)',
              background: 'var(--bg-card)', color: 'var(--text-primary)',
              fontFamily: 'var(--font-main)', fontSize: 12, outline: 'none',
            }}
          />
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {PASTEL_COLORS.map(c => (
              <div
                key={c}
                onClick={() => setNewColor(c)}
                style={{
                  width: 16, height: 16, borderRadius: '50%', background: c,
                  cursor: 'pointer', border: newColor === c ? '2px solid var(--accent)' : '1.5px solid rgba(0,0,0,0.1)',
                }}
              />
            ))}
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={handleAdd} style={{
              flex: 1, padding: '4px', borderRadius: 6, border: 'none',
              background: 'var(--accent)', color: '#fff', cursor: 'pointer',
              fontFamily: 'var(--font-main)', fontSize: 12,
            }}>Añadir</button>
            <button onClick={() => setAdding(false)} style={{
              flex: 1, padding: '4px', borderRadius: 6,
              border: '1px solid var(--border-card)', background: 'transparent',
              color: 'var(--text-muted)', cursor: 'pointer',
              fontFamily: 'var(--font-main)', fontSize: 12,
            }}>Cancelar</button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => setAdding(true)}
          style={{
            margin: '8px 12px 0', padding: '6px 10px', borderRadius: 8,
            border: '1px dashed var(--border-card)', color: 'var(--text-muted)',
            fontSize: 11, textAlign: 'center', cursor: 'pointer',
          }}
        >
          + Nueva asignatura
        </div>
      )}
    </aside>
  )
}