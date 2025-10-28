'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  formatCurrency,
  getMonthName,
  calculateBudgetProgress,
  getBudgetStatus,
} from '@/utils/budget'
import type { Budget, BudgetItem } from '@/types/budget'

interface BudgetCardProps {
  budget: Budget
  onUpdateSpending: (itemId: string, amount: number) => void
  onDelete: (budgetId: string) => void
  isUpdating?: boolean
}

export function BudgetCard({
  budget,
  onUpdateSpending,
  onDelete,
  isUpdating,
}: BudgetCardProps) {
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [tempSpending, setTempSpending] = useState<{ [key: string]: number }>(
    {}
  )

  const totalSpent = budget.items.reduce(
    (sum, item) => sum + item.spentAmount,
    0
  )
  const totalBudgeted = budget.items.reduce(
    (sum, item) => sum + item.budgetAmount,
    0
  )
  const remainingBudget = budget.totalBudget - totalSpent

  const handleEditSpending = (item: BudgetItem) => {
    setEditingItem(item.id)
    setTempSpending({ ...tempSpending, [item.id]: item.spentAmount })
  }

  const handleSaveSpending = (itemId: string) => {
    const amount = tempSpending[itemId] || 0
    onUpdateSpending(itemId, amount)
    setEditingItem(null)
  }

  const handleCancelEdit = () => {
    setEditingItem(null)
    setTempSpending({})
  }

  const getProgressPercentage = (spent: number, budgeted: number) => {
    if (budgeted === 0) return 0
    return Math.min((spent / budgeted) * 100, 100)
  }

  const getProgressColor = (spent: number, budgeted: number) => {
    const percentage = getProgressPercentage(spent, budgeted)
    if (percentage <= 50) return 'bg-green-500'
    if (percentage <= 80) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className='border rounded-lg p-6 bg-white shadow-sm'>
      <div className='flex justify-between items-start mb-4'>
        <div>
          <h3 className='text-lg font-semibold'>{budget.name}</h3>
          <p className='text-gray-600'>
            {getMonthName(budget.month)} {budget.year}
          </p>
        </div>
        <Button
          variant='destructive'
          size='sm'
          onClick={() => onDelete(budget.id)}>
          Delete
        </Button>
      </div>

      <div className='mb-6'>
        <div className='flex justify-between items-center mb-2'>
          <span className='text-sm text-gray-600'>Overall Budget Progress</span>
          <span className='text-sm font-medium'>
            {formatCurrency(totalSpent)} / {formatCurrency(budget.totalBudget)}
          </span>
        </div>
        <div className='w-full bg-gray-200 rounded-full h-2'>
          <div
            className={`h-2 rounded-full ${getProgressColor(
              totalSpent,
              budget.totalBudget
            )}`}
            style={{
              width: `${getProgressPercentage(
                totalSpent,
                budget.totalBudget
              )}%`,
            }}
          />
        </div>
        <div
          className={`mt-1 text-sm ${
            remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
          {remainingBudget >= 0 ? 'Remaining: ' : 'Over budget: '}
          {formatCurrency(Math.abs(remainingBudget))}
        </div>
      </div>

      <div className='space-y-3'>
        <h4 className='font-medium text-gray-900'>Budget Items</h4>
        {budget.items.map(item => (
          <div key={item.id} className='border rounded-md p-3'>
            <div className='flex justify-between items-center mb-2'>
              <div>
                <span className='font-medium'>{item.name}</span>
                <span className='ml-2 text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded'>
                  {item.category}
                </span>
              </div>
              <div className='flex items-center gap-2'>
                {editingItem === item.id ? (
                  <>
                    <Input
                      type='number'
                      step='0.01'
                      min='0'
                      value={tempSpending[item.id] || ''}
                      onChange={e =>
                        setTempSpending({
                          ...tempSpending,
                          [item.id]: parseFloat(e.target.value) || 0,
                        })
                      }
                      className='w-20 h-8'
                      disabled={isUpdating}
                    />
                    <Button
                      size='sm'
                      onClick={() => handleSaveSpending(item.id)}
                      disabled={isUpdating}>
                      ✓
                    </Button>
                    <Button
                      size='sm'
                      variant='outline'
                      onClick={handleCancelEdit}
                      disabled={isUpdating}>
                      ✕
                    </Button>
                  </>
                ) : (
                  <>
                    <span className='text-sm'>
                      ${item.spentAmount.toFixed(2)} / $
                      {item.budgetAmount.toFixed(2)}
                    </span>
                    <Button
                      size='sm'
                      variant='outline'
                      onClick={() => handleEditSpending(item)}>
                      Edit
                    </Button>
                  </>
                )}
              </div>
            </div>

            <div className='flex justify-between items-center mb-1'>
              <div className='w-full bg-gray-200 rounded-full h-2'>
                <div
                  className={`h-2 rounded-full ${getProgressColor(
                    item.spentAmount,
                    item.budgetAmount
                  )}`}
                  style={{
                    width: `${getProgressPercentage(
                      item.spentAmount,
                      item.budgetAmount
                    )}%`,
                  }}
                />
              </div>
            </div>

            <div className='text-xs text-gray-500'>
              {((item.spentAmount / item.budgetAmount) * 100).toFixed(1)}% used
              {item.spentAmount > item.budgetAmount && (
                <span className='text-red-500 ml-2'>
                  (${(item.spentAmount - item.budgetAmount).toFixed(2)} over)
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
