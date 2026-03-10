import { useEffect, useRef, useState } from "react";
import { Input } from "./input";
import { cn } from "./utils";

interface NumericInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "type"> {
  value: number;
  onChange: (value: number) => void;
}

/**
 * A controlled numeric input that:
 * - Shows an empty field (not "0") when the value is 0
 * - Never shows a leading zero when typing (e.g. typing "5" in an empty field gives "5" not "05")
 */
export function NumericInput({ value, onChange, className, ...props }: NumericInputProps) {
  const [display, setDisplay] = useState<string>(value === 0 ? "" : String(value));
  const isEditing = useRef(false);

  // Sync display when parent changes value externally (e.g. slider)
  useEffect(() => {
    if (!isEditing.current) {
      setDisplay(value === 0 ? "" : String(value));
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setDisplay(raw);
    const num = raw === "" ? 0 : parseFloat(raw);
    if (!isNaN(num)) onChange(num);
  };

  const handleFocus = () => { isEditing.current = true; };

  const handleBlur = () => {
    isEditing.current = false;
    // Normalize display on blur (e.g. "007" → "7", "" stays "")
    setDisplay(value === 0 ? "" : String(value));
  };

  return (
    <Input
      type="number"
      value={display}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={cn("text-lg", className)}
      {...props}
    />
  );
}
