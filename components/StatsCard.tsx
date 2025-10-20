interface StatsCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  description?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red'
}

export function StatsCard({
  title,
  value,
  icon,
  description,
  trend,
  color = 'blue',
}: StatsCardProps) {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      icon: 'text-blue-600',
      text: 'text-blue-900',
    },
    green: {
      bg: 'bg-green-50',
      icon: 'text-green-600',
      text: 'text-green-900',
    },
    purple: {
      bg: 'bg-purple-50',
      icon: 'text-purple-600',
      text: 'text-purple-900',
    },
    orange: {
      bg: 'bg-orange-50',
      icon: 'text-orange-600',
      text: 'text-orange-900',
    },
    red: {
      bg: 'bg-red-50',
      icon: 'text-red-600',
      text: 'text-red-900',
    },
  }

  const selectedColor = colorClasses[color]

  return (
    <div className='bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200'>
      <div className='flex items-center justify-between'>
        <div className='flex-1'>
          <div className='flex items-center'>
            <div className={`p-3 rounded-lg ${selectedColor.bg} mr-4`}>
              <div className={`w-6 h-6 ${selectedColor.icon}`}>{icon}</div>
            </div>
            <div>
              <p className='text-sm font-medium text-gray-600'>{title}</p>
              <p className={`text-2xl font-bold ${selectedColor.text}`}>
                {value}
              </p>
            </div>
          </div>
          {description && (
            <p className='text-sm text-gray-500 mt-2'>{description}</p>
          )}
        </div>
        {trend && (
          <div
            className={`text-sm font-medium ${
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
            <span className={trend.isPositive ? '↗' : '↘'}>
              {trend.isPositive ? '+' : ''}
              {trend.value}%
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
