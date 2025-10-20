'use client'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { DateSelectArg } from '@fullcalendar/core'
import { useState, useRef, useEffect } from 'react'
import { Modal } from '@/components/ui/modal'
import { EventForm } from '@/components/EventForm'
import { Button } from '@/components/ui/button'
import { HelpModal } from '@/components/HelpModal'
import { Task } from '@/types/task'
import useInitialFormData from './_hooks/initialFormData'
import useFormSubmit from './_hooks/formSubmit'
import useShortcuts from './_hooks/shortcuts'
import { useCalendarFns } from './_hooks/calendarFns'
import { EventFormData } from '@/utils/task'

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDateInfo, setSelectedDateInfo] =
    useState<DateSelectArg | null>(null)
  const [editingEvent, setEditingEvent] = useState<Task | null>(null)
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false)

  const { getInitialFormData } = useInitialFormData({
    editingEvent,
    selectedDateInfo,
  })

  // Setup keyboard shortcuts
  useShortcuts({ setIsHelpModalOpen })

  const onClose = () => {
    setIsModalOpen(false)
    setSelectedDateInfo(null)
    setEditingEvent(null)
  }

  // Handle form submission
  const { handleFormSubmit } = useFormSubmit({
    editingEvent,
    selectedDateInfo,
    setTasks,
    onEffect: onClose,
  })

  const {
    handleDateSelect,
    handleDeleteEvent,
    handleEventClick,
    onDropOrResize,
  } = useCalendarFns({
    setSelectedDateInfo,
    setEditingEvent,
    setIsModalOpen,
    tasks,
    editingEvent,
    setTasks,
  })

  // Reference to the form for programmatic submission
  const formRef = useRef<HTMLFormElement>(null)

  // Handle keyboard shortcuts in modal
  const handleModalSubmit = () => {
    if (formRef.current) {
      // Trigger form submission
      formRef.current.requestSubmit()
    }
  }

  // Fetch tasks from API on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      const res = await fetch('/api/tasks')
      const data = await res.json()
      setTasks(data)
    }

    fetchTasks()
  }, [])

  return (
    <div className='p-4'>
      <div className='h-[calc(100vh-100px)]'>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          initialView='timeGridWeek'
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          // Time format
          slotLabelFormat={{
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }}
          // Working hours
          slotMinTime='05:30:00'
          slotMaxTime='22:00:00'
          // Events
          events={tasks}
          // Event handlers
          select={handleDateSelect}
          eventClick={handleEventClick}
          // Drag and drop
          eventDrop={onDropOrResize}
          eventResize={onDropOrResize}
          // Styling
          height='100%'
          viewClassNames='shadow-lg'
        />
      </div>

      {/* Event Creation/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={onClose}
        title={editingEvent ? 'Edit Event' : 'Create New Event'}
        onSubmit={handleModalSubmit}
        onDelete={editingEvent ? handleDeleteEvent : undefined}>
        <EventForm
          ref={formRef}
          initialData={getInitialFormData() as Partial<EventFormData>}
          onSubmit={handleFormSubmit}
          onCancel={onClose}
          isEditing={!!editingEvent}
        />

        {editingEvent && (
          <div className='mt-4 pt-4 border-t'>
            <Button
              variant='outline'
              onClick={handleDeleteEvent}
              className='w-full text-red-600 hover:text-red-800 hover:bg-red-50'>
              Delete Event
            </Button>
          </div>
        )}
      </Modal>

      {/* Help Modal */}
      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />
    </div>
  )
}
