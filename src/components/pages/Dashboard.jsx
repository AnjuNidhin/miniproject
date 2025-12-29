
import { useState, useEffect } from "react"

import DashboardOverview from "../Dashboard/DashboardOverview"
import TransactionForm from "../Forms/TransactionForm"
import TransactionList from "../TransactionList/TransactionList"
import BudgetGoals from "../Budget/BudgetGoals"
import Reports from "../Reports/Reports"
import { getTransactions, addTransaction, deleteTransaction, updateBudgetGoal, getBudgetGoals } from "../../utils/storage"

const Dashboard = ({ onLogout }) => {
  const [transactions, setTransactions] = useState([])
  const [budgetGoals, setBudgetGoals] = useState({})
  const [activeTab, setActiveTab] = useState("overview") // overview, add, history, budget, reports
  const [viewMode, setViewMode] = useState("monthly") // monthly or yearly

  // Initialize data from localStorage
  useEffect(() => {
    setTransactions(getTransactions())
    setBudgetGoals(getBudgetGoals())
  }, [])

  // Handle adding new transaction
  const handleAddTransaction = (transactionData) => {
    const newTransaction = {
      id: Date.now(),
      ...transactionData,
      date: new Date(transactionData.date).toISOString(),
    }
    const updated = addTransaction(newTransaction)
    setTransactions(updated)
    setActiveTab("overview")
  }

  // Handle deleting transaction
  const handleDeleteTransaction = (id) => {
    const updated = deleteTransaction(id)
    setTransactions(updated)
  }

  // Handle updating budget goal
  const handleUpdateBudgetGoal = (category, amount) => {
    const updated = updateBudgetGoal(category, amount)
    setBudgetGoals(updated)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 font-bold text-xl text-slate-900">
              <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                F
              </div>
              <span>Finex</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-slate-600">
                <span className="text-sm">Welcome back</span>
              </div>
              <button
                onClick={onLogout}
                className="bg-slate-200 hover:bg-slate-300 text-slate-900 px-4 py-2 rounded-lg text-sm font-medium transition-all"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* View Mode Toggle */}
        <div className="flex justify-end mb-6">
          <div className="bg-white rounded-lg p-1 border border-slate-200 inline-flex">
            <button
              onClick={() => setViewMode("monthly")}
              className={`px-4 py-2 rounded-md font-medium transition-all ${
                viewMode === "monthly" ? "bg-teal-600 text-white" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setViewMode("yearly")}
              className={`px-4 py-2 rounded-md font-medium transition-all ${
                viewMode === "yearly" ? "bg-teal-600 text-white" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Yearly
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg border border-slate-200 p-1 mb-8 overflow-x-auto">
          <div className="flex gap-1 min-w-max sm:min-w-0 flex-nowrap sm:flex-wrap">
            {[
              { id: "overview", label: "Dashboard" },
              { id: "add", label: "Add Transaction" },
              { id: "history", label: "History" },
              { id: "budget", label: "Budget Goals" },
              { id: "reports", label: "Reports" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 font-medium text-sm rounded-md transition-all whitespace-nowrap ${
                  activeTab === tab.id ? "bg-teal-600 text-white" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "overview" && (
            <DashboardOverview transactions={transactions} budgetGoals={budgetGoals} viewMode={viewMode} />
          )}
          {activeTab === "add" && (
            <TransactionForm onSubmit={handleAddTransaction} categories={Object.keys(budgetGoals)} />
          )}
          {activeTab === "history" && (
            <TransactionList transactions={transactions} onDelete={handleDeleteTransaction} viewMode={viewMode} />
          )}
          {activeTab === "budget" && <BudgetGoals budgetGoals={budgetGoals} onUpdateBudget={handleUpdateBudgetGoal} />}
          {activeTab === "reports" && (
            <Reports transactions={transactions} budgetGoals={budgetGoals} viewMode={viewMode} />
          )}
        </div>
      </main>
    </div>
  )
}

export default Dashboard
