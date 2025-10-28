export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount)
}

export function getMonthName(monthNumber: number): string {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  return months[monthNumber - 1] || 'Unknown'
}

export function calculateBudgetProgress(
  spent: number,
  budgeted: number
): {
  percentage: number
  isOverBudget: boolean
  remaining: number
} {
  const percentage = budgeted > 0 ? (spent / budgeted) * 100 : 0
  const isOverBudget = spent > budgeted
  const remaining = budgeted - spent

  return {
    percentage: Math.min(percentage, 100),
    isOverBudget,
    remaining,
  }
}

export function getBudgetStatus(
  spent: number,
  budgeted: number
): {
  status: 'good' | 'warning' | 'danger'
  color: string
  bgColor: string
} {
  const percentage = budgeted > 0 ? (spent / budgeted) * 100 : 0

  if (percentage <= 50) {
    return {
      status: 'good',
      color: 'text-green-600',
      bgColor: 'bg-green-500',
    }
  } else if (percentage <= 80) {
    return {
      status: 'warning',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-500',
    }
  } else {
    return {
      status: 'danger',
      color: 'text-red-600',
      bgColor: 'bg-red-500',
    }
  }
}
