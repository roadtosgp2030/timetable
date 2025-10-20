// Color mapping for task statuses
export const getStatusColor = (status: string | undefined) => {
  const colorMap: Record<
    string,
    { backgroundColor: string; borderColor: string; textColor: string }
  > = {
    pending: {
      backgroundColor: '#fef3c7', // yellow-100
      borderColor: '#f59e0b', // yellow-500
      textColor: '#92400e', // yellow-800
    },
    progress: {
      backgroundColor: '#dbeafe', // blue-100
      borderColor: '#3b82f6', // blue-500
      textColor: '#1e40af', // blue-800
    },
    done: {
      backgroundColor: '#d1fae5', // green-100
      borderColor: '#10b981', // green-500
      textColor: '#065f46', // green-800
    },
    stop: {
      backgroundColor: '#fee2e2', // red-100
      borderColor: '#ef4444', // red-500
      textColor: '#991b1b', // red-800
    },
  }

  return colorMap[status || 'pending'] || colorMap.pending
}

// Export color constants for consistent usage across components
export const STATUS_COLORS = {
  pending: '#f59e0b',
  progress: '#3b82f6',
  done: '#10b981',
  stop: '#ef4444',
} as const
