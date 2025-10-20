export interface Task {
  id: string
  title: string
  description?: string
  start: Date
  end?: Date
  allDay?: boolean
}
