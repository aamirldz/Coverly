import React from "react";
import { INDIAN_STATES } from "@/lib/utils";

interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  error?: string;
  touched?: boolean;
  isSelect?: boolean;
}

export default function FloatingInput({
  label,
  name,
  error,
  touched,
  isSelect = false,
  className = "",
  ...props
}: FloatingInputProps) {
  const hasError = error && touched;
  const isValid = !error && touched && props.value && String(props.value).length > 0;

  const baseClasses = `block px-4 pb-2.5 pt-6 w-full text-sm text-text-primary bg-white rounded-button border appearance-none focus:outline-none focus:ring-0 peer transition-colors ${
    hasError ? "border-red-500 focus:border-red-500" : isValid ? "border-green-500 focus:border-green-500" : "border-gray-200 focus:border-accent"
  } ${className}`;

  return (
    <div className="relative group">
      {isSelect ? (
        <div className="relative">
          <select
            name={name}
            className={baseClasses}
            // @ts-ignore - select props are slightly different
            value={props.value}
            // @ts-ignore
            onChange={props.onChange}
            // @ts-ignore
            onBlur={props.onBlur}
          >
            <option value="">Select...</option>
            {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      ) : (
        <input
          name={name}
          className={baseClasses}
          placeholder=" "
          {...props}
        />
      )}
      
      <label className={`absolute text-sm duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 ${
        hasError ? "text-red-500" : isValid ? "text-green-600" : "text-text-muted peer-focus:text-accent"
      }`}>
        {label}
      </label>
      
      {/* Status Icons */}
      <div className="absolute top-4 right-4 pointer-events-none">
        {hasError && <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        {isValid && <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
      </div>
      
      {hasError && <p className="mt-1 text-xs text-red-500 font-medium px-1">{error}</p>}
    </div>
  );
}
