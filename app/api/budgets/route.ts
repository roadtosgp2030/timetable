import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
// import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const user = await requireAuth()

    // TODO: Uncomment when Prisma client is working
    // const budgets = await prisma.budget.findMany({
    //   where: {
    //     userId: user.id
    //   },
    //   include: {
    //     items: true
    //   },
    //   orderBy: [
    //     { year: 'desc' },
    //     { month: 'desc' }
    //   ]
    // })

    // Mock data for now
    const budgets: any[] = []

    return NextResponse.json({ budgets })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch budgets' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    const data = await request.json()

    // TODO: Uncomment when Prisma client is working
    // const budget = await prisma.budget.create({
    //   data: {
    //     name: data.name,
    //     month: data.month,
    //     year: data.year,
    //     totalBudget: data.totalBudget,
    //     userId: user.id,
    //     items: {
    //       create: data.items.map((item: any) => ({
    //         name: item.name,
    //         category: item.category,
    //         budgetAmount: item.budgetAmount,
    //         spentAmount: 0,
    //       }))
    //     }
    //   },
    //   include: {
    //     items: true
    //   }
    // })

    // Mock response for now
    const budget = { id: 'mock-id', ...data }

    return NextResponse.json({ success: true, budget })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Budget for this month already exists' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create budget' },
      { status: 500 }
    )
  }
}
