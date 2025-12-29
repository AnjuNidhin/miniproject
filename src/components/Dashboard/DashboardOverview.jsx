
import { useMemo } from "react"
import {
  getTotalIncome,
  getTotalExpenses,
  getExpensesByCategory,
  getTransactionsByMonth,
  getTransactionsByYear,
} from "../../utils/storage"
import { formatCurrency, getMonthName } from "../../utils/calculations"
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

const DashboardOverview = ({ transactions, budgetGoals, viewMode }) => {
  // Get filtered transactions based on view mode
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

  // Prepare data for pie chart
  const pieChartData = Object.entries(expensesByCategory).map(([category, amount]) => ({
    name: category,
    value: Number.parseFloat(amount.toFixed(2)),
  }))

  const COLORS = ["#4f46e5", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6"]

  // Prepare data for monthly line chart
  const monthlyData = useMemo(() => {
    const months = []
    for (let i = 11; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthTransactions = getTransactionsByMonth(date)
      const income = getTotalIncome(monthTransactions)
      const expenses = getTotalExpenses(monthTransactions)
      months.push({
        month: getMonthName(date.getMonth()),
        income: Number.parseFloat(income.toFixed(2)),
        expenses: Number.parseFloat(expenses.toFixed(2)),
      })
    }
    return months
  }, [transactions])

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Income Card */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-600 text-sm font-medium">Total Income</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{formatCurrency(totalIncome)}</p>
            </div>
            <div className="text-3xl">💰</div>
          </div>
        </div>

        {/* Expenses Card */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-600 text-sm font-medium">Total Expenses</p>
              <p className="text-3xl font-bold text-red-600 mt-2">{formatCurrency(totalExpenses)}</p>
            </div>
            <div className="text-3xl">💸</div>
          </div>
        </div>

        {/* Balance Card */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-600 text-sm font-medium">Balance</p>
              <p className={`text-3xl font-bold mt-2 ${balance >= 0 ? "text-green-600" : "text-red-600"}`}>
                {formatCurrency(balance)}
              </p>
            </div>
            <div className="text-3xl">📊</div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart - Monthly Trend */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">12-Month Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} dot={{ fill: "#10b981", r: 4 }} />
              <Line
                type="monotone"
                dataKey="expenses"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ fill: "#ef4444", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart - Category Distribution */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Expenses by Category</h3>
          {pieChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-slate-400">No expenses recorded yet</div>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Transactions</h3>
        {filteredTransactions.length > 0 ? (
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {filteredTransactions
              .slice(-5)
              .reverse()
              .map((transaction) => (
                <div key={transaction.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="text-slate-900 font-medium">{transaction.description}</p>
                    <p className="text-slate-600 text-sm">{transaction.category}</p>
                  </div>
                  <p className={`font-semibold ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}>
                    {transaction.type === "income" ? "+" : "-"} {formatCurrency(transaction.amount)}
                  </p>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-slate-400 text-center py-8">No transactions yet</p>
        )}
      </div>
    </div>
  )
}

export default DashboardOverview
