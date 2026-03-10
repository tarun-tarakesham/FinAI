import { useState } from "react";
import { Card } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { NumericInput } from "../components/ui/numeric-input";
import { Button } from "../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { TrendingUp } from "lucide-react";
import { useCurrency } from "../context/CurrencyContext";

export function CompoundInterestCalculator() {
  const { currency, fmt } = useCurrency();
  const [principal, setPrincipal] = useState(10000);
  const [monthlyAddition, setMonthlyAddition] = useState(500);
  const [interestRate, setInterestRate] = useState(8);
  const [years, setYears] = useState(10);
  const [compoundingFrequency, setCompoundingFrequency] = useState("12");
  const [showResults, setShowResults] = useState(false);

  const calculateCompoundInterest = () => {
    const r = interestRate / 100;
    const n = Number(compoundingFrequency);
    const t = years;
    const P = principal;
    const PMT = monthlyAddition;
    const FV_principal = P * Math.pow(1 + r / n, n * t);
    let FV_contributions = 0;
    if (PMT > 0) {
      const totalMonths = t * 12;
      for (let month = 1; month <= totalMonths; month++) {
        const timeRemaining = (totalMonths - month) / 12;
        FV_contributions += PMT * Math.pow(1 + r / n, n * timeRemaining);
      }
    }
    const totalValue = FV_principal + FV_contributions;
    const totalContributions = P + PMT * 12 * t;
    const totalInterest = totalValue - totalContributions;
    return { totalValue, totalContributions, totalInterest };
  };

  const results = showResults ? calculateCompoundInterest() : null;

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-lg">
            <TrendingUp className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-4xl text-gray-900">Compound Interest Calculator</h1>
            <p className="text-gray-600 mt-1">See how your investments grow over time with compound interest</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <Card className="p-6 shadow-lg">
            <h2 className="text-2xl mb-6 text-gray-900">Investment Details</h2>
            <div className="space-y-6">
              <div>
                <Label htmlFor="principal" className="text-base">Initial Principal Amount</Label>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-gray-500 font-semibold">{currency.symbol}</span>
                  <NumericInput id="principal" value={principal} onChange={setPrincipal} />
                </div>
                <input type="range" min="1000" max="10000000" step="1000" value={principal}
                  onChange={(e) => setPrincipal(Number(e.target.value))} className="w-full mt-2" />
                <p className="text-xs text-gray-400 mt-1">Range: {fmt(1000)} – {fmt(10000000)}</p>
              </div>
              <div>
                <Label htmlFor="monthlyAddition" className="text-base">Monthly Contribution</Label>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-gray-500 font-semibold">{currency.symbol}</span>
                  <NumericInput id="monthlyAddition" value={monthlyAddition} onChange={setMonthlyAddition} />
                </div>
                <input type="range" min="0" max="100000" step="1000" value={monthlyAddition}
                  onChange={(e) => setMonthlyAddition(Number(e.target.value))} className="w-full mt-2" />
              </div>
              <div>
                <Label htmlFor="interestRate" className="text-base">Annual Interest Rate</Label>
                <div className="flex items-center gap-2 mt-2">
                  <NumericInput id="interestRate" step="0.1" value={interestRate} onChange={setInterestRate} />
                  <span className="text-gray-500">%</span>
                </div>
                <input type="range" min="1" max="20" step="0.5" value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))} className="w-full mt-2" />
              </div>
              <div>
                <Label htmlFor="years" className="text-base">Time Period</Label>
                <div className="flex items-center gap-2 mt-2">
                  <NumericInput id="years" value={years} onChange={setYears} />
                  <span className="text-gray-500">years</span>
                </div>
                <input type="range" min="1" max="40" value={years}
                  onChange={(e) => setYears(Number(e.target.value))} className="w-full mt-2" />
              </div>
              <div>
                <Label htmlFor="compounding" className="text-base">Compounding Frequency</Label>
                <Select value={compoundingFrequency} onValueChange={setCompoundingFrequency}>
                  <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="365">Daily</SelectItem>
                    <SelectItem value="12">Monthly</SelectItem>
                    <SelectItem value="4">Quarterly</SelectItem>
                    <SelectItem value="1">Annually</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={() => setShowResults(true)} className="w-full" size="lg">Calculate Growth</Button>
            </div>
          </Card>
        </div>

        <div>
          {showResults && results && (
            <Card className="p-6 shadow-lg">
              <h2 className="text-2xl mb-6 text-gray-900">Results</h2>
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
                  <div className="text-sm text-green-600 mb-1">Future Value</div>
                  <div className="text-3xl text-green-700">{fmt(results.totalValue)}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="text-xs text-blue-600 mb-1">Total Invested</div>
                    <div className="text-xl text-blue-700">{fmt(results.totalContributions)}</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <div className="text-xs text-purple-600 mb-1">Interest Earned</div>
                    <div className="text-xl text-purple-700">{fmt(results.totalInterest)}</div>
                  </div>
                </div>
                <div className="pt-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Contributions vs Interest</span>
                  </div>
                  <div className="h-8 bg-gray-200 rounded-lg overflow-hidden flex">
                    <div style={{ width: `${(results.totalContributions / results.totalValue) * 100}%` }}
                      className="bg-blue-500 flex items-center justify-center text-white text-xs">
                      {((results.totalContributions / results.totalValue) * 100).toFixed(0)}%
                    </div>
                    <div style={{ width: `${(results.totalInterest / results.totalValue) * 100}%` }}
                      className="bg-purple-500 flex items-center justify-center text-white text-xs">
                      {((results.totalInterest / results.totalValue) * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg mt-4 border">
                  <h3 className="text-sm mb-3 text-gray-700">Breakdown</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Initial Principal:</span>
                      <span>{fmt(principal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monthly Contributions:</span>
                      <span>{fmt(monthlyAddition * 12 * years)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-gray-600">Total Invested:</span>
                      <span className="font-semibold">{fmt(results.totalContributions)}</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>Interest Earned:</span>
                      <span className="font-semibold">{fmt(results.totalInterest)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}
          {!showResults && (
            <Card className="p-6 shadow-lg">
              <div className="text-center text-gray-500 py-12">
                <TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>Enter your investment details and click Calculate to see your growth</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
