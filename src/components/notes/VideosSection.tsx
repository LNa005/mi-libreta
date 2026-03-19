import { useState } from 'react'
import { useVideos } from '../../hooks/useVideos'
import type { Video } from '../../types'

interface Props {
  subjectId: number | undefined
}

function formatMinutes(m: number) {
  const h = Math.floor(m / 60)
  const min = m % 60
  return h > 0 ? `${h}h ${min}m` : `${min}m`
}

export default function VideosSection({ subjectId }: Props) {
  const { videos, add, updateProgress, remove } = useVideos(subjectId)
  const [form, setForm] = useState(false)
  const [title, setTitle] = useState('')
  const [filePath, setFilePath] = useState('')
  const [totalMinutes, setTotalMinutes] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editMinute, setEditMinute] = useState('')

  const handleAdd = async () => {
    if (!title.trim() || !filePath.trim()) return
    await add(title, filePath, Number(totalMinutes) || 0)
    setTitle(''); setFilePath(''); setTotalMinutes(''); setForm(false)
  }

  const handleProgress = (v: Video) => {
    setEditingId(v.id)
    setEditMinute(String(v.current_minute))
  }

  const handleSaveProgress = async (id: number) => {
    await updateProgress(id, Number(editMinute))
    setEditingId(null)
  }

  const inputStyle = {
    padding: '6px 10px', borderRadius: 7, border: '1px solid var(--border-card)',
    background: 'var(--bg-card)', color: 'var(--text-primary)',
    fontFamily: 'var(--font-main)', fontSize: 12, outline: 'none', width: '100%',
  }

  return (
    <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border-sidebar)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)' }}>
          Vídeos
        </span>
        <button onClick={() => setForm(f => !f)} style={{
          width: 22, height: 22, borderRadius: 5, border: 'none',
          background: 'var(--accent)', color: '#fff', cursor: 'pointer', fontSize: 14,
        }}>+</button>
      </div>

      {form && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10 }}>
          <input style={inputStyle} placeholder="Título del vídeo..." value={title} onChange={e => setTitle(e.target.value)} />
          <input style={inputStyle} placeholder="Ruta del archivo (ej: C:/Videos/clase1.mp4)" value={filePath} onChange={e => setFilePath(e.target.value)} />
          <input style={inputStyle} type="number" placeholder="Duración total en minutos" value={totalMinutes} onChange={e => setTotalMinutes(e.target.value)} />
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={handleAdd} style={{ flex: 1, padding: '5px', borderRadius: 6, border: 'none', background: 'var(--accent)', color: '#fff', cursor: 'pointer', fontFamily: 'var(--font-main)', fontSize: 12 }}>Guardar</button>
            <button onClick={() => setForm(false)} style={{ flex: 1, padding: '5px', borderRadius: 6, border: '1px solid var(--border-card)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', fontFamily: 'var(--font-main)', fontSize: 12 }}>Cancelar</button>
          </div>
        </div>
      )}

      {videos.map(v => {
        const pct = v.total_minutes > 0 ? Math.round((v.current_minute / v.total_minutes) * 100) : 0
        return (
          <div key={v.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 8, padding: '8px 10px', marginBottom: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{v.title}</span>
              <span onClick={() => remove(v.id)} style={{ fontSize: 10, color: 'var(--text-muted)', cursor: 'pointer', marginLeft: 8 }}>✕</span>
            </div>

            <div style={{ marginTop: 6, height: 4, background: 'var(--border-card)', borderRadius: 2 }}>
              <div style={{ height: '100%', width: `${pct}%`, background: 'var(--accent)', borderRadius: 2, transition: 'width 0.3s' }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', marginTop: 5 }}>
              {editingId === v.id ? (
                <div style={{ display: 'flex', gap: 4, alignItems: 'center', flex: 1 }}>
                  <input
                    type="number"
                    value={editMinute}
                    onChange={e => setEditMinute(e.target.value)}
                    style={{ ...inputStyle, width: 70 }}
                  />
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>min</span>
                  <button onClick={() => handleSaveProgress(v.id)} style={{ padding: '3px 8px', borderRadius: 5, border: 'none', background: 'var(--accent)', color: '#fff', cursor: 'pointer', fontSize: 11 }}>OK</button>
                  <button onClick={() => setEditingId(null)} style={{ padding: '3px 8px', borderRadius: 5, border: '1px solid var(--border-card)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 11 }}>✕</button>
                </div>
              ) : (
                <span onClick={() => handleProgress(v)} style={{ fontSize: 11, color: 'var(--text-muted)', cursor: 'pointer' }}>
                  {formatMinutes(v.current_minute)} / {formatMinutes(v.total_minutes)} · {pct}%
                </span>
              )}
            </div>
          </div>
        )
      })}

      {videos.length === 0 && !form && (
        <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', padding: '8px 0' }}>Sin vídeos</div>
      )}
    </div>
  )
}