<div align="center">

> *Una app de escritorio transparente para dejar de usar libretas de papel* 🌸

![Estado](https://img.shields.io/badge/estado-en%20desarrollo-c084fc?style=flat-square&labelColor=1e1b4b)
![Plataforma](https://img.shields.io/badge/plataforma-Windows%20%7C%20macOS-f9a8d4?style=flat-square&labelColor=1e1b4b)
![Stack](https://img.shields.io/badge/stack-Electron%20%2B%20React%20%2B%20SQLite-a78bfa?style=flat-square&labelColor=1e1b4b)

</div>

---

## 🌸 ¿Qué es esto?

**Mi Libreta** es una app de escritorio con efecto glassmorphic pensada para estudiantes. Reemplaza las libretas físicas con algo más organizado, bonito y siempre a mano.

---

## 💎 Aspecto

- 🔵 Cristal azul pastel transparente sobre el escritorio
- 🔤 Fuentes Fredoka + Playfair Display
- 🪟 Ventana sin marco, arrastrable, con botones personalizados
- 🌙 Modo claro y oscuro
- ✨ Efecto blur sobre el fondo de pantalla

---

## 💜 Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| 🖥️ Shell de escritorio | Electron |
| 🎨 UI | React + TypeScript |
| ⚡ Bundler | Vite |
| 🌸 Estilos | Tailwind CSS + CSS variables |
| 🗄️ Base de datos | SQLite local (better-sqlite3) |
| 🔄 Sincronización | Pendiente — Supabase |

---

## 🗂️ Estructura del proyecto

```
mi-libreta/
├── electron/
│   ├── main.ts          # Proceso principal, DB y IPC handlers
│   └── preload.ts       # Puente seguro Electron ↔ React
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx        # Navegación + asignaturas
│   │   │   ├── TitleBar.tsx       # Barra de título personalizada
│   │   │   └── CommandPalette.tsx # Spotlight Ctrl+K
│   │   ├── home/
│   │   │   ├── WeekStrip.tsx      # Tira semanal
│   │   │   └── UpcomingList.tsx   # Próximamente
│   │   ├── notes/
│   │   │   ├── NotesPages.tsx     # Editor de notas por asignatura
│   │   │   └── VideosSection.tsx  # Seguimiento de vídeos
│   │   ├── agenda/
│   │   │   └── AgendaPage.tsx     # Entregas y eventos
│   │   ├── calendar/
│   │   │   └── CalendarPage.tsx   # Vista mensual
│   │   └── medical/
│   │       └── MedicalPage.tsx    # Citas médicas
│   ├── hooks/
│   │   ├── useSubjects.ts
│   │   ├── useNotes.ts
│   │   ├── useAgenda.ts
│   │   ├── useMedical.ts
│   │   └── useVideos.ts
│   ├── types/
│   │   └── index.ts               # Tipos TypeScript compartidos
│   ├── styles/
│   │   └── index.css              # Variables globales + temas
│   ├── App.tsx
│   └── main.tsx
├── vite.config.ts
├── electron-builder.json5
└── package.json
```

---

## 🗃️ Base de datos

Los datos se guardan localmente en:
- **Windows:** `%APPDATA%\mi-libreta\mi-libreta.db`
- **Mac:** `~/Library/Application Support/mi-libreta/mi-libreta.db`

```
subjects    → id, name, color, created_at
notes       → id, subject_id, title, content, created_at, updated_at
deadlines   → id, subject_id, title, due_date, done, created_at
events      → id, subject_id, title, event_date, description, created_at
medical     → id, title, appointment_date, doctor, notes, created_at
videos      → id, subject_id, title, file_path, current_minute, total_minutes, created_at
```

---

## 🚀 Cómo arrancar en local

```bash
# Clona el repositorio
git clone https://github.com/tu-usuario/mi-libreta.git
cd mi-libreta

# Instala dependencias
npm install

# Recompila better-sqlite3 para Electron
npx electron-rebuild -f -w better-sqlite3

# Arranca en modo desarrollo
npm run dev

# Compilar para producción
npm run build
```

---

## ✅ Lo que está hecho

- [x] 💎 Ventana glassmorphic con efecto cristal azul y blur
- [x] 🪟 Ventana sin marco con botones personalizados (minimizar, maximizar, cerrar)
- [x] 🌙 Modo claro y oscuro
- [x] 📅 **Inicio** — vista semanal + próximamente (entregas, eventos, citas)
- [x] 📓 **Notas** — editor por asignatura, vinculado a cada materia
- [x] 🎬 **Vídeos** — seguimiento de minuto y progreso por asignatura
- [x] 📋 **Entregas** — lista con checkbox, fecha y asignatura
- [x] 📆 **Calendario** — vista mensual con eventos
- [x] 🏥 **Médico** — citas médicas separadas de lo académico
- [x] ⌨️ **Spotlight** — paleta de comandos con Ctrl+K
- [x] 🌸 Las 7 asignaturas con colores pastel personalizados
- [x] 💾 Datos persistentes en SQLite local
- [x] 📦 Ejecutable .exe generado en `release/`

---

## 🔜 Pendiente

- [ ] 🔄 Sincronización entre Windows y Mac con Supabase
- [ ] 🍎 Probar y ajustar en Mac (efecto vibrancy nativo)
- [ ] 📌 Modo siempre encima activable desde la app
- [ ] 🔔 Notificaciones de entregas próximas
- [ ] 📄 Exportar notas a PDF o markdown
- [ ] 🖊️ Editor de notas con soporte markdown
- [ ] 🔑 Variables de entorno para credenciales Supabase

---

## 🖥️ Plataformas

| Plataforma | Estado |
|-----------|--------|
| 🪟 Windows | ✅ Funcionando |
| 🍎 macOS | 🔜 Pendiente de vincular |

---

## 💡 Notas de desarrollo

- El preload compila a `preload.js` en formato CJS — usar siempre `.js` en `main.ts`
- `better-sqlite3` necesita recompilarse para Electron con `electron-rebuild` tras cada `npm install`
- `WebkitAppRegion: 'drag'` hace arrastrable el header; los botones necesitan `no-drag`
- Si TypeScript da errores raros → `Ctrl+Shift+P` → Restart TS Server
- Si la ventana sale en blanco → borrar `dist-electron/` y reiniciar

---

<div align="center">

*Hecho con 🩷 para sobrevivir el ciclo formativo*

</div>