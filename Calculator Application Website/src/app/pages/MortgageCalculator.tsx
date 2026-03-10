import { useState, useMemo } from "react";
import { Card } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { NumericInput } from "../components/ui/numeric-input";
import { Button } from "../components/ui/button";
import { Home, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useCurrency } from "../context/CurrencyContext";

const ROWS_PER_PAGE = 12;

export function MortgageCalculator() {
  const { currency, fmt } = useCurrency();
  const [loanAmount, setLoanAmount] = useState(300000);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTenure, setLoanTenure] = useState(20);
  const [showResults, setShowResults] = useState(false);
  const [showAmortization, setShowAmortization] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const calculateEMI = () => {
    const principal = loanAmount;
    const ratePerMonth = interestRate / 12 / 100;
    const numberOfMonths = loanTenure * 12;
    const emi =
      (principal * ratePerMonth * Math.pow(1 + ratePerMonth, numberOfMonths)) /
      (Math.pow(1 + ratePerMonth, numberOfMonths) - 1);
    const totalAmount = emi * numberOfMonths;
    const totalInterest = totalAmount - principal;
    return { emi, totalAmount, totalInterest, principal };
  };

  const amortizationSchedule = useMemo(() => {
    if (!showAmortization) return [];
    const principal = loanAmount;
    const ratePerMonth = interestRate / 12 / 100;
    const numberOfMonths = loanTenure * 12;
    const { emi } = calculateEMI();
    let balance = principal;
    const schedule = [];
    for (let i = 1; i <= numberOfMonths; i++) {
      const interestPayment = balance * ratePerMonth;
      const principalPayment = emi - interestPayment;
      balance = balance - principalPayment;
      schedule.push({
        month: i,
        year: Math.ceil(i / 12),
        emi,
        principal: principalPayment,
        interest: interestPayment,
        balance: Math.max(0, balance),
      });
    }
    return schedule;
  }, [showAmortization, loanAmount, interestRate, loanTenure]);

  const totalPages = Math.ceil(amortizationSchedule.length / ROWS_PER_PAGE);
  const paginatedRows = amortizationSchedule.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE
  );

  // Year summary for sidebar
  const yearSummaries = useMemo(() => {
    if (!showAmortization) return [];
    const map: Record<number, { principal: number; interest: number; balance: number }> = {};
    for (const row of amortizationSchedule) {
      if (!map[row.year]) map[row.year] = { principal: 0, interest: 0, balance: 0 };
      map[row.year].principal += row.principal;
      map[row.year].interest += row.interest;
      map[row.year].balance = row.balance;
    }
    return Object.entries(map).map(([year, data]) => ({ year: Number(year), ...data }));
  }, [amortizationSchedule, showAmortization]);

  const handleCalculate = () => {
    setShowResults(true);
    setShowAmortization(false);
    setCurrentPage(1);
  };

  const handleToggleAmortization = () => {
    setShowAmortization((v) => !v);
    setCurrentPage(1);
  };

  const goToPage = (page: number) => {
    setCurrentPage(Math.min(Math.max(1, page), totalPages));
  };

  const results = showResults ? calculateEMI() : null;

  // Build page number range (show max 7 page buttons)
  const getPageNumbers = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | "...")[] = [];
    if (currentPage <= 4) {
      pages.push(1, 2, 3, 4, 5, "...", totalPages);
    } else if (currentPage >= totalPages - 3) {
      pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
    }
    return pages;
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-lg">
            <Home className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-4xl text-gray-900">Mortgage / Home Loan EMI Calculator</h1>
            <p className="text-gray-600 mt-1">Calculate your monthly home loan payments and total interest</p>
          </div>
        </div>
      </div>

      {/* Inputs + Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <Card className="p-6 shadow-lg">
            <h2 className="text-2xl mb-6 text-gray-900">Loan Details</h2>
            <div className="space-y-6">
              <div>
                <Label htmlFor="loanAmount" className="text-base">Loan Amount (Principal)</Label>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-gray-500 font-semibold">{currency.symbol}</span>
                  <NumericInput id="loanAmount" value={loanAmount} onChange={setLoanAmount} />
                </div>
                <input type="range" min="10000" max="10000000" step="10000" value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))} className="w-full mt-2" />
                <p className="text-xs text-gray-400 mt-1">Range: {fmt(10000)} – {fmt(10000000)}</p>
              </div>
              <div>
                <Label htmlFor="interestRate" className="text-base">Interest Rate (% per annum)</Label>
                <div className="flex items-center gap-2 mt-2">
                  <NumericInput id="interestRate" step="0.1" value={interestRate} onChange={setInterestRate} />
                  <span className="text-gray-500">%</span>
                </div>
                <input type="range" min="1" max="20" step="0.1" value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))} className="w-full mt-2" />
              </div>
              <div>
                <Label htmlFor="loanTenure" className="text-base">Loan Tenure (Years)</Label>
                <div className="flex items-center gap-2 mt-2">
                  <NumericInput id="loanTenure" value={loanTenure} onChange={setLoanTenure} />
                  <span className="text-gray-500">years</span>
                </div>
                <input type="range" min="1" max="30" value={loanTenure}
                  onChange={(e) => setLoanTenure(Number(e.target.value))} className="w-full mt-2" />
              </div>
              <Button onClick={handleCalculate} className="w-full" size="lg">Calculate EMI</Button>
            </div>
          </Card>
        </div>

        <div>
          {showResults && results && (
            <Card className="p-6 shadow-lg">
              <h2 className="text-2xl mb-6 text-gray-900">Results</h2>
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
                  <div className="text-sm text-blue-600 mb-1">Monthly EMI</div>
                  <div className="text-3xl text-blue-700">{fmt(results.emi, 2)}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <div className="text-xs text-gray-600 mb-1">Principal Amount</div>
                    <div className="text-xl text-gray-900">{fmt(results.principal)}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <div className="text-xs text-gray-600 mb-1">Total Interest</div>
                    <div className="text-xl text-red-600">{fmt(results.totalInterest)}</div>
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="text-sm text-green-600 mb-1">Total Payment</div>
                  <div className="text-2xl text-green-700">{fmt(results.totalAmount)}</div>
                </div>
                <div className="pt-2">
                  <p className="text-sm text-gray-600 mb-2">Principal vs Interest</p>
                  <div className="h-8 bg-gray-200 rounded-lg overflow-hidden flex">
                    <div style={{ width: `${(results.principal / results.totalAmount) * 100}%` }}
                      className="bg-blue-500 flex items-center justify-center text-white text-xs">
                      {((results.principal / results.totalAmount) * 100).toFixed(0)}%
                    </div>
                    <div style={{ width: `${(results.totalInterest / results.totalAmount) * 100}%` }}
                      className="bg-red-500 flex items-center justify-center text-white text-xs">
                      {((results.totalInterest / results.totalAmount) * 100).toFixed(0)}%
                    </div>
                  </div>
                  <div className="flex gap-4 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-blue-500 inline-block"></span>Principal</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-red-500 inline-block"></span>Interest</span>
                  </div>
                </div>
                <Button onClick={handleToggleAmortization} variant="outline" className="w-full mt-2">
                  {showAmortization ? "Hide" : "View Full"} Amortization Schedule
                  {!showAmortization && <span className="ml-2 text-xs text-gray-400">({loanTenure * 12} months)</span>}
                </Button>
              </div>
            </Card>
          )}
          {!showResults && (
            <Card className="p-6 shadow-lg">
              <div className="text-center text-gray-500 py-12">
                <Home className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>Enter your loan details and click Calculate to see your EMI</p>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Amortization Schedule */}
      {showAmortization && amortizationSchedule.length > 0 && (
        <div className="mt-10">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div>
              <h2 className="text-2xl text-gray-900">Amortization Schedule</h2>
              <p className="text-sm text-gray-500 mt-1">
                Total <span className="font-semibold text-gray-700">{amortizationSchedule.length} months</span> over{" "}
                <span className="font-semibold text-gray-700">{loanTenure} years</span>
              </p>
            </div>
            {/* Jump to year */}
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 font-medium">Jump to year:</label>
              <select
                className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-700 outline-none focus:border-blue-400"
                onChange={(e) => {
                  const year = Number(e.target.value);
                  const targetPage = Math.ceil((year * 12 - 11) / ROWS_PER_PAGE);
                  goToPage(targetPage);
                }}
                value={Math.ceil(((currentPage - 1) * ROWS_PER_PAGE + 1) / 12)}
              >
                {Array.from({ length: loanTenure }, (_, i) => i + 1).map((y) => (
                  <option key={y} value={y}>Year {y}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Year Summary Sidebar */}
            <div className="xl:col-span-1">
              <Card className="shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3">
                  <h3 className="text-white font-semibold text-sm">Yearly Summary</h3>
                </div>
                <div className="overflow-y-auto max-h-[520px]">
                  <table className="w-full text-xs">
                    <thead className="sticky top-0 bg-gray-50 border-b">
                      <tr>
                        <th className="text-left p-2 text-gray-600">Year</th>
                        <th className="text-right p-2 text-blue-600">Principal</th>
                        <th className="text-right p-2 text-red-500">Interest</th>
                        <th className="text-right p-2 text-gray-600">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {yearSummaries.map((row) => {
                        const activeYear = Math.ceil(((currentPage - 1) * ROWS_PER_PAGE + 1) / 12);
                        const isActive = row.year === activeYear;
                        return (
                          <tr
                            key={row.year}
                            onClick={() => {
                              const targetPage = Math.ceil((row.year * 12 - 11) / ROWS_PER_PAGE);
                              goToPage(targetPage);
                            }}
                            className={`border-b cursor-pointer transition-colors ${isActive ? "bg-blue-50 font-semibold" : "hover:bg-gray-50"}`}
                          >
                            <td className="p-2 text-gray-700">Yr {row.year}</td>
                            <td className="text-right p-2 text-blue-600">{fmt(row.principal)}</td>
                            <td className="text-right p-2 text-red-500">{fmt(row.interest)}</td>
                            <td className="text-right p-2 text-gray-600">{fmt(row.balance)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>

            {/* Monthly Table */}
            <div className="xl:col-span-3">
              <Card className="shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 flex items-center justify-between">
                  <h3 className="text-white font-semibold text-sm">
                    Month-by-Month Breakdown
                  </h3>
                  <span className="text-blue-100 text-xs">
                    Showing months {(currentPage - 1) * ROWS_PER_PAGE + 1}–{Math.min(currentPage * ROWS_PER_PAGE, amortizationSchedule.length)} of {amortizationSchedule.length}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="text-left p-3 text-gray-600">Month</th>
                        <th className="text-left p-3 text-gray-600">Year</th>
                        <th className="text-right p-3 text-gray-600">EMI</th>
                        <th className="text-right p-3 text-blue-600">Principal</th>
                        <th className="text-right p-3 text-red-500">Interest</th>
                        <th className="text-right p-3 text-gray-600">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedRows.map((row) => (
                        <tr key={row.month} className="border-b hover:bg-blue-50/30 transition-colors">
                          <td className="p-3 font-medium text-gray-700">{row.month}</td>
                          <td className="p-3 text-gray-500">Yr {row.year}</td>
                          <td className="text-right p-3 text-gray-700">{fmt(row.emi, 2)}</td>
                          <td className="text-right p-3 text-blue-600 font-medium">{fmt(row.principal, 2)}</td>
                          <td className="text-right p-3 text-red-500">{fmt(row.interest, 2)}</td>
                          <td className="text-right p-3 text-gray-700">{fmt(row.balance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                <div className="px-4 py-4 border-t bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-3">
                  {/* Info */}
                  <p className="text-sm text-gray-500">
                    Page <span className="font-semibold text-gray-700">{currentPage}</span> of{" "}
                    <span className="font-semibold text-gray-700">{totalPages}</span>
                  </p>

                  {/* Page Buttons */}
                  <div className="flex items-center gap-1">
                    {/* First */}
                    <button
                      onClick={() => goToPage(1)}
                      disabled={currentPage === 1}
                      className="p-1.5 rounded-lg border text-gray-500 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="First page"
                    >
                      <ChevronsLeft className="w-4 h-4" />
                    </button>
                    {/* Prev */}
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-1.5 rounded-lg border text-gray-500 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Previous page"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {/* Page Numbers */}
                    {getPageNumbers().map((page, idx) =>
                      page === "..." ? (
                        <span key={`ellipsis-${idx}`} className="px-2 text-gray-400 text-sm">…</span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => goToPage(page as number)}
                          className={`min-w-[36px] h-9 rounded-lg border text-sm font-medium transition-all ${
                            currentPage === page
                              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent shadow-md"
                              : "bg-white text-gray-700 hover:bg-blue-50 hover:border-blue-300"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}

                    {/* Next */}
                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-1.5 rounded-lg border text-gray-500 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Next page"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    {/* Last */}
                    <button
                      onClick={() => goToPage(totalPages)}
                      disabled={currentPage === totalPages}
                      className="p-1.5 rounded-lg border text-gray-500 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Last page"
                    >
                      <ChevronsRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Go to page input */}
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>Go to:</span>
                    <input
                      type="number"
                      min={1}
                      max={totalPages}
                      defaultValue={currentPage}
                      key={currentPage}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") goToPage(Number((e.target as HTMLInputElement).value));
                      }}
                      className="w-16 border border-gray-300 rounded-lg px-2 py-1 text-center text-gray-700 outline-none focus:border-blue-400"
                    />
                    <span className="text-gray-400">/ {totalPages}</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
