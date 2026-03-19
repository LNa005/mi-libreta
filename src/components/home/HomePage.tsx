import type { Subject } from '../../types'
import { useAgenda } from '../../hooks/useAgenda'
import { useMedical } from '../../hooks/useMedical'
import WeekStrip from './WeekStrip'
import UpcomingList from './UpcomingList'

interface Props {
  subjects: Subject[]
  agenda: ReturnType<typeof useAgenda>
  medical: ReturnType<typeof useMedical>
}

export default function HomePage({ subjects, agenda, medical }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <WeekStrip agenda={agenda} subjects={subjects} />
      <UpcomingList upcoming={agenda.upcoming} subjects={subjects} medical={medical.appointments} />
    </div>
  )
}