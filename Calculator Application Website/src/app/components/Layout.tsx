import { Outlet, Link, useLocation } from "react-router";
import { Calculator, Menu, X } from "lucide-react";
import { useState } from "react";
import { useCurrency, CURRENCIES } from "../context/CurrencyContext";

const calculators = [
  { name: "Mortgage / Home Loan EMI", path: "/mortgage", icon: "🏠" },
  { name: "Compound Interest", path: "/compound-interest", icon: "📈" },
  { name: "SIP Calculator", path: "/sip", icon: "💰" },
  { name: "Auto Loan", path: "/auto-loan", icon: "🚗" },
  { name: "Retirement Savings", path: "/retirement", icon: "🏖️" },
  { name: "Income Tax", path: "/income-tax", icon: "💼" },
  { name: "Credit Card Payoff", path: "/credit-card", icon: "💳" },
  { name: "ROI Calculator", path: "/roi", icon: "📊" },
];

export function Layout() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur-sm opacity-75 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-2.5 rounded-xl shadow-lg">
                  <Calculator className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="font-bold text-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  FinCalc Pro
                </h1>
                <p className="text-xs text-gray-500 font-medium tracking-wide">Premium Financial Tools</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-2 bg-gray-50/50 backdrop-blur-sm rounded-full px-2 py-2 border border-gray-200/50">
              {calculators.map((calc) => (
                <Link
                  key={calc.path}
                  to={calc.path}
                  className={`px-3 py-2 rounded-full text-xs font-medium transition-all duration-300 ${
                    location.pathname === calc.path
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-white hover:shadow-sm"
                  }`}
                >
                  <span className="mr-1">{calc.icon}</span>
                  {calc.name}
                </Link>
              ))}
            </nav>

            {/* Currency Selector + Mobile Button */}
            <div className="flex items-center gap-3">
              {/* Currency Dropdown */}
              <div className="relative flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-500 hidden sm:inline">Currency:</span>
                <select
                  value={currency.code}
                  onChange={(e) => {
                    const selected = CURRENCIES.find((c) => c.code === e.target.value);
                    if (selected) setCurrency(selected);
                  }}
                  className="appearance-none bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold px-4 py-2 pr-8 rounded-full shadow-md cursor-pointer border-none outline-none"
                  style={{ backgroundImage: "linear-gradient(to right, #2563eb, #9333ea)" }}
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code} style={{ background: "#1e293b" }}>
                      {c.symbol} {c.code} — {c.name}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 text-white text-xs">▼</span>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="lg:hidden pb-4 pt-4 space-y-2 border-t border-gray-200/50">
              {calculators.map((calc) => (
                <Link
                  key={calc.path}
                  to={calc.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    location.pathname === calc.path
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-50 border border-gray-200/50"
                  }`}
                >
                  <span className="mr-2">{calc.icon}</span>
                  {calc.name}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600 text-sm">
            <p>© 2026 FinCalc Pro. All financial calculators for planning and estimation purposes.</p>
            <p className="mt-2 text-xs text-gray-500">
              Results are estimates based on inputs provided. Please consult with financial advisors for personalized advice.
            </p>
            <p className="mt-2 text-xs text-gray-400">
              Currently showing values in: <span className="font-semibold text-blue-600">{currency.name} ({currency.symbol})</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
