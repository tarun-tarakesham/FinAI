import { useState } from "react";
import { Card } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { NumericInput } from "../components/ui/numeric-input";
import { Button } from "../components/ui/button";
import { PiggyBank } from "lucide-react";
import { useCurrency } from "../context/CurrencyContext";

export function SIPCalculator() {
  const { currency, fmt } = useCurrency();
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [timePeriod, setTimePeriod] = useState(10);
  const [showResults, setShowResults] = useState(false);

  const calculateSIP = () => {
    const monthlyRate = expectedReturn / 12 / 100;
    const months = timePeriod * 12;
    const futureValue =
      monthlyInvestment *
      (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
    const totalInvestment = monthlyInvestment * months;
    const wealthGained = futureValue - totalInvestment;
    return { futureValue, totalInvestment, wealthGained };
  };

  const results = showResults ? calculateSIP() : null;

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-lg">
            <PiggyBank className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-4xl text-gray-900">SIP Calculator</h1>
            <p className="text-gray-600 mt-1">Plan your systematic investment and project your wealth creation</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <Card className="p-6 shadow-lg">
            <h2 className="text-2xl mb-6 text-gray-900">Investment Details</h2>
            <div className="space-y-6">
              <div>
                <Label htmlFor="monthlyInvestment" className="text-base">Monthly Investment Amount</Label>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-gray-500 font-semibold">{currency.symbol}</span>
                  <NumericInput id="monthlyInvestment" value={monthlyInvestment} onChange={setMonthlyInvestment} />
                </div>
                <input type="range" min="500" max="500000" step="500" value={monthlyInvestment}
                  onChange={(e) => setMonthlyInvestment(Number(e.target.value))} className="w-full mt-2" />
                <p className="text-xs text-gray-400 mt-1">Range: {fmt(500)} – {fmt(500000)}</p>
              </div>
              <div>
                <Label htmlFor="expectedReturn" className="text-base">Expected Annual Return Rate</Label>
                <div className="flex items-center gap-2 mt-2">
                  <NumericInput id="expectedReturn" step="0.5" value={expectedReturn} onChange={setExpectedReturn} />
                  <span className="text-gray-500">%</span>
                </div>
                <input type="range" min="1" max="30" step="0.5" value={expectedReturn}
                  onChange={(e) => setExpectedReturn(Number(e.target.value))} className="w-full mt-2" />
              </div>
              <div>
                <Label htmlFor="timePeriod" className="text-base">Investment Period</Label>
                <div className="flex items-center gap-2 mt-2">
                  <NumericInput id="timePeriod" value={timePeriod} onChange={setTimePeriod} />
                  <span className="text-gray-500">years</span>
                </div>
                <input type="range" min="1" max="40" value={timePeriod}
                  onChange={(e) => setTimePeriod(Number(e.target.value))} className="w-full mt-2" />
              </div>
              <Button onClick={() => setShowResults(true)} className="w-full" size="lg">Calculate Returns</Button>
            </div>
          </Card>
        </div>

        <div>
          {showResults && results && (
            <Card className="p-6 shadow-lg">
              <h2 className="text-2xl mb-6 text-gray-900">Investment Summary</h2>
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
                  <div className="text-sm text-purple-600 mb-1">Total Maturity Value</div>
                  <div className="text-3xl text-purple-700">{fmt(results.futureValue)}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="text-xs text-blue-600 mb-1">Total Invested</div>
                    <div className="text-xl text-blue-700">{fmt(results.totalInvestment)}</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="text-xs text-green-600 mb-1">Wealth Gained</div>
                    <div className="text-xl text-green-700">{fmt(results.wealthGained)}</div>
                  </div>
                </div>
                <div className="pt-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Investment vs Returns</span>
                  </div>
                  <div className="h-8 bg-gray-200 rounded-lg overflow-hidden flex">
                    <div style={{ width: `${(results.totalInvestment / results.futureValue) * 100}%` }}
                      className="bg-blue-500 flex items-center justify-center text-white text-xs">
                      {((results.totalInvestment / results.futureValue) * 100).toFixed(0)}%
                    </div>
                    <div style={{ width: `${(results.wealthGained / results.futureValue) * 100}%` }}
                      className="bg-green-500 flex items-center justify-center text-white text-xs">
                      {((results.wealthGained / results.futureValue) * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg mt-4 border">
                  <h3 className="text-sm mb-3 text-gray-700">Investment Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monthly Investment:</span>
                      <span>{fmt(monthlyInvestment)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Investment Period:</span>
                      <span>{timePeriod} years ({timePeriod * 12} months)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expected Returns:</span>
                      <span>{expectedReturn}% per annum</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-gray-600">Total Amount Invested:</span>
                      <span className="font-semibold">{fmt(results.totalInvestment)}</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>Estimated Gains:</span>
                      <span className="font-semibold">{fmt(results.wealthGained)}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <p className="text-xs text-amber-700">
                    <strong>Note:</strong> Returns are estimates based on assumed rate. Actual returns may vary based on market conditions.
                  </p>
                </div>
              </div>
            </Card>
          )}
          {!showResults && (
            <Card className="p-6 shadow-lg">
              <div className="text-center text-gray-500 py-12">
                <PiggyBank className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>Enter your SIP details and click Calculate to see your projected returns</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
