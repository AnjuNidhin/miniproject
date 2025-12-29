
import { useMemo } from "react"
import {
  getTransactionsByMonth,
  getTransactionsByYear,
  getTotalIncome,
  getTotalExpenses,
  getExpensesByCategory,
} from "../../utils/storage"
import { formatCurrency, exportToCSV } from "../../utils/calculations"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const Reports = ({ transactions, budgetGoals, viewMode }) => {
  // Get filtered transactions
  const filteredTransactions = useMemo(() => {
    if (viewMode === "monthly") {
      return getTransactionsByMonth(new Date())
    } else {
      return getTransactionsByYear(new Date().getFullYear())
    }
  }, [transactions, viewMode])

  const totalIncome = getTotalIncome(filteredTransactions)
  const totalExpenses = getTotalExpenses(filteredTransactions)
  const balance = totalIncome - totalExpenses
  const expensesByCategory = getExpensesByCategory(filteredTransactions)

  // Prepare bar chart data
  const chartData = useMemo(() => {
    return Object.entries(expensesByCategory)
      .map(([category, amount]) => ({
        category,
        spent: Number.parseFloat(amount.toFixed(2)),
        budget: budgetGoals[category] || 0,
      }))
      .sort((a, b) => b.spent - a.spent)
  }, [expensesByCategory, budgetGoals])

  // Calculate savings rate
  const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : 0

  // Calculate budget utilization
  const totalBudget = Object.values(budgetGoals).reduce((sum, val) => sum + val, 0)
  const budgetUtilization = totalBudget > 0 ? ((totalExpenses / totalBudget) * 100).toFixed(1) : 0

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <p className="text-slate-600 text-sm font-medium">Savings Rate</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{savingsRate}%</p>
          <p className="text-slate-600 text-xs mt-2">Of income saved</p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <p className="text-slate-600 text-sm font-medium">Budget Utilization</p>
          <p className="text-3xl font-bold text-teal-600 mt-2">{budgetUtilization}%</p>
          <p className="text-slate-600 text-xs mt-2">Of budget spent</p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <p className="text-slate-600 text-sm font-medium">Net Savings</p>
          <p className={`text-3xl font-bold mt-2 ${balance >= 0 ? "text-green-600" : "text-red-600"}`}>
            {formatCurrency(balance)}
          </p>
          <p className="text-slate-600 text-xs mt-2">Income minus expenses</p>
        </div>
      </div>

      {/* Category Comparison Chart */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Budget vs Actual by Category</h3>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="category" angle={-45} textAnchor="end" height={100} stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar dataKey="budget" fill="#4f46e5" name="Budget" />
              <Bar dataKey="spent" fill="#ef4444" name="Actual" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[400px] flex items-center justify-center text-slate-400">No data to display</div>
        )}
      </div>

      {/* Summary Table */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Detailed Summary</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-semibold text-slate-900">Category</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-900">Budget</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-900">Spent</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-900">Remaining</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-900">Usage %</th>
              </tr>
            </thead>
            <tbody>
              {chartData.map((row) => {
                const remaining = row.budget - row.spent
                const usage = row.budget > 0 ? ((row.spent / row.budget) * 100).toFixed(1) : 0
                return (
                  <tr key={row.category} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4 font-medium text-slate-900">{row.category}</td>
                    <td className="py-3 px-4 text-right text-slate-600">{formatCurrency(row.budget)}</td>
                    <td className="py-3 px-4 text-right text-slate-600">{formatCurrency(row.spent)}</td>
                    <td
                      className={`py-3 px-4 text-right font-medium ${remaining >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {formatCurrency(remaining)}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-600">{usage}%</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Button */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Export Data</h3>
        <button
          onClick={() => exportToCSV(filteredTransactions, `transactions-${viewMode}.csv`)}
          className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-medium transition-all"
        >
          Download CSV Report
        </button>
        <p className="text-slate-600 text-sm mt-3">
          Export your transactions and budget data for further analysis in spreadsheet applications
        </p>
      </div>
    </div>
  )
}

export default Reports
