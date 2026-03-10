import { Link } from "react-router";
import { ArrowRight, TrendingUp, PiggyBank, Home as HomeIcon, Car, Umbrella, Receipt, CreditCard, BarChart3 } from "lucide-react";

const calculators = [
  {
    title: "Mortgage / Home Loan EMI",
    description: "Calculate your monthly home loan payments and see the complete amortization schedule.",
    path: "/mortgage",
    icon: HomeIcon,
    color: "from-blue-500 to-blue-600",
    popular: true,
  },
  {
    title: "Compound Interest",
    description: "See how your investments grow over time with the power of compound interest.",
    path: "/compound-interest",
    icon: TrendingUp,
    color: "from-green-500 to-green-600",
  },
  {
    title: "SIP Calculator",
    description: "Plan your mutual fund investments and project your wealth creation journey.",
    path: "/sip",
    icon: PiggyBank,
    color: "from-purple-500 to-purple-600",
    popular: true,
  },
  {
    title: "Auto Loan",
    description: "Calculate your car loan payments before you visit the dealership.",
    path: "/auto-loan",
    icon: Car,
    color: "from-orange-500 to-orange-600",
  },
  {
    title: "Retirement Savings",
    description: "Find out if you're on track for a comfortable retirement or need to save more.",
    path: "/retirement",
    icon: Umbrella,
    color: "from-pink-500 to-pink-600",
  },
  {
    title: "Income Tax Calculator",
    description: "Calculate your take-home pay after taxes and deductions.",
    path: "/income-tax",
    icon: Receipt,
    color: "from-yellow-500 to-yellow-600",
  },
  {
    title: "Credit Card Payoff",
    description: "Find out how long it will take to pay off your credit card debt.",
    path: "/credit-card",
    icon: CreditCard,
    color: "from-red-500 to-red-600",
  },
  {
    title: "ROI Calculator",
    description: "Evaluate your investment returns and calculate annualized ROI.",
    path: "/roi",
    icon: BarChart3,
    color: "from-indigo-500 to-indigo-600",
  },
];

export function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl mb-6">
            Smart Financial Calculators
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Make informed financial decisions with our comprehensive suite of calculators. 
            Plan your loans, investments, and retirement with confidence.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/mortgage"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-flex items-center gap-2"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#calculators"
              className="bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
            >
              Browse Calculators
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl mb-2">8</div>
              <div className="text-gray-600">Calculators</div>
            </div>
            <div>
              <div className="text-4xl mb-2">100%</div>
              <div className="text-gray-600">Free to Use</div>
            </div>
            <div>
              <div className="text-4xl mb-2">⚡</div>
              <div className="text-gray-600">Instant Results</div>
            </div>
            <div>
              <div className="text-4xl mb-2">📱</div>
              <div className="text-gray-600">Mobile Friendly</div>
            </div>
          </div>
        </div>
      </section>

      {/* Calculators Grid */}
      <section id="calculators" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl mb-4 text-gray-900">Choose Your Calculator</h2>
            <p className="text-xl text-gray-600">
              Select the calculator that fits your financial planning needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {calculators.map((calc) => {
              const Icon = calc.icon;
              return (
                <Link
                  key={calc.path}
                  to={calc.path}
                  className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-blue-300"
                >
                  {calc.popular && (
                    <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded-full font-semibold">
                      Popular
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${calc.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    
                    <h3 className="text-lg mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">
                      {calc.title}
                    </h3>
                    
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {calc.description}
                    </p>
                    
                    <div className="flex items-center text-blue-600 text-sm font-medium">
                      Calculate Now
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl mb-4 text-gray-900">Why Use FinCalc Pro?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl mb-2 text-gray-900">Accurate Calculations</h3>
              <p className="text-gray-600">
                All calculators use industry-standard formulas to provide accurate financial projections.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <PiggyBank className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl mb-2 text-gray-900">Easy to Use</h3>
              <p className="text-gray-600">
                Simple, intuitive interfaces that make financial planning accessible to everyone.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl mb-2 text-gray-900">Visual Insights</h3>
              <p className="text-gray-600">
                Interactive charts and detailed breakdowns help you understand the numbers better.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}