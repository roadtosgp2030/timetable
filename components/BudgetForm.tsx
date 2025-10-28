'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { CreateBudgetData, CreateBudgetItemData } from '@/types/budget'

interface BudgetFormProps {
  onSubmit: (data: CreateBudgetData) => void
  onCancel: () => void
  isLoading?: boolean
}

const CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Bills & Utilities',
  'Healthcare',
  'Education',
  'Travel',
  'Other',
]

const MONTHS = [
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

export function BudgetForm({ onSubmit, onCancel, isLoading }: BudgetFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    totalBudget: 0,
  })

  const [items, setItems] = useState<CreateBudgetItemData[]>([
    { name: '', category: CATEGORIES[0], budgetAmount: 0 },
  ])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) return
    if (formData.totalBudget <= 0) return
    if (items.some(item => !item.name.trim() || item.budgetAmount <= 0)) return

    onSubmit({
      ...formData,
      items: items.filter(item => item.name.trim() && item.budgetAmount > 0),
    })
  }

  const addItem = () => {
    setItems([...items, { name: '', category: CATEGORIES[0], budgetAmount: 0 }])
  }

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index))
    }
  }

  const updateItem = (
    index: number,
    field: keyof CreateBudgetItemData,
    value: string | number
  ) => {
    setItems(
      items.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    )
  }

  const totalItemsBudget = items.reduce(
    (sum, item) => sum + item.budgetAmount,
    0
  )

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div>
          <Label htmlFor='name'>Budget Name</Label>
          <Input
            id='name'
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            placeholder='e.g., Monthly Budget'
            required
          />
        </div>

        <div>
          <Label htmlFor='totalBudget'>Total Budget (VND)</Label>
          <Input
            id='totalBudget'
            type='number'
            step='1000'
            min='0'
            value={formData.totalBudget || ''}
            onChange={e =>
              setFormData({
                ...formData,
                totalBudget: parseFloat(e.target.value) || 0,
              })
            }
            placeholder='e.g., 50000000 (50 million VND)'
            required
          />
          <p className='text-xs text-gray-500 mt-1'>
            Enter amount in VND (e.g., 50,000,000 for 50 million VND)
          </p>
        </div>

        <div>
          <Label htmlFor='month'>Month</Label>
          <select
            id='month'
            className='w-full h-9 px-3 py-1 text-sm border border-input bg-transparent rounded-md'
            value={formData.month}
            onChange={e =>
              setFormData({ ...formData, month: parseInt(e.target.value) })
            }>
            {MONTHS.map((month, index) => (
              <option key={month} value={index + 1}>
                {month}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor='year'>Year</Label>
          <Input
            id='year'
            type='number'
            min='2020'
            max='2030'
            value={formData.year}
            onChange={e =>
              setFormData({
                ...formData,
                year: parseInt(e.target.value) || new Date().getFullYear(),
              })
            }
          />
        </div>
      </div>

      <div>
        <div className='flex justify-between items-center mb-4'>
          <h3 className='text-lg font-medium'>Budget Items</h3>
          <Button type='button' variant='outline' onClick={addItem}>
            Add Item
          </Button>
        </div>

        <div className='space-y-3'>
          {items.map((item, index) => (
            <div key={index} className='flex gap-2 items-start'>
              <div className='flex-1'>
                <Input
                  placeholder='Item name'
                  value={item.name}
                  onChange={e => updateItem(index, 'name', e.target.value)}
                  required
                />
              </div>

              <div className='w-40'>
                <select
                  className='w-full h-9 px-3 py-1 text-sm border border-input bg-transparent rounded-md'
                  value={item.category}
                  onChange={e => updateItem(index, 'category', e.target.value)}>
                  {CATEGORIES.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className='w-40'>
                <Input
                  type='number'
                  step='1000'
                  min='0'
                  placeholder='VND amount'
                  value={item.budgetAmount || ''}
                  onChange={e =>
                    updateItem(
                      index,
                      'budgetAmount',
                      parseFloat(e.target.value) || 0
                    )
                  }
                  required
                />
              </div>

              {items.length > 1 && (
                <Button
                  type='button'
                  variant='destructive'
                  size='sm'
                  onClick={() => removeItem(index)}>
                  ×
                </Button>
              )}
            </div>
          ))}
        </div>

        {totalItemsBudget > 0 && (
          <div className='mt-4 p-3 bg-gray-50 rounded-md'>
            <div className='flex justify-between text-sm'>
              <span>Total Items Budget:</span>
              <span className='font-medium'>
                {totalItemsBudget.toLocaleString('vi-VN')} VND
              </span>
            </div>
            {totalItemsBudget > formData.totalBudget && (
              <p className='text-red-500 text-xs mt-1'>
                Items total exceeds overall budget
              </p>
            )}
          </div>
        )}
      </div>

      <div className='flex gap-2 justify-end'>
        <Button type='button' variant='outline' onClick={onCancel}>
          Cancel
        </Button>
        <Button type='submit' disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Budget'}
        </Button>
      </div>
    </form>
  )
}
