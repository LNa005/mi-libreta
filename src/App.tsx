import { useState, useEffect } from 'react'
import Sidebar from './components/layout/Sidebar'
import HomePage from './components/home/HomePage'
import NotesPage from './components/notes/NotesPages'
import AgendaPage from './components/agenda/AgendaPage'
import CalendarPage from './components/calendar/CalendarPage'
import MedicalPage from './components/medical/MedicalPage'
import CommandPalette from './components/layout/CommandPalette'
import TitleBar from './components/layout/TitleBar'
import { useSubjects } from './hooks/useSubjects'
import { useAgenda } from './hooks/useAgenda'
import { useMedical } from './hooks/useMedical'

export type View = 'home' | 'notes' | 'agenda' | 'calendar' | 'medical'

export default function App() {
  const [view, setView] = useState<View>('home')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [cmdOpen, setCmdOpen] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState<number | undefined>()

  const { subjects, add: addSubject, remove: removeSubject } = useSubjects()
  const agenda = useAgenda()
  const medical = useMedical()

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setCmdOpen(o => !o)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        background: 'var(--bg-app)',
        backdropFilter: 'var(--blur)',
        WebkitBackdropFilter: 'var(--blur)',
        border: '1px solid var(--border-app)',
        fontFamily: 'var(--font-main)',
        color: 'var(--text-primary)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <TitleBar />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar
          view={view}
          setView={setView}
          subjects={subjects}
          selectedSubject={selectedSubject}
          setSelectedSubject={setSelectedSubject}
          addSubject={addSubject}
          removeSubject={removeSubject}
          theme={theme}
          toggleTheme={toggleTheme}
        />

        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {view === 'home'     && <HomePage subjects={subjects} agenda={agenda} medical={medical} />}
          {view === 'notes'    && <NotesPage subjects={subjects} selectedSubject={selectedSubject} />}
          {view === 'agenda'   && <AgendaPage subjects={subjects} agenda={agenda} />}
          {view === 'calendar' && <CalendarPage subjects={subjects} agenda={agenda} />}
          {view === 'medical'  && <MedicalPage medical={medical} />}
        </main>
      </div>

      {cmdOpen && (
        <CommandPalette
          onClose={() => setCmdOpen(false)}
          subjects={subjects}
          agenda={agenda}
          medical={medical}
          setView={setView}
        />
      )}

      <button
        onClick={() => setCmdOpen(true)}
        style={{
          position: 'absolute',
          bottom: 14,
          right: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          fontSize: 11,
          color: 'var(--text-muted)',
        }}
      >
        Comandos
        <kbd style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-card)',
          borderRadius: 5,
          padding: '2px 6px',
          fontSize: 11,
          color: 'var(--text-secondary)',
        }}>Ctrl</kbd>
        <span style={{ opacity: 0.5 }}>+</span>
        <kbd style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-card)',
          borderRadius: 5,
          padding: '2px 6px',
          fontSize: 11,
          color: 'var(--text-secondary)',
        }}>K</kbd>
      </button>
    </div>
  )
}