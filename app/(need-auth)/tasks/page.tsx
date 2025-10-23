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
import { getStatusColor, STATUS_COLORS } from '@/utils/colors'

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
      <div className='flex h-[calc(100vh-4rem)]'>
        {/* Sidebar */}
        <div className='w-80 bg-white shadow-lg border-r border-slate-200 flex flex-col'>
          {/* Header Section */}
          <div className='p-6 border-b border-slate-200'>
            <div className='space-y-4'>
              <div className='space-y-2'>
                <h1 className='text-2xl font-bold text-slate-900 flex items-center gap-3'>
                  📅 Task Calendar
                </h1>
                <p className='text-slate-600 text-sm'>
                  Organize your schedule and manage tasks with our interactive
                  calendar
                </p>
              </div>

              {/* Task Counter */}
              <div className='bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-3 rounded-xl shadow-sm'>
                <div className='text-sm font-medium text-center'>
                  {isLoading ? (
                    <span className='flex items-center justify-center gap-2'>
                      <div className='w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                      Loading...
                    </span>
                  ) : error ? (
                    <span className='flex items-center justify-center gap-2'>
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
              <div className='space-y-2'>
                <button
                  onClick={refreshTasks}
                  disabled={isLoading}
                  className='w-full group flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 border border-slate-200 rounded-lg hover:bg-slate-200 hover:border-slate-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                  title='Refresh tasks'>
                  <RefreshCw
                    size={16}
                    className={`text-slate-600 group-hover:text-slate-900 transition-colors ${
                      isLoading ? 'animate-spin' : ''
                    }`}
                  />
                  <span className='text-sm font-medium text-slate-700 group-hover:text-slate-900'>
                    Refresh Tasks
                  </span>
                </button>

                <button
                  onClick={() => setIsHelpModalOpen(true)}
                  className='w-full group flex items-center justify-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-all duration-200'
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

          {/* Status Legend */}
          <div className='p-6 border-b border-slate-200'>
            <h3 className='text-sm font-semibold text-slate-700 mb-4'>
              Task Status Colors
            </h3>
            <div className='space-y-3'>
              <div className='flex items-center gap-3'>
                <div
                  className='w-4 h-4 rounded-full'
                  style={{ backgroundColor: STATUS_COLORS.pending }}></div>
                <span className='text-sm text-slate-600'>Pending</span>
              </div>
              <div className='flex items-center gap-3'>
                <div
                  className='w-4 h-4 rounded-full'
                  style={{ backgroundColor: STATUS_COLORS.progress }}></div>
                <span className='text-sm text-slate-600'>In Progress</span>
              </div>
              <div className='flex items-center gap-3'>
                <div
                  className='w-4 h-4 rounded-full'
                  style={{ backgroundColor: STATUS_COLORS.done }}></div>
                <span className='text-sm text-slate-600'>Done</span>
              </div>
              <div className='flex items-center gap-3'>
                <div
                  className='w-4 h-4 rounded-full'
                  style={{ backgroundColor: STATUS_COLORS.stop }}></div>
                <span className='text-sm text-slate-600'>Stopped</span>
              </div>
            </div>
          </div>

          {/* Flexible space for future sidebar content */}
          <div className='flex-1 p-6'>
            {/* You can add more sidebar content here in the future */}
          </div>
        </div>

        {/* Main Content Area */}
        <div className='flex-1 flex flex-col'>
          {/* Calendar Container */}
          <div className='flex-1 bg-white shadow-lg border border-slate-200 m-6 rounded-2xl overflow-hidden'>
            <div className='h-full relative'>
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
                  slotDuration="00:15:00"
                  // Working hours
                  slotMinTime='05:30:00'
                  slotMaxTime='22:00:00'
                  scrollTime={new Date().toTimeString().substring(0, 8)}
                  // Events with status-based colors
                  events={tasks.map(task => {
                    const colors = getStatusColor(task.status)
                    return {
                      ...task,
                      backgroundColor: colors.backgroundColor,
                      borderColor: colors.borderColor,
                      textColor: colors.textColor,
                      classNames: [`status-${task.status || 'pending'}`],
                    }
                  })}
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
