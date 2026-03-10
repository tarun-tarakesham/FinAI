import { useState } from "react";
import { Card } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { NumericInput } from "../components/ui/numeric-input";
import { Button } from "../components/ui/button";
import { Umbrella } from "lucide-react";
import { useCurrency } from "../context/CurrencyContext";

export function RetirementCalculator() {
  const { currency, fmt } = useCurrency();
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(65);
  const [currentSavings, setCurrentSavings] = useState(50000);
  const [monthlyContribution, setMonthlyContribution] = useState(1000);
  const [expectedReturn, setExpectedReturn] = useState(8);
  const [inflationRate, setInflationRate] = useState(3);
  const [showResults, setShowResults] = useState(false);

  const calculateRetirement = () => {
    const yearsToRetirement = retirementAge - currentAge;
    const monthlyRate = expectedReturn / 12 / 100;
    const months = yearsToRetirement * 12;
    const FV_savings = currentSavings * Math.pow(1 + monthlyRate, months);
    const FV_contributions =
      monthlyContribution *
      (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
    const totalCorpus = FV_savings + FV_contributions;
    const totalContributed = currentSavings + monthlyContribution * months;
    const realReturnRate = ((1 + expectedReturn / 100) / (1 + inflationRate / 100) - 1) * 100;
    const monthlyIncomeInRetirement = (totalCorpus * (realReturnRate / 100)) / 12;
    return { totalCorpus, totalContributed, monthlyIncomeInRetirement, yearsToRetirement, totalReturns: totalCorpus - totalContributed };
  };

  const results = showResults ? calculateRetirement() : null;

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-gradient-to-br from-pink-500 to-pink-600 p-3 rounded-lg">
            <Umbrella className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-4xl text-gray-900">Retirement Savings Calculator</h1>
            <p className="text-gray-600 mt-1">Plan for a comfortable retirement and see if you're on track</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <Card className="p-6 shadow-lg">
            <h2 className="text-2xl mb-6 text-gray-900">Your Details</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="currentAge" className="text-base">Current Age</Label>
                  <NumericInput id="currentAge" value={currentAge} onChange={setCurrentAge} className="text-lg mt-2" />
                </div>
                <div>
                  <Label htmlFor="retirementAge" className="text-base">Retirement Age</Label>
                  <NumericInput id="retirementAge" value={retirementAge} onChange={setRetirementAge} className="text-lg mt-2" />
                </div>
              </div>
              <div>
                <Label htmlFor="currentSavings" className="text-base">Current Retirement Savings</Label>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-gray-500 font-semibold">{currency.symbol}</span>
                  <NumericInput id="currentSavings" value={currentSavings} onChange={setCurrentSavings} />
                </div>
                <input type="range" min="0" max="50000000" step="50000" value={currentSavings}
                  onChange={(e) => setCurrentSavings(Number(e.target.value))} className="w-full mt-2" />
                <p className="text-xs text-gray-400 mt-1">Range: {fmt(0)} – {fmt(50000000)}</p>
              </div>
              <div>
                <Label htmlFor="monthlyContribution" className="text-base">Monthly Contribution</Label>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-gray-500 font-semibold">{currency.symbol}</span>
                  <NumericInput id="monthlyContribution" value={monthlyContribution} onChange={setMonthlyContribution} />
                </div>
                <input type="range" min="0" max="500000" step="1000" value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(Number(e.target.value))} className="w-full mt-2" />
              </div>
              <div>
                <Label htmlFor="expectedReturn" className="text-base">Expected Annual Return</Label>
                <div className="flex items-center gap-2 mt-2">
                  <NumericInput id="expectedReturn" step="0.5" value={expectedReturn} onChange={setExpectedReturn} />
                  <span className="text-gray-500">%</span>
                </div>
                <input type="range" min="3" max="15" step="0.5" value={expectedReturn}
                  onChange={(e) => setExpectedReturn(Number(e.target.value))} className="w-full mt-2" />
              </div>
              <div>
                <Label htmlFor="inflationRate" className="text-base">Expected Inflation Rate</Label>
                <div className="flex items-center gap-2 mt-2">
                  <NumericInput id="inflationRate" step="0.5" value={inflationRate} onChange={setInflationRate} />
                  <span className="text-gray-500">%</span>
                </div>
                <input type="range" min="1" max="8" step="0.5" value={inflationRate}
                  onChange={(e) => setInflationRate(Number(e.target.value))} className="w-full mt-2" />
              </div>
              <Button onClick={() => setShowResults(true)} className="w-full" size="lg">Calculate Retirement</Button>
            </div>
          </Card>
        </div>

        <div>
          {showResults && results && (
            <Card className="p-6 shadow-lg">
              <h2 className="text-2xl mb-6 text-gray-900">Retirement Projection</h2>
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-lg border border-pink-200">
                  <div className="text-sm text-pink-600 mb-1">Projected Retirement Corpus</div>
                  <div className="text-3xl text-pink-700">{fmt(results.totalCorpus)}</div>
                  <div className="text-xs text-pink-600 mt-1">In {results.yearsToRetirement} years</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
                  <div className="text-sm text-green-600 mb-1">Estimated Monthly Income</div>
                  <div className="text-3xl text-green-700">{fmt(results.monthlyIncomeInRetirement)}</div>
                  <div className="text-xs text-green-600 mt-1">During retirement (inflation-adjusted)</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="text-xs text-blue-600 mb-1">Total Contributed</div>
                    <div className="text-xl text-blue-700">{fmt(results.totalContributed)}</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <div className="text-xs text-purple-600 mb-1">Investment Returns</div>
                    <div className="text-xl text-purple-700">{fmt(results.totalReturns)}</div>
                  </div>
                </div>
                <div className="pt-4">
                  <div className="h-8 bg-gray-200 rounded-lg overflow-hidden flex">
                    <div style={{ width: `${(results.totalContributed / results.totalCorpus) * 100}%` }}
                      className="bg-blue-500 flex items-center justify-center text-white text-xs">
                      {((results.totalContributed / results.totalCorpus) * 100).toFixed(0)}%
                    </div>
                    <div style={{ width: `${(results.totalReturns / results.totalCorpus) * 100}%` }}
                      className="bg-purple-500 flex items-center justify-center text-white text-xs">
                      {((results.totalReturns / results.totalCorpus) * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg mt-4 border">
                  <h3 className="text-sm mb-3 text-gray-700">Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Age:</span><span>{currentAge} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Retirement Age:</span><span>{retirementAge} years</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-gray-600">Current Savings:</span><span>{fmt(currentSavings)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monthly Contribution:</span><span>{fmt(monthlyContribution)}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <p className="text-xs text-amber-700">
                    <strong>Note:</strong> This is an estimate. Actual results may vary. Consult a financial advisor for personalized retirement planning.
                  </p>
                </div>
              </div>
            </Card>
          )}
          {!showResults && (
            <Card className="p-6 shadow-lg">
              <div className="text-center text-gray-500 py-12">
                <Umbrella className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>Enter your details and click Calculate to see your retirement projection</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
