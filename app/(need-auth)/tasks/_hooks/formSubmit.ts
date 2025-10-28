import { Task, TaskStatus } from '@/types/task'
import { EventFormData } from '@/utils/task'
import { DateSelectArg } from '@fullcalendar/core/index.js'
import { createTask, updateTask } from '../actions'
import { dispatchStreakUpdate } from '@/utils/streakEvents'

interface PropsType {
  editingEvent: Task | null
  selectedDateInfo: DateSelectArg | null
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
  onEffect: () => void
}

export default function useFormSubmit({
  editingEvent,
  selectedDateInfo,
  setTasks,
  onEffect,
}: PropsType) {
  const handleFormSubmit = async (formData: EventFormData) => {
    try {
      if (editingEvent) {
        // Execute server action first (including streak update)
        const updatedTask = await updateTask({
          id: editingEvent.id,
          title: formData.title,
          description: formData.description,
          start: new Date(formData.start),
          end: new Date(formData.end),
          status: formData.status,
        })
        
        // Update state with data returned from server
        setTasks((prev: Task[]) =>
          prev.map(event =>
            event.id === editingEvent.id
              ? {
                  id: updatedTask.id,
                  title: updatedTask.title,
                  description: updatedTask.description || undefined,
                  start: new Date(updatedTask.start),
                  end: updatedTask.end ? new Date(updatedTask.end) : undefined,
                  allDay: event.allDay, // Keep original allDay value
                  status: updatedTask.status as TaskStatus,
                }
              : event
          )
        )
        
        // Dispatch custom event to notify streak components
        dispatchStreakUpdate()
      } else if (selectedDateInfo) {
        // Prepare new event data
        const newEventData: Task = {
          id: String(Date.now()), // Temporary ID, server will provide the real one
          title: formData.title,
          description: formData.description,
          start: formData.allDay
            ? selectedDateInfo.start
            : new Date(formData.start),
          end: formData.allDay ? selectedDateInfo.end : new Date(formData.end),
          allDay: formData.allDay,
          status: formData.status,
        }
        
        // Execute server action first (including streak update)
        const createdTask = await createTask(newEventData)
        
        // Update state with data returned from server
        setTasks(prev => [
          ...prev,
          {
            id: createdTask.id,
            title: createdTask.title,
            description: createdTask.description || undefined,
            start: new Date(createdTask.start),
            end: createdTask.end ? new Date(createdTask.end) : undefined,
            allDay: newEventData.allDay,
            status: createdTask.status as TaskStatus,
          }
        ])
        
        // Dispatch custom event to notify streak components
        dispatchStreakUpdate()
      }

      onEffect()
    } catch (error) {
      console.error('Failed to submit form:', error)
      // You might want to show an error message to the user here
      // For now, we'll still call onEffect to close the modal
      onEffect()
    }
  }

  return { handleFormSubmit }
}
