import { Task } from '@/types/task'
import { Calendar, Clock } from 'lucide-react'

interface RecentTasksProps {
  tasks: Task[]
}

export function RecentTasks({ tasks }: RecentTasksProps) {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'done':
        return 'bg-green-100 text-green-800'
      case 'progress':
        return 'bg-blue-100 text-blue-800'
      case 'stop':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'progress':
        return 'In Progress'
      case 'done':
        return 'Done'
      case 'stop':
        return 'Stopped'
      default:
        return 'Pending'
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date))
  }

  return (
    <div className='bg-white rounded-lg border border-gray-200 p-6 shadow-sm'>
      <h3 className='text-lg font-semibold text-gray-900 mb-4'>Recent Tasks</h3>
      <div className='space-y-4'>
        {tasks.length === 0 ? (
          <div className='text-center py-8'>
            <Calendar className='mx-auto h-12 w-12 text-gray-400 mb-4' />
            <p className='text-gray-500'>No tasks found</p>
            <p className='text-sm text-gray-400'>
              Create your first task to get started
            </p>
          </div>
        ) : (
          tasks.slice(0, 5).map(task => (
            <div
              key={task.id}
              className='flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors duration-200'>
              <div className='flex-1 min-w-0'>
                <h4 className='text-sm font-medium text-gray-900 truncate'>
                  {task.title}
                </h4>
                {task.description && (
                  <p className='text-sm text-gray-500 truncate mt-1'>
                    {task.description}
                  </p>
                )}
                <div className='flex items-center mt-2 text-xs text-gray-500'>
                  <Clock size={12} className='mr-1' />
                  {formatDate(task.start)}
                </div>
              </div>
              <div className='ml-4 flex-shrink-0'>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                    task.status
                  )}`}>
                  {getStatusLabel(task.status)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
