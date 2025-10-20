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
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'>
      <div className='p-6 max-w-7xl mx-auto'>
        {/* Header Section */}
        <div className='mb-8'>
          <div className='bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-4'>
            <div className='flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4'>
              <div className='space-y-2'>
                <h1 className='text-3xl font-bold text-slate-900 flex items-center gap-3'>
                  📅 Task Calendar
                </h1>
                <p className='text-slate-600'>
                  Organize your schedule and manage tasks with our interactive
                  calendar
                </p>
              </div>

              <div className='flex items-center gap-4'>
                {/* Task Counter */}
                <div className='bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full shadow-sm'>
                  <div className='text-sm font-medium'>
                    {isLoading ? (
                      <span className='flex items-center gap-2'>
                        <div className='w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                        Loading...
                      </span>
                    ) : error ? (
                      <span className='flex items-center gap-2'>
                        <span>⚠️</span>
                        Error
                      </span>
                    ) : (
                      <span>
                        {tasks.length} task{tasks.length !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className='flex items-center gap-2'>
                  <button
                    onClick={refreshTasks}
                    disabled={isLoading}
                    className='group flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm'
                    title='Refresh tasks'>
                    <RefreshCw
                      size={16}
                      className={`text-slate-600 group-hover:text-slate-900 transition-colors ${
                        isLoading ? 'animate-spin' : ''
                      }`}
                    />
                    <span className='text-sm font-medium text-slate-700 group-hover:text-slate-900'>
                      Refresh
                    </span>
                  </button>

                  <button
                    onClick={() => setIsHelpModalOpen(true)}
                    className='group flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-all duration-200 shadow-sm'
                    title='Show keyboard shortcuts (Ctrl+/)'>
                    <HelpCircle size={16} />
                    <span className='text-sm font-medium'>Help</span>
                    <kbd className='bg-indigo-400 bg-opacity-50 px-2 py-0.5 rounded text-xs font-mono'>
                      Ctrl+/
                    </kbd>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Calendar Container */}
          <div className='bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden'>
            <div className='h-[calc(100vh-300px)] min-h-[600px] relative'>
              {isLoading && <LoadingOverlay text='Loading tasks...' />}
              {error && (
                <div className='absolute inset-0 bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200 rounded-xl flex items-center justify-center z-10 m-4'>
                  <div className='text-center p-8 bg-white rounded-xl shadow-lg border border-red-100'>
                    <div className='text-red-500 mb-4'>
                      <span className='text-4xl'>⚠️</span>
                    </div>
                    <h3 className='text-xl font-bold text-red-800 mb-2'>
                      Oops! Failed to load tasks
                    </h3>
                    <p className='text-red-600 mb-6 max-w-sm'>{error}</p>
                    <button
                      onClick={() => window.location.reload()}
                      className='px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium'>
                      🔄 Try Again
                    </button>
                  </div>
                </div>
              )}
              <div className='h-full p-4'>
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
                  scrollTime={new Date().toTimeString().substring(0, 8)}
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
                  viewClassNames='calendar-container'
                />
              </div>
            </div>
          </div>
        </div>
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
