import { useState } from 'react'
import { useMedical } from '../../hooks/useMedical'

interface Props {
  medical: ReturnType<typeof useMedical>
}

export default function MedicalPage({ medical }: Props) {
  const [form, setForm] = useState(false)
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [doctor, setDoctor] = useState('')
  const [notes, setNotes] = useState('')

  const handleAdd = () => {
    if (!title.trim() || !date) return
    medical.add(title, date, doctor, notes)
    setTitle(''); setDate(''); setDoctor(''); setNotes(''); setForm(false)
  }

  const inputStyle = {
    padding: '7px 10px', borderRadius: 7, border: '1px solid var(--border-card)',
    background: 'var(--bg-card)', color: 'var(--text-primary)',
    fontFamily: 'var(--font-main)', fontSize: 13, outline: 'none', width: '100%',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '16px 22px', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 500, color: 'var(--text-primary)' }}>Citas médicas</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{medical.appointments.length} citas</div>
        </div>
        <button onClick={() => setForm(f => !f)} style={{
          padding: '6px 14px', borderRadius: 7, border: 'none',
          background: 'var(--accent)', color: '#fff', cursor: 'pointer',
          fontFamily: 'var(--font-main)', fontSize: 13,
        }}>+ Nueva cita</button>
      </div>

      {form && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 9, padding: 14, marginBottom: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <input style={inputStyle} placeholder="Motivo de la cita..." value={title} onChange={e => setTitle(e.target.value)} />
          <input style={inputStyle} type="datetime-local" value={date} onChange={e => setDate(e.target.value)} />
          <input style={inputStyle} placeholder="Médico / especialista..." value={doctor} onChange={e => setDoctor(e.target.value)} />
          <input style={inputStyle} placeholder="Notas adicionales..." value={notes} onChange={e => setNotes(e.target.value)} />
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleAdd} style={{ padding: '6px 14px', borderRadius: 7, border: 'none', background: 'var(--accent)', color: '#fff', cursor: 'pointer', fontFamily: 'var(--font-main)', fontSize: 13 }}>Guardar</button>
            <button onClick={() => setForm(false)} style={{ padding: '6px 14px', borderRadius: 7, border: '1px solid var(--border-card)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', fontFamily: 'var(--font-main)', fontSize: 13 }}>Cancelar</button>
          </div>
        </div>
      )}

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {medical.appointments.length === 0 && (
          <div style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', marginTop: 40 }}>
            Sin citas próximas ✦
          </div>
        )}
        {medical.appointments.map(a => (
          <div key={a.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{ width: 44, minWidth: 44, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, color: '#993556', lineHeight: 1 }}>
                {new Date(a.appointment_date).getDate().toString().padStart(2, '0')}
              </span>
              <span style={{ fontSize: 9, textTransform: 'uppercase', color: 'var(--text-muted)', marginTop: 1 }}>
                {new Date(a.appointment_date).toLocaleString('es', { month: 'short' })}
              </span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 500, fontSize: 13, color: 'var(--text-primary)' }}>{a.title}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                {a.doctor || 'Sin médico'} · {new Date(a.appointment_date).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}
              </div>
              {a.notes && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{a.notes}</div>}
            </div>
            <span className="badge badge-medical">Médico</span>
            <span onClick={() => medical.remove(a.id)} style={{ fontSize: 11, color: 'var(--text-muted)', cursor: 'pointer' }}>✕</span>
          </div>
        ))}
      </div>
    </div>
  )
}