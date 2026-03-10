import { useState } from "react";
import { Card } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { NumericInput } from "../components/ui/numeric-input";
import { Button } from "../components/ui/button";
import { CreditCard } from "lucide-react";
import { useCurrency } from "../context/CurrencyContext";

export function CreditCardCalculator() {
  const { currency, fmt } = useCurrency();
  const [currentBalance, setCurrentBalance] = useState(5000);
  const [interestRate, setInterestRate] = useState(18.99);
  const [monthlyPayment, setMonthlyPayment] = useState(200);
  const [showResults, setShowResults] = useState(false);

  const calculatePayoff = () => {
    const monthlyRate = interestRate / 12 / 100;
    let balance = currentBalance;
    let months = 0;
    let totalInterestPaid = 0;
    const minPaymentPercent = 0.02;
    const minPaymentFloor = 25;
    while (balance > 0 && months < 600) {
      const interestCharge = balance * monthlyRate;
      const minPayment = Math.max(balance * minPaymentPercent, minPaymentFloor);
      const actualPayment = Math.max(monthlyPayment, minPayment);
      const payment = Math.min(actualPayment, balance + interestCharge);
      balance = balance + interestCharge - payment;
      totalInterestPaid += interestCharge;
      months++;
      if (balance < 0.01) { balance = 0; break; }
    }
    const totalPaid = currentBalance + totalInterestPaid;
    return { months, yearsToPayoff: months / 12, totalInterestPaid, totalPaid, currentBalance, monthlyPayment };
  };

  const results = showResults ? calculatePayoff() : null;

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-gradient-to-br from-red-500 to-red-600 p-3 rounded-lg">
            <CreditCard className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-4xl text-gray-900">Credit Card Payoff Calculator</h1>
            <p className="text-gray-600 mt-1">Find out how long it will take to pay off your credit card debt</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <Card className="p-6 shadow-lg">
            <h2 className="text-2xl mb-6 text-gray-900">Debt Details</h2>
            <div className="space-y-6">
              <div>
                <Label htmlFor="currentBalance" className="text-base">Current Credit Card Balance</Label>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-gray-500 font-semibold">{currency.symbol}</span>
                  <NumericInput id="currentBalance" value={currentBalance} onChange={setCurrentBalance} />
                </div>
                <input type="range" min="100" max="1000000" step="1000" value={currentBalance}
                  onChange={(e) => setCurrentBalance(Number(e.target.value))} className="w-full mt-2" />
                <p className="text-xs text-gray-400 mt-1">Range: {fmt(100)} – {fmt(1000000)}</p>
              </div>
              <div>
                <Label htmlFor="interestRate" className="text-base">Annual Interest Rate (APR)</Label>
                <div className="flex items-center gap-2 mt-2">
                  <NumericInput id="interestRate" step="0.1" value={interestRate} onChange={setInterestRate} />
                  <span className="text-gray-500">%</span>
                </div>
                <input type="range" min="5" max="30" step="0.1" value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))} className="w-full mt-2" />
              </div>
              <div>
                <Label htmlFor="monthlyPayment" className="text-base">Expected Monthly Payment</Label>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-gray-500 font-semibold">{currency.symbol}</span>
                  <NumericInput id="monthlyPayment" value={monthlyPayment} onChange={setMonthlyPayment} />
                </div>
                <input type="range" min="25" max="100000" step="500" value={monthlyPayment}
                  onChange={(e) => setMonthlyPayment(Number(e.target.value))} className="w-full mt-2" />
                <p className="text-xs text-gray-500 mt-2">Minimum payment is typically 2% of balance or {fmt(25)}, whichever is greater</p>
              </div>
              <Button onClick={() => setShowResults(true)} className="w-full" size="lg">Calculate Payoff</Button>
            </div>
          </Card>
        </div>

        <div>
          {showResults && results && (
            <Card className="p-6 shadow-lg">
              <h2 className="text-2xl mb-6 text-gray-900">Payoff Summary</h2>
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
                  <div className="text-sm text-blue-600 mb-1">Time to Pay Off</div>
                  <div className="text-3xl text-blue-700">{results.months} months</div>
                  <div className="text-sm text-blue-600 mt-1">({results.yearsToPayoff.toFixed(1)} years)</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <div className="text-xs text-gray-600 mb-1">Current Balance</div>
                    <div className="text-xl text-gray-900">{fmt(results.currentBalance)}</div>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <div className="text-xs text-red-600 mb-1">Total Interest</div>
                    <div className="text-xl text-red-700">{fmt(results.totalInterestPaid)}</div>
                  </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <div className="text-sm text-purple-600 mb-1">Total Amount to Pay</div>
                  <div className="text-2xl text-purple-700">{fmt(results.totalPaid)}</div>
                </div>
                <div className="pt-4">
                  <div className="h-8 bg-gray-200 rounded-lg overflow-hidden flex">
                    <div style={{ width: `${(results.currentBalance / results.totalPaid) * 100}%` }}
                      className="bg-blue-500 flex items-center justify-center text-white text-xs">
                      {((results.currentBalance / results.totalPaid) * 100).toFixed(0)}%
                    </div>
                    <div style={{ width: `${(results.totalInterestPaid / results.totalPaid) * 100}%` }}
                      className="bg-red-500 flex items-center justify-center text-white text-xs">
                      {((results.totalInterestPaid / results.totalPaid) * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg mt-4 border">
                  <h3 className="text-sm mb-3 text-gray-700">Payoff Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Balance:</span><span>{fmt(results.currentBalance)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monthly Payment:</span><span>{fmt(results.monthlyPayment)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Interest Rate:</span><span>{interestRate}% APR</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-gray-600">Months to Payoff:</span><span className="font-semibold">{results.months}</span>
                    </div>
                    <div className="flex justify-between text-red-600">
                      <span>Total Interest Paid:</span><span className="font-semibold">{fmt(results.totalInterestPaid)}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h3 className="text-sm mb-2 text-green-700">💡 Tip</h3>
                  <p className="text-xs text-green-700">Increasing your monthly payment by just {fmt(500)} can significantly reduce the time and interest you'll pay!</p>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <p className="text-xs text-amber-700">
                    <strong>Note:</strong> This assumes no additional charges to the card during the payoff period.
                  </p>
                </div>
              </div>
            </Card>
          )}
          {!showResults && (
            <Card className="p-6 shadow-lg">
              <div className="text-center text-gray-500 py-12">
                <CreditCard className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>Enter your credit card details and click Calculate to see your payoff plan</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
