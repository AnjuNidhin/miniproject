
const LandingPage = ({ onGoToDashboard }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 relative overflow-hidden font-sans">
      {/* Decorative blurred background elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-200 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-teal-200 blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center px-6 md:px-12 py-6">
        <div className="flex items-center gap-2 font-bold text-xl md:text-2xl text-slate-900">
          <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            F
          </div>
          <span>Finex</span>
        </div>
        <button
          onClick={onGoToDashboard}
          className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg transition-all"
        >
          Sign in
        </button>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 text-center">
        <h1 className="text-5xl md:text-7xl font-light text-slate-900 mb-6 max-w-4xl leading-tight">
          Create, <span className="italic font-serif text-teal-600">invest</span>
          <br />
          Earn, <span className="italic font-serif text-teal-600">relax</span>
        </h1>

        <p className="max-w-2xl text-slate-600 text-lg md:text-xl mb-8 leading-relaxed">
          Finex helps you track and manage your money with clarity. Set budgets, categorize expenses, and gain insights
          into your spending habits with beautiful visualizations.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={onGoToDashboard}
            className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-full font-medium shadow-lg transition-all"
          >
            Go to Dashboard
          </button>
          <button
            onClick={onGoToDashboard}
            className="bg-white hover:bg-slate-50 text-slate-900 px-8 py-4 rounded-full font-medium border border-slate-200 shadow-lg transition-all"
          >
            Learn More
          </button>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl">
          <div className="bg-white bg-opacity-60 backdrop-blur-sm p-6 rounded-xl border border-slate-200">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="font-semibold text-slate-900 mb-2">Visual Analytics</h3>
            <p className="text-slate-600 text-sm">Beautiful charts and graphs to understand your spending patterns</p>
          </div>
          <div className="bg-white bg-opacity-60 backdrop-blur-sm p-6 rounded-xl border border-slate-200">
            <div className="text-3xl mb-3">💰</div>
            <h3 className="font-semibold text-slate-900 mb-2">Budget Goals</h3>
            <p className="text-slate-600 text-sm">Set and track budget goals for different expense categories</p>
          </div>
          <div className="bg-white bg-opacity-60 backdrop-blur-sm p-6 rounded-xl border border-slate-200">
            <div className="text-3xl mb-3">📈</div>
            <h3 className="font-semibold text-slate-900 mb-2">Smart Insights</h3>
            <p className="text-slate-600 text-sm">Get detailed spending reports and personalized insights</p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default LandingPage
