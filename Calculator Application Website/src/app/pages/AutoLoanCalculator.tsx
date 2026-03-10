import { useState } from "react";
import { Card } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { NumericInput } from "../components/ui/numeric-input";
import { Button } from "../components/ui/button";
import { Car } from "lucide-react";
import { useCurrency } from "../context/CurrencyContext";

export function AutoLoanCalculator() {
  const { currency, fmt } = useCurrency();
  const [vehiclePrice, setVehiclePrice] = useState(30000);
  const [downPayment, setDownPayment] = useState(5000);
  const [tradeInValue, setTradeInValue] = useState(0);
  const [interestRate, setInterestRate] = useState(5.5);
  const [loanTerm, setLoanTerm] = useState(60);
  const [showResults, setShowResults] = useState(false);

  const calculateAutoLoan = () => {
    const loanAmount = vehiclePrice - downPayment - tradeInValue;
    const monthlyRate = interestRate / 12 / 100;
    const numberOfPayments = loanTerm;
    const monthlyPayment =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    const totalLoanAmount = monthlyPayment * numberOfPayments;
    const totalInterest = totalLoanAmount - loanAmount;
    return { monthlyPayment, loanAmount, totalLoanAmount, totalInterest, downPayment, tradeInValue };
  };

  const results = showResults ? calculateAutoLoan() : null;

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-lg">
            <Car className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-4xl text-gray-900">Auto Loan Calculator</h1>
            <p className="text-gray-600 mt-1">Calculate your car payment before visiting the dealership</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <Card className="p-6 shadow-lg">
            <h2 className="text-2xl mb-6 text-gray-900">Loan Details</h2>
            <div className="space-y-6">
              <div>
                <Label htmlFor="vehiclePrice" className="text-base">Vehicle Price</Label>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-gray-500 font-semibold">{currency.symbol}</span>
                  <NumericInput id="vehiclePrice" value={vehiclePrice} onChange={setVehiclePrice} />
                </div>
                <input type="range" min="50000" max="10000000" step="10000" value={vehiclePrice}
                  onChange={(e) => setVehiclePrice(Number(e.target.value))} className="w-full mt-2" />
                <p className="text-xs text-gray-400 mt-1">Range: {fmt(50000)} – {fmt(10000000)}</p>
              </div>
              <div>
                <Label htmlFor="downPayment" className="text-base">Down Payment</Label>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-gray-500 font-semibold">{currency.symbol}</span>
                  <NumericInput id="downPayment" value={downPayment} onChange={setDownPayment} />
                </div>
                <input type="range" min="0" max={vehiclePrice * 0.5} step="5000" value={downPayment}
                  onChange={(e) => setDownPayment(Number(e.target.value))} className="w-full mt-2" />
              </div>
              <div>
                <Label htmlFor="tradeInValue" className="text-base">Trade-In Value (Optional)</Label>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-gray-500 font-semibold">{currency.symbol}</span>
                  <NumericInput id="tradeInValue" value={tradeInValue} onChange={setTradeInValue} />
                </div>
                <input type="range" min="0" max="500000" step="5000" value={tradeInValue}
                  onChange={(e) => setTradeInValue(Number(e.target.value))} className="w-full mt-2" />
              </div>
              <div>
                <Label htmlFor="interestRate" className="text-base">Interest Rate (APR)</Label>
                <div className="flex items-center gap-2 mt-2">
                  <NumericInput id="interestRate" step="0.1" value={interestRate} onChange={setInterestRate} />
                  <span className="text-gray-500">%</span>
                </div>
                <input type="range" min="0" max="15" step="0.1" value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))} className="w-full mt-2" />
              </div>
              <div>
                <Label htmlFor="loanTerm" className="text-base">Loan Term</Label>
                <div className="flex items-center gap-2 mt-2">
                  <NumericInput id="loanTerm" value={loanTerm} onChange={setLoanTerm} />
                  <span className="text-gray-500">months</span>
                </div>
                <input type="range" min="12" max="84" step="12" value={loanTerm}
                  onChange={(e) => setLoanTerm(Number(e.target.value))} className="w-full mt-2" />
              </div>
              <Button onClick={() => setShowResults(true)} className="w-full" size="lg">Calculate Payment</Button>
            </div>
          </Card>
        </div>

        <div>
          {showResults && results && (
            <Card className="p-6 shadow-lg">
              <h2 className="text-2xl mb-6 text-gray-900">Payment Summary</h2>
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-lg border border-orange-200">
                  <div className="text-sm text-orange-600 mb-1">Monthly Payment</div>
                  <div className="text-3xl text-orange-700">{fmt(results.monthlyPayment, 2)}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <div className="text-xs text-gray-600 mb-1">Loan Amount</div>
                    <div className="text-xl text-gray-900">{fmt(results.loanAmount)}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <div className="text-xs text-gray-600 mb-1">Total Interest</div>
                    <div className="text-xl text-red-600">{fmt(results.totalInterest)}</div>
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="text-sm text-blue-600 mb-1">Total Amount Payable</div>
                  <div className="text-2xl text-blue-700">{fmt(results.totalLoanAmount)}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg mt-4 border">
                  <h3 className="text-sm mb-3 text-gray-700">Breakdown</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Vehicle Price:</span>
                      <span>{fmt(vehiclePrice)}</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>Down Payment:</span>
                      <span>-{fmt(downPayment)}</span>
                    </div>
                    {tradeInValue > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Trade-In Value:</span>
                        <span>-{fmt(tradeInValue)}</span>
                      </div>
                    )}
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-gray-600">Amount to Finance:</span>
                      <span className="font-semibold">{fmt(results.loanAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Interest Rate:</span>
                      <span>{interestRate}% APR</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Loan Term:</span>
                      <span>{loanTerm} months ({(loanTerm / 12).toFixed(1)} years)</span>
                    </div>
                  </div>
                </div>
                <div className="pt-4">
                  <div className="h-8 bg-gray-200 rounded-lg overflow-hidden flex">
                    <div style={{ width: `${(results.loanAmount / results.totalLoanAmount) * 100}%` }}
                      className="bg-orange-500 flex items-center justify-center text-white text-xs">
                      {((results.loanAmount / results.totalLoanAmount) * 100).toFixed(0)}%
                    </div>
                    <div style={{ width: `${(results.totalInterest / results.totalLoanAmount) * 100}%` }}
                      className="bg-red-500 flex items-center justify-center text-white text-xs">
                      {((results.totalInterest / results.totalLoanAmount) * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}
          {!showResults && (
            <Card className="p-6 shadow-lg">
              <div className="text-center text-gray-500 py-12">
                <Car className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>Enter your vehicle details and click Calculate to see your payment</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
