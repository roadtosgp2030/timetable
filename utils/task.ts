import { STATUSES } from '@/constants'

export type EventStatus = (typeof STATUSES)[number]

export interface EventFormData {
  title: string
  description: string
  start: string
  end: string
  allDay: boolean
  status: EventStatus
}
