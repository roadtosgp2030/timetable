import {
  DateSelectArg,
  EventClickArg,
  EventDropArg,
} from '@fullcalendar/core/index.js'
import { EventResizeDoneArg } from '@fullcalendar/interaction/index.js'
import { deleteTask, updateTask } from '../actions'

interface PropsType {
  setSelectedDateInfo: React.Dispatch<
    React.SetStateAction<DateSelectArg | null>
  >
  setEditingEvent: React.Dispatch<React.SetStateAction<any | null>>
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  tasks: any[]
  editingEvent: any | null
  setTasks: React.Dispatch<React.SetStateAction<any[]>>
}

export function useCalendarFns({
  setSelectedDateInfo,
  setEditingEvent,
  setIsModalOpen,
  tasks,
  editingEvent,
  setTasks,
}: PropsType) {
  // Handle date selection (click and drag to create event)
  const handleDateSelect = (selectInfo: DateSelectArg) => {
    setSelectedDateInfo(selectInfo)
    setEditingEvent(null)
    setIsModalOpen(true)
    selectInfo.view.calendar.unselect() // Clear date selection
  }

  // Handle event click (for editing/deleting)
  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = tasks.find(e => e.id === clickInfo.event.id)
    if (event) {
      setEditingEvent(event)
      setSelectedDateInfo(null)
      setIsModalOpen(true)
    }
  }

  // Handle event deletion
  const handleDeleteEvent = () => {
    if (
      editingEvent &&
      confirm(`Are you sure you want to delete '${editingEvent.title}'?`)
    ) {
      setTasks(prev => prev.filter(event => event.id !== editingEvent.id))
      deleteTask(editingEvent.id)
      setIsModalOpen(false)
      setEditingEvent(null)
    }
  }

  const onDropOrResize = async (info: EventDropArg | EventResizeDoneArg) => {
    // Find the event to update
    const eventToUpdate = tasks.find(event => event.id === info.event.id)
    if (eventToUpdate) {
      try {
        // Execute server action first (including streak update)
        const updatedTask = await updateTask({
          id: eventToUpdate.id,
          title: eventToUpdate.title,
          description: eventToUpdate.description,
          start: info.event.start!,
          end: info.event.end || undefined,
          status: eventToUpdate.status,
        })
        
        // Update state with data returned from server
        setTasks(prev =>
          prev.map(event => {
            if (event.id === info.event.id) {
              return {
                id: updatedTask.id,
                title: updatedTask.title,
                description: updatedTask.description || undefined,
                start: new Date(updatedTask.start),
                end: updatedTask.end ? new Date(updatedTask.end) : undefined,
                allDay: event.allDay, // Keep original allDay value
                status: updatedTask.status as any, // Type assertion for TaskStatus
              }
            }
            return event
          })
        )
        
        // Import and dispatch custom event to notify streak components
        const { dispatchStreakUpdate } = await import('@/utils/streakEvents')
        dispatchStreakUpdate()
      } catch (error) {
        console.error('Failed to update task:', error)
        // Revert the calendar change if server update failed
        info.revert()
      }
    }
  }

  return {
    handleDateSelect,
    handleEventClick,
    handleDeleteEvent,
    onDropOrResize,
  }
}
