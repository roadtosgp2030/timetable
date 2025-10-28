'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { BudgetForm } from '@/components/BudgetForm'
import { BudgetCard } from '@/components/BudgetCard'
import { BudgetOverview } from '@/components/BudgetOverview'
import { Modal } from '@/components/ui/modal'
import type { Budget, CreateBudgetData } from '@/types/budget'

// Mock data for development - replace with actual API calls when Prisma is working
const mockBudgets: Budget[] = [
  {
    id: '1',
    name: 'October 2025 Budget',
    month: 10,
    year: 2025,
    totalBudget: 75000000, // 75 million VND
    userId: 'user1',
    createdAt: new Date(),
    updatedAt: new Date(),
    items: [
      {
        id: '1',
        name: 'Groceries',
        category: 'Food & Dining',
        budgetAmount: 12000000, // 12 million VND
        spentAmount: 8000000, // 8 million VND
        budgetId: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        name: 'Gas',
        category: 'Transportation',
        budgetAmount: 5000000, // 5 million VND
        spentAmount: 3750000, // 3.75 million VND
        budgetId: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '3',
        name: 'Entertainment',
        category: 'Entertainment',
        budgetAmount: 7500000, // 7.5 million VND
        spentAmount: 7000000, // 7 million VND
        budgetId: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '4',
        name: 'Utilities',
        category: 'Bills & Utilities',
        budgetAmount: 3750000, // 3.75 million VND
        spentAmount: 3625000, // 3.625 million VND
        budgetId: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  },
  {
    id: '2',
    name: 'September 2025 Budget',
    month: 9,
    year: 2025,
    totalBudget: 70000000, // 70 million VND
    userId: 'user1',
    createdAt: new Date(),
    updatedAt: new Date(),
    items: [
      {
        id: '5',
        name: 'Groceries',
        category: 'Food & Dining',
        budgetAmount: 11250000, // 11.25 million VND
        spentAmount: 12000000, // 12 million VND (over budget)
        budgetId: '2',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '6',
        name: 'Transportation',
        category: 'Transportation',
        budgetAmount: 4500000, // 4.5 million VND
        spentAmount: 4375000, // 4.375 million VND
        budgetId: '2',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '7',
        name: 'Shopping',
        category: 'Shopping',
        budgetAmount: 6250000, // 6.25 million VND
        spentAmount: 8000000, // 8 million VND (over budget)
        budgetId: '2',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  },
]

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>(mockBudgets)
  const [showForm, setShowForm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleCreateBudget = async (data: CreateBudgetData) => {
    setIsLoading(true)
    try {
      // TODO: Replace with actual API call when Prisma is working
      // const result = await createBudget(data)

      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API delay

      const newBudget: Budget = {
        id: String(Date.now()),
        ...data,
        userId: 'user1',
        createdAt: new Date(),
        updatedAt: new Date(),
        items: data.items.map((item, index) => ({
          id: String(Date.now() + index),
          ...item,
          spentAmount: 0,
          budgetId: String(Date.now()),
          createdAt: new Date(),
          updatedAt: new Date(),
        })),
      }

      setBudgets([newBudget, ...budgets])
      setShowForm(false)
    } catch (error) {
      console.error('Failed to create budget:', error)
      // TODO: Show error message to user
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateSpending = async (itemId: string, amount: number) => {
    setIsUpdating(true)
    try {
      // TODO: Replace with actual API call when Prisma is working
      // await updateBudgetItemSpending({ id: itemId, spentAmount: amount })

      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 500))

      setBudgets(
        budgets.map(budget => ({
          ...budget,
          items: budget.items.map(item =>
            item.id === itemId ? { ...item, spentAmount: amount } : item
          ),
        }))
      )
    } catch (error) {
      console.error('Failed to update spending:', error)
      // TODO: Show error message to user
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeleteBudget = async (budgetId: string) => {
    if (!confirm('Are you sure you want to delete this budget?')) {
      return
    }

    try {
      // TODO: Replace with actual API call when Prisma is working
      // await deleteBudget(budgetId)

      setBudgets(budgets.filter(budget => budget.id !== budgetId))
    } catch (error) {
      console.error('Failed to delete budget:', error)
      // TODO: Show error message to user
    }
  }

  return (
    <div className='p-6 max-w-6xl mx-auto'>
      <div className='flex justify-between items-center mb-8'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>
            Budget Management
          </h1>
          <p className='text-gray-600'>
            Track your monthly budgets and spending
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>Create New Budget</Button>
      </div>

      {budgets.length > 0 && <BudgetOverview budgets={budgets} />}

      {budgets.length === 0 ? (
        <div className='text-center py-12'>
          <div className='text-gray-400 text-lg mb-2'>
            No budgets created yet
          </div>
          <p className='text-gray-500 mb-4'>
            Create your first budget to start tracking your spending
          </p>
          <Button onClick={() => setShowForm(true)}>
            Create Your First Budget
          </Button>
        </div>
      ) : (
        <div className='grid gap-6 md:grid-cols-1 lg:grid-cols-2'>
          {budgets.map(budget => (
            <BudgetCard
              key={budget.id}
              budget={budget}
              onUpdateSpending={handleUpdateSpending}
              onDelete={handleDeleteBudget}
              isUpdating={isUpdating}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title='Create New Budget'>
        <BudgetForm
          onSubmit={handleCreateBudget}
          onCancel={() => setShowForm(false)}
          isLoading={isLoading}
        />
      </Modal>
    </div>
  )
}
