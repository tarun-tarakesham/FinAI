import { createHashRouter } from "react-router";
import { Home } from "./pages/Home";
import { MortgageCalculator } from "./pages/MortgageCalculator";
import { CompoundInterestCalculator } from "./pages/CompoundInterestCalculator";
import { SIPCalculator } from "./pages/SIPCalculator";
import { AutoLoanCalculator } from "./pages/AutoLoanCalculator";
import { RetirementCalculator } from "./pages/RetirementCalculator";
import { IncomeTaxCalculator } from "./pages/IncomeTaxCalculator";
import { CreditCardCalculator } from "./pages/CreditCardCalculator";
import { ROICalculator } from "./pages/ROICalculator";
import { Layout } from "./components/Layout";

export const router = createHashRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "mortgage", Component: MortgageCalculator },
      { path: "compound-interest", Component: CompoundInterestCalculator },
      { path: "sip", Component: SIPCalculator },
      { path: "auto-loan", Component: AutoLoanCalculator },
      { path: "retirement", Component: RetirementCalculator },
      { path: "income-tax", Component: IncomeTaxCalculator },
      { path: "credit-card", Component: CreditCardCalculator },
      { path: "roi", Component: ROICalculator },
    ],
  },
]);
