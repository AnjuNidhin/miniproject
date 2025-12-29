
import { useState } from "react"
import "./index.css"
import LandingPage from "./components/pages/LandingPage"
import Dashboard from "./components/pages/Dashboard"

function App() {
  const [currentPage, setCurrentPage] = useState("landing") // 'landing' or 'dashboard'

  const handleGoToDashboard = () => setCurrentPage("dashboard")
  const handleBackToLanding = () => setCurrentPage("landing")

  return (
    <>
      {currentPage === "landing" ? (
        <LandingPage onGoToDashboard={handleGoToDashboard} />
      ) : (
        <Dashboard onLogout={handleBackToLanding} />
      )}
    </>
  )
}

export default App
