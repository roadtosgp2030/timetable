'use server'

import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import type { CreateBudgetData, UpdateBudgetItemSpending } from '@/types/budget'

export async function createBudget(data: CreateBudgetData) {
  const user = await requireAuth()

  try {
    const budget = await prisma.budget.create({
      data: {
        name: data.name,
        month: data.month,
        year: data.year,
        totalBudget: data.totalBudget,
        userId: user.id,
        items: {
          create: data.items.map(item => ({
            name: item.name,
            category: item.category,
            budgetAmount: item.budgetAmount,
            spentAmount: 0,
          })),
        },
      },
      include: {
        items: true,
      },
    })

    revalidatePath('/budgets')
    return { success: true, budget }
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { success: false, error: 'Budget for this month already exists' }
    }
    return { success: false, error: 'Failed to create budget' }
  }
}

export async function getBudgets() {
  const user = await requireAuth()

  try {
    const budgets = await prisma.budget.findMany({
      where: {
        userId: user.id,
      },
      include: {
        items: true,
      },
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
    })

    return budgets
  } catch (error) {
    throw new Error('Failed to fetch budgets')
  }
}

export async function updateBudgetItemSpending(data: UpdateBudgetItemSpending) {
  const user = await requireAuth()

  try {
    const budgetItem = await prisma.budgetItem.findFirst({
      where: {
        id: data.id,
        budget: {
          userId: user.id,
        },
      },
    })

    if (!budgetItem) {
      throw new Error('Budget item not found')
    }

    const updatedItem = await prisma.budgetItem.update({
      where: {
        id: data.id,
      },
      data: {
        spentAmount: data.spentAmount,
      },
    })

    revalidatePath('/budgets')
    return { success: true, item: updatedItem }
  } catch (error) {
    return { success: false, error: 'Failed to update spending' }
  }
}

export async function deleteBudget(budgetId: string) {
  const user = await requireAuth()

  try {
    const budget = await prisma.budget.findFirst({
      where: {
        id: budgetId,
        userId: user.id,
      },
    })

    if (!budget) {
      throw new Error('Budget not found')
    }

    await prisma.budget.delete({
      where: {
        id: budgetId,
      },
    })

    revalidatePath('/budgets')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete budget' }
  }
}
