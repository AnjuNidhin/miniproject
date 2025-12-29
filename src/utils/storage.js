// LocalStorage utility functions for managing transactions and budget goals

const TRANSACTIONS_KEY = "finex_transactions"
const BUDGET_GOALS_KEY = "finex_budget_goals"

// Default budget categories
const DEFAULT_CATEGORIES = {
  Food: 500,
  Transport: 300,
  Bills: 1000,
  Entertainment: 200,
  Shopping: 400,
  Health: 200,
  Other: 300,
}

// Get all transactions
export const getTransactions = () => {
  try {
    const data = localStorage.getItem(TRANSACTIONS_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error("Error reading transactions:", error)
    return []
  }
}

// Add new transaction
export const addTransaction = (transaction) => {
  try {
    const transactions = getTransactions()
    transactions.push(transaction)
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions))
    return transactions
  } catch (error) {
    console.error("Error adding transaction:", error)
    return []
  }
}

// Delete transaction by ID
export const deleteTransaction = (id) => {
  try {
    const transactions = getTransactions()
    const filtered = transactions.filter((t) => t.id !== id)
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(filtered))
    return filtered
  } catch (error) {
    console.error("Error deleting transaction:", error)
    return []
  }
}

// Get budget goals
export const getBudgetGoals = () => {
  try {
    const data = localStorage.getItem(BUDGET_GOALS_KEY)
    return data ? JSON.parse(data) : DEFAULT_CATEGORIES
  } catch (error) {
    console.error("Error reading budget goals:", error)
    return DEFAULT_CATEGORIES
  }
}

// Update budget goal for a category
export const updateBudgetGoal = (category, amount) => {
  try {
    const goals = getBudgetGoals()
    goals[category] = Number.parseFloat(amount) || 0
    localStorage.setItem(BUDGET_GOALS_KEY, JSON.stringify(goals))
    return goals
  } catch (error) {
    console.error("Error updating budget goal:", error)
    return {}
  }
}

// Get transactions for a specific month
export const getTransactionsByMonth = (date) => {
  const transactions = getTransactions()
  const year = date.getFullYear()
  const month = date.getMonth()

  return transactions.filter((t) => {
    const transactionDate = new Date(t.date)
    return transactionDate.getFullYear() === year && transactionDate.getMonth() === month
  })
}

// Get transactions for a specific year
export const getTransactionsByYear = (year) => {
  const transactions = getTransactions()
  return transactions.filter((t) => {
    const transactionDate = new Date(t.date)
    return transactionDate.getFullYear() === year
  })
}

// Calculate total income for period
export const getTotalIncome = (transactions) => {
  return transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + Number.parseFloat(t.amount), 0)
}

// Calculate total expenses for period
export const getTotalExpenses = (transactions) => {
  return transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + Number.parseFloat(t.amount), 0)
}

// Calculate expenses by category
export const getExpensesByCategory = (transactions) => {
  const categories = {}
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      categories[t.category] = (categories[t.category] || 0) + Number.parseFloat(t.amount)
    })
  return categories
}
