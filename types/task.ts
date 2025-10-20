import { STATUSES } from '@/constants'

export type TaskStatus = (typeof STATUSES)[number]

export interface Task {
  id: string
  title: string
  description?: string
  start: Date
  end?: Date
  allDay?: boolean
  status?: TaskStatus
}
