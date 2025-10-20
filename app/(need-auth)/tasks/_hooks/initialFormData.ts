import { Task } from '@/types/task'
import { DateSelectArg } from '@fullcalendar/core/index.js'

interface PropsType {
  editingEvent: Task | null
  selectedDateInfo: DateSelectArg | null
}

export default function useInitialFormData({
  editingEvent,
  selectedDateInfo,
}: PropsType) {
  const getInitialFormData = () => {
    if (editingEvent) {
      const startDate = new Date(editingEvent.start)
      const endDate = editingEvent.end ? new Date(editingEvent.end) : null

      // Convert to GMT+7
      const gmtPlus7Start = new Date(startDate.getTime() + 7 * 60 * 60 * 1000)
      const gmtPlus7End = endDate
        ? new Date(endDate.getTime() + 7 * 60 * 60 * 1000)
        : null

      return {
        title: editingEvent.title,
        description: editingEvent.description || '',
        start: gmtPlus7Start.toISOString().slice(0, 16),
        end: gmtPlus7End?.toISOString().slice(0, 16) || '',
        allDay: editingEvent.allDay || false,
      }
    } else if (selectedDateInfo) {
      const startDate = new Date(selectedDateInfo.start)
      const endDate = selectedDateInfo.end
        ? new Date(selectedDateInfo.end)
        : null

      // Convert to GMT+7
      const gmtPlus7Start = new Date(startDate.getTime() + 7 * 60 * 60 * 1000)
      const gmtPlus7End = endDate
        ? new Date(endDate.getTime() + 7 * 60 * 60 * 1000)
        : null

      return {
        title: '',
        description: '',
        start: gmtPlus7Start.toISOString().slice(0, 16),
        end: gmtPlus7End?.toISOString().slice(0, 16) || '',
        allDay: selectedDateInfo.allDay,
      }
    }
    return undefined
  }

  return { getInitialFormData }
}
