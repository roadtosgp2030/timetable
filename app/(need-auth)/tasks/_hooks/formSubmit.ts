import { Task } from '@/types/task'
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
    if (editingEvent) {
      // Update existing event
      setTasks((prev: Task[]) => {
        const newTasks = prev.map(event =>
          event.id === editingEvent.id
            ? {
                ...event,
                title: formData.title,
                description: formData.description,
                start: new Date(formData.start),
                end: new Date(formData.end),
                allDay: formData.allDay,
                status: formData.status,
              }
            : event
        )
        return newTasks
      })
      
      // Wait for the server action to complete (including streak update)
      await updateTask({
        id: editingEvent.id,
        title: formData.title,
        description: formData.description,
        start: new Date(formData.start),
        end: new Date(formData.end),
        status: formData.status,
      })
      
      // Dispatch custom event to notify streak components
      dispatchStreakUpdate()
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
        status: formData.status,
      }
      
      setTasks(prev => [...prev, newEvent])
      
      // Wait for the server action to complete (including streak update)
      await createTask(newEvent)
      
      // Dispatch custom event to notify streak components
      dispatchStreakUpdate()
    }

    onEffect()
  }

  return { handleFormSubmit }
}
