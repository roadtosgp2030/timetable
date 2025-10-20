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
import { LoadingOverlay } from '@/components/ui/loading'
import { HelpCircle, RefreshCw } from 'lucide-react'
import { Task } from '@/types/task'
import useInitialFormData from './_hooks/initialFormData'
import useFormSubmit from './_hooks/formSubmit'
import useShortcuts from './_hooks/shortcuts'
import { useCalendarFns } from './_hooks/calendarFns'
import { EventFormData } from '@/utils/task'

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  // Refresh tasks function
  const refreshTasks = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const res = await fetch('/api/tasks')
      if (!res.ok) {
        throw new Error('Failed to fetch tasks')
      }
      const data = await res.json()
      setTasks(data)
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
      setError(
        error instanceof Error ? error.message : 'Unknown error occurred'
      )
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch tasks from API on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const res = await fetch('/api/tasks')
        if (!res.ok) {
          throw new Error('Failed to fetch tasks')
        }
        const data = await res.json()
        setTasks(data)
      } catch (error) {
        console.error('Failed to fetch tasks:', error)
        setError(
          error instanceof Error ? error.message : 'Unknown error occurred'
        )
      } finally {
        setIsLoading(false)
      }
    }

    fetchTasks()
  }, [])

  return (
    <div className='p-4'>
      <div className='mb-4'>
        <div className='flex justify-between items-center mb-2'>
          <h1 className='text-2xl font-bold'>Task Calendar</h1>
          <div className='flex items-center gap-3'>
            <div className='text-sm text-gray-600'>
              {isLoading ? (
                <span className='flex items-center gap-2'>
                  <div className='w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin'></div>
                  Loading tasks...
                </span>
              ) : error ? (
                <span className='text-red-600 flex items-center gap-1'>
                  <span>⚠️</span>
                  Error loading tasks
                </span>
              ) : (
                <span>
                  {tasks.length} task{tasks.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
            <button
              onClick={refreshTasks}
              disabled={isLoading}
              className='text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
              title='Refresh tasks'>
              <RefreshCw
                size={16}
                className={isLoading ? 'animate-spin' : ''}
              />
            </button>
            <button
              onClick={() => setIsHelpModalOpen(true)}
              className='text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 transition-colors'
              title='Show keyboard shortcuts (Ctrl+/)'>
              <HelpCircle size={16} />
              <kbd className='bg-gray-100 px-1 rounded text-xs'>Ctrl+/</kbd>
            </button>
          </div>
        </div>
        <div className='text-sm text-gray-600'>
          <p>
            Click and drag to create events • Click on events to edit • Press{' '}
            <kbd className='bg-gray-100 px-1 rounded text-xs'>Ctrl+/</kbd> for
            shortcuts
          </p>
        </div>
      </div>

      <div className='h-[calc(100vh-200px)] relative'>
        {isLoading && <LoadingOverlay text='Loading tasks...' />}
        {error && (
          <div className='absolute inset-0 bg-red-50 border border-red-200 rounded-lg flex items-center justify-center z-10'>
            <div className='text-center p-4'>
              <div className='text-red-600 mb-2'>
                <span className='text-2xl'>⚠️</span>
              </div>
              <h3 className='text-lg font-semibold text-red-800 mb-1'>
                Failed to load tasks
              </h3>
              <p className='text-red-600 mb-3'>{error}</p>
              <button
                onClick={() => window.location.reload()}
                className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors'>
                Retry
              </button>
            </div>
          </div>
        )}
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
