export interface Budget {
  id: string
  name: string
  month: number
  year: number
  totalBudget: number
  userId: string
  items: BudgetItem[]
  createdAt: Date
  updatedAt: Date
}

export interface BudgetItem {
  id: string
  name: string
  category: string
  budgetAmount: number
  spentAmount: number
  budgetId: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateBudgetData {
  name: string
  month: number
  year: number
  totalBudget: number
  items: CreateBudgetItemData[]
}

export interface CreateBudgetItemData {
  name: string
  category: string
  budgetAmount: number
}

export interface UpdateBudgetItemSpending {
  id: string
  spentAmount: number
}
