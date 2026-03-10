import { useState } from "react";
import { Card } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { NumericInput } from "../components/ui/numeric-input";
import { Button } from "../components/ui/button";
import { BarChart3 } from "lucide-react";
import { useCurrency } from "../context/CurrencyContext";

export function ROICalculator() {
  const { currency, fmt } = useCurrency();
  const [amountInvested, setAmountInvested] = useState(10000);
  const [amountReturned, setAmountReturned] = useState(15000);
  const [investmentDuration, setInvestmentDuration] = useState(3);
  const [showResults, setShowResults] = useState(false);

  const calculateROI = () => {
    const totalReturn = amountReturned - amountInvested;
    const roiPercentage = (totalReturn / amountInvested) * 100;
    const annualizedROI = (Math.pow(amountReturned / amountInvested, 1 / investmentDuration) - 1) * 100;
    return { totalReturn, roiPercentage, annualizedROI, amountInvested, amountReturned, investmentDuration };
  };

  const results = showResults ? calculateROI() : null;

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-3 rounded-lg">
            <BarChart3 className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-4xl text-gray-900">ROI Calculator</h1>
            <p className="text-gray-600 mt-1">Calculate return on investment and annualized returns</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <Card className="p-6 shadow-lg">
            <h2 className="text-2xl mb-6 text-gray-900">Investment Details</h2>
            <div className="space-y-6">
              <div>
                <Label htmlFor="amountInvested" className="text-base">Amount Invested</Label>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-gray-500 font-semibold">{currency.symbol}</span>
                  <NumericInput id="amountInvested" value={amountInvested} onChange={setAmountInvested} />
                </div>
                <input type="range" min="100" max="100000000" step="10000" value={amountInvested}
                  onChange={(e) => setAmountInvested(Number(e.target.value))} className="w-full mt-2" />
                <p className="text-xs text-gray-400 mt-1">Range: {fmt(100)} – {fmt(100000000)}</p>
              </div>
              <div>
                <Label htmlFor="amountReturned" className="text-base">Amount Returned / Current Value</Label>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-gray-500 font-semibold">{currency.symbol}</span>
                  <NumericInput id="amountReturned" value={amountReturned} onChange={setAmountReturned} />
                </div>
                <input type="range" min="100" max="200000000" step="10000" value={amountReturned}
                  onChange={(e) => setAmountReturned(Number(e.target.value))} className="w-full mt-2" />
              </div>
              <div>
                <Label htmlFor="investmentDuration" className="text-base">Investment Duration (for Annualized ROI)</Label>
                <div className="flex items-center gap-2 mt-2">
                  <NumericInput id="investmentDuration" step="0.5" value={investmentDuration} onChange={setInvestmentDuration} />
                  <span className="text-gray-500">years</span>
                </div>
                <input type="range" min="0.5" max="20" step="0.5" value={investmentDuration}
                  onChange={(e) => setInvestmentDuration(Number(e.target.value))} className="w-full mt-2" />
              </div>
              <Button onClick={() => setShowResults(true)} className="w-full" size="lg">Calculate ROI</Button>
            </div>
          </Card>

          <Card className="p-6 shadow-lg mt-6">
            <h3 className="text-lg mb-4 text-gray-900">Common Use Cases</h3>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-blue-700 mb-1">📈 Stock / Mutual Fund Investment</div>
                <p className="text-xs text-blue-600">Track gains from stocks, mutual funds, or ETFs</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="text-green-700 mb-1">🏠 Real Estate</div>
                <p className="text-xs text-green-600">Calculate property investment returns</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                <div className="text-purple-700 mb-1">💼 Business Investment</div>
                <p className="text-xs text-purple-600">Evaluate startup or business venture returns</p>
              </div>
            </div>
          </Card>
        </div>

        <div>
          {showResults && results && (
            <Card className="p-6 shadow-lg">
              <h2 className="text-2xl mb-6 text-gray-900">Investment Returns</h2>
              <div className="space-y-4">
                <div className={`p-6 rounded-lg border ${results.totalReturn >= 0 ? "bg-gradient-to-br from-green-50 to-green-100 border-green-200" : "bg-gradient-to-br from-red-50 to-red-100 border-red-200"}`}>
                  <div className={`text-sm mb-1 ${results.totalReturn >= 0 ? "text-green-600" : "text-red-600"}`}>Absolute ROI</div>
                  <div className={`text-3xl ${results.totalReturn >= 0 ? "text-green-700" : "text-red-700"}`}>
                    {results.roiPercentage >= 0 ? "+" : ""}{results.roiPercentage.toFixed(2)}%
                  </div>
                </div>
                {investmentDuration > 0 && (
                  <div className={`p-6 rounded-lg border ${results.annualizedROI >= 0 ? "bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200" : "bg-gradient-to-br from-red-50 to-red-100 border-red-200"}`}>
                    <div className={`text-sm mb-1 ${results.annualizedROI >= 0 ? "text-indigo-600" : "text-red-600"}`}>Annualized ROI</div>
                    <div className={`text-3xl ${results.annualizedROI >= 0 ? "text-indigo-700" : "text-red-700"}`}>
                      {results.annualizedROI >= 0 ? "+" : ""}{results.annualizedROI.toFixed(2)}% per year
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="text-xs text-blue-600 mb-1">Invested</div>
                    <div className="text-xl text-blue-700">{fmt(results.amountInvested)}</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <div className="text-xs text-purple-600 mb-1">Returned</div>
                    <div className="text-xl text-purple-700">{fmt(results.amountReturned)}</div>
                  </div>
                </div>
                <div className={`p-4 rounded-lg border ${results.totalReturn >= 0 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                  <div className={`text-sm mb-1 ${results.totalReturn >= 0 ? "text-green-600" : "text-red-600"}`}>
                    Total {results.totalReturn >= 0 ? "Gain" : "Loss"}
                  </div>
                  <div className={`text-2xl ${results.totalReturn >= 0 ? "text-green-700" : "text-red-700"}`}>
                    {results.totalReturn >= 0 ? "+" : ""}{fmt(Math.abs(results.totalReturn))}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <h3 className="text-sm mb-3 text-gray-700">Performance Indicator</h3>
                  {results.roiPercentage >= 15 && <div className="flex items-center gap-2 text-green-700"><span className="text-xl">🎉</span><span className="text-sm">Excellent Return!</span></div>}
                  {results.roiPercentage >= 8 && results.roiPercentage < 15 && <div className="flex items-center gap-2 text-blue-700"><span className="text-xl">✅</span><span className="text-sm">Good Return</span></div>}
                  {results.roiPercentage >= 0 && results.roiPercentage < 8 && <div className="flex items-center gap-2 text-yellow-700"><span className="text-xl">⚠️</span><span className="text-sm">Modest Return</span></div>}
                  {results.roiPercentage < 0 && <div className="flex items-center gap-2 text-red-700"><span className="text-xl">📉</span><span className="text-sm">Loss - Consider reviewing your strategy</span></div>}
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="text-sm mb-2 text-blue-700">💡 Understanding ROI</h3>
                  <p className="text-xs text-blue-700">
                    <strong>Absolute ROI</strong> shows total return percentage over the entire period.<br />
                    <strong>Annualized ROI</strong> shows the average yearly return, making it easier to compare investments of different durations.
                  </p>
                </div>
              </div>
            </Card>
          )}
          {!showResults && (
            <Card className="p-6 shadow-lg">
              <div className="text-center text-gray-500 py-12">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>Enter your investment details and click Calculate to see your ROI</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
