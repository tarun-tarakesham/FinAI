import { createContext, useContext, useState, ReactNode } from "react";

export interface Currency {
  code: string;
  symbol: string;
  locale: string;
  name: string;
}

export const CURRENCIES: Currency[] = [
  { code: "INR", symbol: "₹", locale: "en-IN", name: "Indian Rupee" },
  { code: "USD", symbol: "$", locale: "en-US", name: "US Dollar" },
  { code: "EUR", symbol: "€", locale: "de-DE", name: "Euro" },
  { code: "GBP", symbol: "£", locale: "en-GB", name: "British Pound" },
  { code: "JPY", symbol: "¥", locale: "ja-JP", name: "Japanese Yen" },
  { code: "AED", symbol: "د.إ", locale: "ar-AE", name: "UAE Dirham" },
  { code: "SGD", symbol: "S$", locale: "en-SG", name: "Singapore Dollar" },
  { code: "CAD", symbol: "C$", locale: "en-CA", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", locale: "en-AU", name: "Australian Dollar" },
];

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  fmt: (value: number, decimals?: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>(CURRENCIES[0]); // INR default

  const fmt = (value: number, decimals = 0) =>
    `${currency.symbol}${value.toLocaleString(currency.locale, {
      maximumFractionDigits: decimals,
      minimumFractionDigits: decimals,
    })}`;

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, fmt }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used inside CurrencyProvider");
  return ctx;
}
