'use client'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { DateSelectArg, EventClickArg } from '@fullcalendar/core'
import { useState, useRef } from 'react'
import { Modal } from '@/components/ui/modal'
import { EventForm } from '@/components/EventForm'
import { Button } from '@/components/ui/button'
import { EventFormData } from '@/utils/task'
import { Task } from '@/types/task'
import useInitialFormData from './_hooks/initialFormData'

export default function TasksPage() {
  const [events, setEvents] = useState<Task[]>([
    {
      id: '1',
      title: 'Sample Event',
      description: 'This is a sample event',
      start: new Date(),
      end: new Date(Date.now() + 60 * 60 * 1000), // 1 hour later
    },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDateInfo, setSelectedDateInfo] =
    useState<DateSelectArg | null>(null)
  const [editingEvent, setEditingEvent] = useState<Task | null>(null)

  const { getInitialFormData } = useInitialFormData({
    editingEvent,
    selectedDateInfo,
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

  // Handle date selection (click and drag to create event)
  const handleDateSelect = (selectInfo: DateSelectArg) => {
    setSelectedDateInfo(selectInfo)
    setEditingEvent(null)
    setIsModalOpen(true)
    selectInfo.view.calendar.unselect() // Clear date selection
  }

  // Handle event click (for editing/deleting)
  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = events.find(e => e.id === clickInfo.event.id)
    if (event) {
      setEditingEvent(event)
      setSelectedDateInfo(null)
      setIsModalOpen(true)
    }
  }

  // Handle form submission
  const handleFormSubmit = (formData: EventFormData) => {
    if (editingEvent) {
      // Update existing event
      setEvents(prev =>
        prev.map(event =>
          event.id === editingEvent.id
            ? {
                ...event,
                title: formData.title,
                description: formData.description,
                start: new Date(formData.start),
                end: new Date(formData.end),
                allDay: formData.allDay,
              }
            : event
        )
      )
    } else if (selectedDateInfo) {
      // Create new event
      const newEvent: Task = {
        id: String(Date.now()),
        title: formData.title,
        description: formData.description,
        start: formData.allDay
          ? selectedDateInfo.start
          : new Date(formData.start),
        end: formData.allDay ? selectedDateInfo.end : new Date(formData.end),
        allDay: formData.allDay,
      }
      setEvents(prev => [...prev, newEvent])
    }

    setIsModalOpen(false)
    setSelectedDateInfo(null)
    setEditingEvent(null)
  }

  // Handle event deletion
  const handleDeleteEvent = () => {
    if (
      editingEvent &&
      confirm(`Are you sure you want to delete '${editingEvent.title}'?`)
    ) {
      setEvents(prev => prev.filter(event => event.id !== editingEvent.id))
      setIsModalOpen(false)
      setEditingEvent(null)
    }
  }

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
          events={events}
          // Event handlers
          select={handleDateSelect}
          eventClick={handleEventClick}
          // Drag and drop
          eventDrop={info => {
            setEvents(prev =>
              prev.map(event =>
                event.id === info.event.id
                  ? {
                      ...event,
                      start: info.event.start || event.start,
                      end: info.event.end || event.end,
                    }
                  : event
              )
            )
          }}
          eventResize={info => {
            setEvents(prev =>
              prev.map(event =>
                event.id === info.event.id
                  ? {
                      ...event,
                      start: info.event.start || event.start,
                      end: info.event.end || event.end,
                    }
                  : event
              )
            )
          }}
          // Styling
          height='100%'
          viewClassNames='shadow-lg'
        />
      </div>

      {/* Event Creation/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedDateInfo(null)
          setEditingEvent(null)
        }}
        title={editingEvent ? 'Edit Event' : 'Create New Event'}
        onSubmit={handleModalSubmit}
        onDelete={editingEvent ? handleDeleteEvent : undefined}>
        <EventForm
          ref={formRef}
          initialData={getInitialFormData()}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setIsModalOpen(false)
            setSelectedDateInfo(null)
            setEditingEvent(null)
          }}
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
    </div>
  )
}
