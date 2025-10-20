import { Task } from '@/types/task'

interface WeeklyOverviewProps {
  tasks: Task[]
}

export function WeeklyOverview({ tasks }: WeeklyOverviewProps) {
  const today = new Date()
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()))

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek)
    date.setDate(startOfWeek.getDate() + i)
    return date
  })

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.start)
      return taskDate.toDateString() === date.toDateString()
    })
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'done':
        return 'bg-green-500'
      case 'progress':
        return 'bg-blue-500'
      case 'stop':
        return 'bg-red-500'
      default:
        return 'bg-gray-400'
    }
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  return (
    <div className='bg-white rounded-lg border border-gray-200 p-6 shadow-sm'>
      <h3 className='text-lg font-semibold text-gray-900 mb-4'>
        This Week Overview
      </h3>
      <div className='grid grid-cols-7 gap-2'>
        {weekDays.map((date, index) => {
          const dayTasks = getTasksForDate(date)
          const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
          const dayNumber = date.getDate()

          return (
            <div
              key={index}
              className={`p-3 rounded-lg border ${
                isToday(date)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:bg-gray-50'
              } transition-colors duration-200`}>
              <div className='text-center'>
                <p
                  className={`text-xs font-medium ${
                    isToday(date) ? 'text-blue-700' : 'text-gray-600'
                  }`}>
                  {dayName}
                </p>
                <p
                  className={`text-lg font-bold ${
                    isToday(date) ? 'text-blue-900' : 'text-gray-900'
                  }`}>
                  {dayNumber}
                </p>
              </div>
              <div className='mt-2 space-y-1'>
                {dayTasks.length === 0 ? (
                  <div className='h-2 bg-gray-100 rounded-full'></div>
                ) : (
                  dayTasks
                    .slice(0, 3)
                    .map((task, taskIndex) => (
                      <div
                        key={taskIndex}
                        className={`h-2 rounded-full ${getStatusColor(
                          task.status
                        )}`}
                        title={task.title}></div>
                    ))
                )}
                {dayTasks.length > 3 && (
                  <div className='text-xs text-center text-gray-500 mt-1'>
                    +{dayTasks.length - 3} more
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
      <div className='mt-4 flex items-center justify-center space-x-4 text-xs'>
        <div className='flex items-center'>
          <div className='w-3 h-3 bg-gray-400 rounded-full mr-2'></div>
          <span className='text-gray-600'>Pending</span>
        </div>
        <div className='flex items-center'>
          <div className='w-3 h-3 bg-blue-500 rounded-full mr-2'></div>
          <span className='text-gray-600'>In Progress</span>
        </div>
        <div className='flex items-center'>
          <div className='w-3 h-3 bg-green-500 rounded-full mr-2'></div>
          <span className='text-gray-600'>Done</span>
        </div>
        <div className='flex items-center'>
          <div className='w-3 h-3 bg-red-500 rounded-full mr-2'></div>
          <span className='text-gray-600'>Stopped</span>
        </div>
      </div>
    </div>
  )
}
