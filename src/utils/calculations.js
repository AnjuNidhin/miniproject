// Utility functions for calculations and data processing

// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

// Format date
export const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

// Get month name
export const getMonthName = (month) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]
  return months[month]
}

// Get current month start and end
export const getCurrentMonthRange = () => {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), 1)
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  return { start, end }
}

// Calculate percentage
export const calculatePercentage = (value, total) => {
  if (total === 0) return 0
  return Math.round((value / total) * 100)
}

// Get spending status
export const getSpendingStatus = (spent, budget) => {
  const percentage = (spent / budget) * 100
  if (percentage <= 50) return "healthy"
  if (percentage <= 80) return "warning"
  return "danger"
}

// Export to CSV
export const exportToCSV = (transactions, filename = "transactions.csv") => {
  if (transactions.length === 0) {
    alert("No transactions to export")
    return
  }

  const headers = ["Date", "Type", "Category", "Description", "Amount"]
  const rows = transactions.map((t) => [
    formatDate(t.date),
    t.type.charAt(0).toUpperCase() + t.type.slice(1),
    t.category,
    t.description,
    t.amount,
  ])

  const csvContent = [headers.join(","), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(","))].join("\n")

  const blob = new Blob([csvContent], { type: "text/csv" })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  window.URL.revokeObjectURL(url)
}
