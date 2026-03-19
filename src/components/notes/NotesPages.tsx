import { useState } from 'react'
import type { Subject, Note } from '../../types'
import { useNotes } from '../../hooks/useNotes'
import VideosSection from './VideosSection'

interface Props {
  subjects: Subject[]
  selectedSubject: number | undefined
}

export default function NotesPage({ subjects, selectedSubject }: Props) {
  const { notes, add, update, remove } = useNotes(selectedSubject)
  const [activeNote, setActiveNote] = useState<number | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [creating, setCreating] = useState(false)

  const openNote = (id: number, t: string, c: string) => {
    setActiveNote(id)
    setTitle(t)
    setContent(c)
    setCreating(false)
  }

  const handleSave = () => {
    if (!title.trim()) return
    if (creating) {
      add(title, content)
    } else if (activeNote !== null) {
      update(activeNote, title, content)
    }
    setActiveNote(null)
    setCreating(false)
    setTitle('')
    setContent('')
  }

  const subject = subjects.find(s => s.id === selectedSubject)

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      <div style={{ width: 240, borderRight: '1px solid var(--border-sidebar)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '16px 16px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 500, color: 'var(--text-primary)' }}>
              {subject ? subject.name : 'Todas las notas'}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{notes.length} entradas</div>
          </div>
          <button
            onClick={() => { setCreating(true); setActiveNote(null); setTitle(''); setContent('') }}
            style={{
              width: 28, height: 28, borderRadius: 7, border: 'none',
              background: 'var(--accent)', color: '#fff', cursor: 'pointer',
              fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >+</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '0 10px 10px' }}>
          {notes.length === 0 && (
            <div style={{ color: 'var(--text-muted)', fontSize: 12, textAlign: 'center', marginTop: 30 }}>
              Sin notas aún
            </div>
          )}
          {notes.map((note: Note) => (
            <div
              key={note.id}
              onClick={() => openNote(note.id, note.title, note.content)}
              className="card"
              style={{
                marginBottom: 6,
                background: activeNote === note.id ? 'var(--bg-nav-hover)' : 'var(--bg-card)',
                borderColor: activeNote === note.id ? 'var(--accent)' : 'var(--border-card)',
              }}
            >
              <div style={{ fontWeight: 500, fontSize: 13, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {note.title}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {note.content || 'Sin contenido'}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                  {new Date(note.updated_at).toLocaleDateString('es')}
                </span>
                <span
                  onClick={e => { e.stopPropagation(); remove(note.id) }}
                  style={{ fontSize: 10, color: 'var(--text-muted)', cursor: 'pointer' }}
                >✕</span>
              </div>
            </div>
          ))}
        </div>

        <VideosSection subjectId={selectedSubject} />
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px 22px', overflow: 'hidden' }}>
        {(activeNote !== null || creating) ? (
          <>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Título..."
              style={{
                fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 500,
                border: 'none', outline: 'none', background: 'transparent',
                color: 'var(--text-primary)', marginBottom: 12,
              }}
            />
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Escribe aquí..."
              style={{
                flex: 1, border: 'none', outline: 'none', background: 'transparent',
                color: 'var(--text-primary)', fontFamily: 'var(--font-main)',
                fontSize: 13, lineHeight: 1.7, resize: 'none',
              }}
            />
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button onClick={handleSave} style={{
                padding: '6px 16px', borderRadius: 7, border: 'none',
                background: 'var(--accent)', color: '#fff', cursor: 'pointer',
                fontFamily: 'var(--font-main)', fontSize: 13,
              }}>Guardar</button>
              <button onClick={() => { setActiveNote(null); setCreating(false) }} style={{
                padding: '6px 16px', borderRadius: 7,
                border: '1px solid var(--border-card)', background: 'transparent',
                color: 'var(--text-muted)', cursor: 'pointer',
                fontFamily: 'var(--font-main)', fontSize: 13,
              }}>Cancelar</button>
            </div>
          </>
        ) : (
          <div style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', marginTop: 80 }}>
            Selecciona una nota o crea una nueva
          </div>
        )}
      </div>
    </div>
  )
}