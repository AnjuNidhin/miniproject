"use client"

import { useState, useMemo } from "react"
import { getTransactionsByMonth, getExpensesByCategory } from "../../utils/storage"
import { formatCurrency, getSpendingStatus } from "../../utils/calculations"

const BudgetGoals = ({ budgetGoals, onUpdateBudget }) => {
  const [editingCategory, setEditingCategory] = useState(null)
  const [editAmount, setEditAmount] = useState("")

  // Get current month expenses by category
  const currentMonthTransactions = useMemo(() => {
    return getTransactionsByMonth(new Date())
  }, [])

  const expensesByCategory = getExpensesByCategory(currentMonthTransactions)

  // Handle editing budget goal
  const handleEditBudget = (category, currentAmount) => {
    setEditingCategory(category)
    setEditAmount(currentAmount.toString())
  }

  const handleSaveBudget = (category) => {
    if (editAmount && Number.parseFloat(editAmount) > 0) {
      onUpdateBudget(category, Number.parseFloat(editAmount))
      setEditingCategory(null)
      setEditAmount("")
    }
  }

  const handleCancel = () => {
    setEditingCategory(null)
    setEditAmount("")
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Budget Goals (Monthly)</h2>

      <div className="space-y-4">
        {Object.entries(budgetGoals).map(([category, budget]) => {
          const spent = expensesByCategory[category] || 0
          const remaining = budget - spent
          const percentage = (spent / budget) * 100
          const status = getSpendingStatus(spent, budget)

          return (
            <div key={category} className="border border-slate-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-slate-900">{category}</h3>
                  <p className="text-sm text-slate-600">
                    {formatCurrency(spent)} spent of {formatCurrency(budget)}
                  </p>
                </div>
                {editingCategory === category ? (
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={editAmount}
                      onChange={(e) => setEditAmount(e.target.value)}
                      className="w-24 px-2 py-1 border border-slate-300 rounded-lg"
                      step="0.01"
                      min="0"
                    />
                    <button
                      onClick={() => handleSaveBudget(category)}
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-3 py-1 bg-slate-300 hover:bg-slate-400 text-slate-900 rounded-lg text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleEditBudget(category, budget)}
                    className="px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm"
                  >
                    Edit
                  </button>
                )}
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden mb-2">
                <div
                  className={`h-full transition-all ${
                    status === "healthy" ? "bg-green-500" : status === "warning" ? "bg-yellow-500" : "bg-red-500"
                  }`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>

              {/* Status */}
              <div className="flex justify-between items-center">
                <p className="text-sm text-slate-600">
                  {remaining > 0
                    ? formatCurrency(remaining) + " remaining"
                    : formatCurrency(Math.abs(remaining)) + " over budget"}
                </p>
                <p className="text-sm font-medium">{Math.round(percentage)}%</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default BudgetGoals
