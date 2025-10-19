'use client'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

export default function page() {
  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView='timeGridWeek'
        slotLabelFormat={{ hour: '2-digit', minute: '2-digit', hour12: false }}
        events={[{ title: 'test', start: new Date() }]}
        slotMinTime='05:30:00'
        slotMaxTime='22:00:00'
        viewClassNames='h-full'
      />
    </div>
  )
}
