'use client'

import { formatCurrency } from '@/utils/budget'
import type { Budget } from '@/types/budget'

interface BudgetOverviewProps {
  budgets: Budget[]
}

export function BudgetOverview({ budgets }: BudgetOverviewProps) {
  const currentMonth = new Date().getMonth() + 1
  const currentYear = new Date().getFullYear()

  const currentBudget = budgets.find(
    budget => budget.month === currentMonth && budget.year === currentYear
  )

  const totalBudgets = budgets.length
  const totalBudgetAmount = budgets.reduce(
    (sum, budget) => sum + budget.totalBudget,
    0
  )
  const totalSpent = budgets.reduce(
    (sum, budget) =>
      sum +
      budget.items.reduce((itemSum, item) => itemSum + item.spentAmount, 0),
    0
  )

  const averageBudget = totalBudgets > 0 ? totalBudgetAmount / totalBudgets : 0
  const overBudgetCount = budgets.filter(budget => {
    const spent = budget.items.reduce((sum, item) => sum + item.spentAmount, 0)
    return spent > budget.totalBudget
  }).length

  const stats = [
    {
      label: 'Total Budgets',
      value: totalBudgets.toString(),
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Total Budget Amount',
      value: formatCurrency(totalBudgetAmount),
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Total Spent',
      value: formatCurrency(totalSpent),
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      label: 'Average Budget',
      value: formatCurrency(averageBudget),
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      label: 'Over Budget',
      value: `${overBudgetCount}/${totalBudgets}`,
      color: overBudgetCount > 0 ? 'text-red-600' : 'text-green-600',
      bgColor: overBudgetCount > 0 ? 'bg-red-50' : 'bg-green-50',
    },
  ]

  return (
    <div className='mb-8'>
      <h2 className='text-lg font-semibold text-gray-900 mb-4'>
        Budget Overview
      </h2>

      {currentBudget && (
        <div className='mb-6 p-4 border rounded-lg bg-blue-50'>
          <h3 className='font-medium text-blue-900 mb-2'>
            Current Month Budget
          </h3>
          <div className='grid grid-cols-2 gap-4 text-sm'>
            <div>
              <span className='text-blue-700'>Budget: </span>
              <span className='font-medium'>
                {formatCurrency(currentBudget.totalBudget)}
              </span>
            </div>
            <div>
              <span className='text-blue-700'>Spent: </span>
              <span className='font-medium'>
                {formatCurrency(
                  currentBudget.items.reduce(
                    (sum, item) => sum + item.spentAmount,
                    0
                  )
                )}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4'>
        {stats.map((stat, index) => (
          <div key={index} className={`p-4 rounded-lg ${stat.bgColor}`}>
            <div className={`text-2xl font-bold ${stat.color}`}>
              {stat.value}
            </div>
            <div className='text-sm text-gray-600 mt-1'>{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
