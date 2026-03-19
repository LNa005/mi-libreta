export default function TitleBar() {
  return (
    <div style={{
      height: 32,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingLeft: 12,
      paddingRight: 0,
      WebkitAppRegion: 'drag',
      flexShrink: 0,
    } as React.CSSProperties}>
      <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-main)' }}>
        Mi libreta
      </span>
      <div style={{ display: 'flex', WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
        <button
          onClick={() => window.db.winMinimize()}
          style={{
            width: 46, height: 32, border: 'none', background: 'transparent',
            color: 'var(--text-muted)', cursor: 'pointer', fontSize: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(128,128,128,0.2)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >─</button>
        <button
          onClick={() => window.db.winMaximize()}
          style={{
            width: 46, height: 32, border: 'none', background: 'transparent',
            color: 'var(--text-muted)', cursor: 'pointer', fontSize: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(128,128,128,0.2)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >□</button>
        <button
          onClick={() => window.db.winClose()}
          style={{
            width: 46, height: 32, border: 'none', background: 'transparent',
            color: 'var(--text-muted)', cursor: 'pointer', fontSize: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(220,50,50,0.7)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >✕</button>
      </div>
    </div>
  )
}