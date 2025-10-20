import { Task } from '@/types/task'
import { EventFormData } from '@/utils/task'
import { DateSelectArg } from '@fullcalendar/core/index.js'
import { createTask } from '../actions'

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
  const handleFormSubmit = (formData: EventFormData) => {
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
      createTask(newEvent)
      setTasks(prev => [...prev, newEvent])
    }

    onEffect()
  }

  return { handleFormSubmit }
}
