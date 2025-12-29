
import { useState, useMemo } from "react"
import { getTransactionsByMonth, getTransactionsByYear } from "../../utils/storage"
import { formatCurrency, formatDate } from "../../utils/calculations"

const TransactionList = ({ transactions, onDelete, viewMode }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all") // all, income, expense
  const [filterCategory, setFilterCategory] = useState("all")

  // Get filtered transactions based on view mode
  const periodTransactions = useMemo(() => {
    if (viewMode === "monthly") {
      return getTransactionsByMonth(new Date())
    } else {
      return getTransactionsByYear(new Date().getFullYear())
    }
  }, [transactions, viewMode])

  // Apply filters and search
  const filteredTransactions = useMemo(() => {
    return periodTransactions
      .filter((t) => filterType === "all" || t.type === filterType)
      .filter((t) => filterCategory === "all" || t.category === filterCategory)
      .filter(
        (t) =>
          t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.category.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [periodTransactions, searchTerm, filterType, filterCategory])

  // Get unique categories
  const categories = useMemo(() => {
    return ["all", ...new Set(periodTransactions.map((t) => t.category))]
  }, [periodTransactions])

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Transaction History</h2>

      {/* Search and Filters */}
      <div className="space-y-4 mb-6">
        {/* Search */}
        <input
          type="text"
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
        />

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">Category</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "all" ? "All Categories" : cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      {filteredTransactions.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-semibold text-slate-900">Date</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-900">Description</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-900">Category</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-900">Type</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-900">Amount</th>
                <th className="text-center py-3 px-4 font-semibold text-slate-900">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4 text-slate-600">{formatDate(transaction.date)}</td>
                  <td className="py-3 px-4 text-slate-900 font-medium">{transaction.description}</td>
                  <td className="py-3 px-4">
                    <span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm">
                      {transaction.category}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        transaction.type === "income" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                    >
                      {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                    </span>
                  </td>
                  <td
                    className={`py-3 px-4 text-right font-semibold ${
                      transaction.type === "income" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"} {formatCurrency(transaction.amount)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => {
                        if (window.confirm("Are you sure you want to delete this transaction?")) {
                          onDelete(transaction.id)
                        }
                      }}
                      className="text-red-600 hover:text-red-800 font-medium text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-slate-400">No transactions found</p>
        </div>
      )}
    </div>
  )
}

export default TransactionList
