import { useState } from "react";
import { Card } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { NumericInput } from "../components/ui/numeric-input";
import { Button } from "../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Receipt } from "lucide-react";
import { useCurrency } from "../context/CurrencyContext";

export function IncomeTaxCalculator() {
  const { currency, fmt } = useCurrency();
  const [grossSalary, setGrossSalary] = useState(100000);
  const [taxRegime, setTaxRegime] = useState("new");
  const [standardDeduction, setStandardDeduction] = useState(14600);
  const [otherDeductions, setOtherDeductions] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const calculateTax = () => {
    const taxableIncome = grossSalary - standardDeduction - otherDeductions;
    let federalTax = 0;
    if (taxRegime === "new") {
      if (taxableIncome <= 11600) federalTax = taxableIncome * 0.1;
      else if (taxableIncome <= 47150) federalTax = 1160 + (taxableIncome - 11600) * 0.12;
      else if (taxableIncome <= 100525) federalTax = 5426 + (taxableIncome - 47150) * 0.22;
      else if (taxableIncome <= 191950) federalTax = 17168.5 + (taxableIncome - 100525) * 0.24;
      else if (taxableIncome <= 243725) federalTax = 39110.5 + (taxableIncome - 191950) * 0.32;
      else if (taxableIncome <= 609350) federalTax = 55678.5 + (taxableIncome - 243725) * 0.35;
      else federalTax = 183647.25 + (taxableIncome - 609350) * 0.37;
    } else {
      if (taxableIncome <= 10275) federalTax = taxableIncome * 0.1;
      else if (taxableIncome <= 41775) federalTax = 1027.5 + (taxableIncome - 10275) * 0.12;
      else if (taxableIncome <= 89075) federalTax = 4807.5 + (taxableIncome - 41775) * 0.22;
      else if (taxableIncome <= 170050) federalTax = 15213.5 + (taxableIncome - 89075) * 0.24;
      else federalTax = 34647.5 + (taxableIncome - 170050) * 0.32;
    }
    const socialSecurity = Math.min(grossSalary * 0.062, 168600 * 0.062);
    const medicare = grossSalary * 0.0145;
    const additionalMedicare = grossSalary > 200000 ? (grossSalary - 200000) * 0.009 : 0;
    const totalTax = federalTax + socialSecurity + medicare + additionalMedicare;
    const netSalary = grossSalary - totalTax;
    return {
      grossSalary, taxableIncome, federalTax, socialSecurity,
      medicare: medicare + additionalMedicare, totalTax, netSalary,
      monthlyNet: netSalary / 12, monthlyGross: grossSalary / 12,
      effectiveTaxRate: (totalTax / grossSalary) * 100,
    };
  };

  const results = showResults ? calculateTax() : null;

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-3 rounded-lg">
            <Receipt className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-4xl text-gray-900">Income Tax Calculator</h1>
            <p className="text-gray-600 mt-1">Calculate your take-home pay after taxes and deductions</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <Card className="p-6 shadow-lg">
            <h2 className="text-2xl mb-6 text-gray-900">Income Details</h2>
            <div className="space-y-6">
              <div>
                <Label htmlFor="grossSalary" className="text-base">Annual Gross Salary</Label>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-gray-500 font-semibold">{currency.symbol}</span>
                  <NumericInput id="grossSalary" value={grossSalary} onChange={setGrossSalary} />
                </div>
                <input type="range" min="20000" max="5000000" step="10000" value={grossSalary}
                  onChange={(e) => setGrossSalary(Number(e.target.value))} className="w-full mt-2" />
                <p className="text-xs text-gray-400 mt-1">Range: {fmt(20000)} – {fmt(5000000)}</p>
              </div>
              <div>
                <Label htmlFor="taxRegime" className="text-base">Tax Regime</Label>
                <Select value={taxRegime} onValueChange={setTaxRegime}>
                  <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New Regime (2026)</SelectItem>
                    <SelectItem value="old">Old Regime</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="standardDeduction" className="text-base">Standard Deduction</Label>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-gray-500 font-semibold">{currency.symbol}</span>
                  <NumericInput id="standardDeduction" value={standardDeduction} onChange={setStandardDeduction} />
                </div>
              </div>
              <div>
                <Label htmlFor="otherDeductions" className="text-base">Other Deductions (401k, IRA, etc.)</Label>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-gray-500 font-semibold">{currency.symbol}</span>
                  <NumericInput id="otherDeductions" value={otherDeductions} onChange={setOtherDeductions} />
                </div>
                <input type="range" min="0" max="1000000" step="10000" value={otherDeductions}
                  onChange={(e) => setOtherDeductions(Number(e.target.value))} className="w-full mt-2" />
              </div>
              <Button onClick={() => setShowResults(true)} className="w-full" size="lg">Calculate Tax</Button>
            </div>
          </Card>
        </div>

        <div>
          {showResults && results && (
            <Card className="p-6 shadow-lg">
              <h2 className="text-2xl mb-6 text-gray-900">Tax Summary</h2>
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
                  <div className="text-sm text-green-600 mb-1">Annual Take-Home Salary</div>
                  <div className="text-3xl text-green-700">{fmt(results.netSalary)}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="text-xs text-blue-600 mb-1">Monthly Gross</div>
                    <div className="text-xl text-blue-700">{fmt(results.monthlyGross)}</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="text-xs text-green-600 mb-1">Monthly Net</div>
                    <div className="text-xl text-green-700">{fmt(results.monthlyNet)}</div>
                  </div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <div className="text-sm text-red-600 mb-1">Total Tax Liability</div>
                  <div className="text-2xl text-red-700">{fmt(results.totalTax)}</div>
                  <div className="text-xs text-red-600 mt-1">Effective Tax Rate: {results.effectiveTaxRate.toFixed(2)}%</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg mt-4 border">
                  <h3 className="text-sm mb-3 text-gray-700">Tax Breakdown</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gross Salary:</span><span>{fmt(results.grossSalary)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Taxable Income:</span><span>{fmt(results.taxableIncome)}</span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between text-red-600">
                        <span>Federal Tax:</span><span>{fmt(results.federalTax)}</span>
                      </div>
                      <div className="flex justify-between text-red-600 mt-1">
                        <span>Social Security:</span><span>{fmt(results.socialSecurity)}</span>
                      </div>
                      <div className="flex justify-between text-red-600 mt-1">
                        <span>Medicare:</span><span>{fmt(results.medicare)}</span>
                      </div>
                    </div>
                    <div className="flex justify-between border-t pt-2 font-semibold">
                      <span className="text-gray-900">Net Take-Home:</span>
                      <span className="text-green-600">{fmt(results.netSalary)}</span>
                    </div>
                  </div>
                </div>
                <div className="pt-4">
                  <div className="h-8 bg-gray-200 rounded-lg overflow-hidden flex">
                    <div style={{ width: `${(results.netSalary / results.grossSalary) * 100}%` }}
                      className="bg-green-500 flex items-center justify-center text-white text-xs">
                      {((results.netSalary / results.grossSalary) * 100).toFixed(0)}%
                    </div>
                    <div style={{ width: `${(results.totalTax / results.grossSalary) * 100}%` }}
                      className="bg-red-500 flex items-center justify-center text-white text-xs">
                      {((results.totalTax / results.grossSalary) * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <p className="text-xs text-amber-700">
                    <strong>Note:</strong> This is a simplified calculation for estimation purposes. Consult a tax professional for accurate advice.
                  </p>
                </div>
              </div>
            </Card>
          )}
          {!showResults && (
            <Card className="p-6 shadow-lg">
              <div className="text-center text-gray-500 py-12">
                <Receipt className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>Enter your income details and click Calculate to see your take-home pay</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
