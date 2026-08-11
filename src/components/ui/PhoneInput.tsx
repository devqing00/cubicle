"use client";

import React, { useState, useEffect } from "react";

export interface CountryCode {
  code: string;       // ISO 2-letter country code
  name: string;       // Country name
  dialCode: string;   // e.g. "+234"
  flag: string;       // Emoji flag
}

export const COUNTRIES: CountryCode[] = [
  { code: "NG", name: "Nigeria", dialCode: "+234", flag: "🇳🇬" },
  { code: "US", name: "United States", dialCode: "+1", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", dialCode: "+44", flag: "🇬🇧" },
  { code: "CA", name: "Canada", dialCode: "+1", flag: "🇨🇦" },
  { code: "AU", name: "Australia", dialCode: "+61", flag: "🇦🇺" },
  { code: "ES", name: "Spain", dialCode: "+34", flag: "🇪🇸" },
  { code: "FR", name: "France", dialCode: "+33", flag: "🇫🇷" },
  { code: "DE", name: "Germany", dialCode: "+49", flag: "🇩🇪" },
  { code: "IT", name: "Italy", dialCode: "+39", flag: "🇮🇹" },
  { code: "MX", name: "Mexico", dialCode: "+52", flag: "🇲🇽" },
  { code: "BR", name: "Brazil", dialCode: "+55", flag: "🇧🇷" },
  { code: "AR", name: "Argentina", dialCode: "+54", flag: "🇦🇷" },
  { code: "CO", name: "Colombia", dialCode: "+57", flag: "🇨🇴" },
  { code: "CL", name: "Chile", dialCode: "+56", flag: "🇨🇱" },
  { code: "PE", name: "Peru", dialCode: "+51", flag: "🇵🇪" },
  { code: "PT", name: "Portugal", dialCode: "+351", flag: "🇵🇹" },
  { code: "NL", name: "Netherlands", dialCode: "+31", flag: "🇳🇱" },
  { code: "BE", name: "Belgium", dialCode: "+32", flag: "🇧🇪" },
  { code: "CH", name: "Switzerland", dialCode: "+41", flag: "🇨🇭" },
  { code: "AT", name: "Austria", dialCode: "+43", flag: "🇦🇹" },
  { code: "SE", name: "Sweden", dialCode: "+46", flag: "🇸🇪" },
  { code: "NO", name: "Norway", dialCode: "+47", flag: "🇳🇴" },
  { code: "DK", name: "Denmark", dialCode: "+45", flag: "🇩🇰" },
  { code: "IN", name: "India", dialCode: "+91", flag: "🇮🇳" },
  { code: "PK", name: "Pakistan", dialCode: "+92", flag: "🇵🇰" },
  { code: "BD", name: "Bangladesh", dialCode: "+880", flag: "🇧🇩" },
  { code: "PH", name: "Philippines", dialCode: "+63", flag: "🇵🇭" },
  { code: "ID", name: "Indonesia", dialCode: "+62", flag: "🇮🇩" },
  { code: "MY", name: "Malaysia", dialCode: "+60", flag: "🇲🇾" },
  { code: "SG", name: "Singapore", dialCode: "+65", flag: "🇸🇬" },
  { code: "JP", name: "Japan", dialCode: "+81", flag: "🇯🇵" },
  { code: "KR", name: "South Korea", dialCode: "+82", flag: "🇰🇷" },
  { code: "CN", name: "China", dialCode: "+86", flag: "🇨🇳" },
  { code: "AE", name: "UAE", dialCode: "+971", flag: "🇦🇪" },
  { code: "SA", name: "Saudi Arabia", dialCode: "+966", flag: "🇸🇦" },
  { code: "EG", name: "Egypt", dialCode: "+20", flag: "🇪🇬" },
  { code: "ZA", name: "South Africa", dialCode: "+27", flag: "🇿🇦" },
  { code: "KE", name: "Kenya", dialCode: "+254", flag: "🇰🇪" },
  { code: "GH", name: "Ghana", dialCode: "+233", flag: "🇬🇭" },
];

/**
 * Parses a raw phone string e.g. "+2348012345678" or "08012345678"
 * into a matching country dial code and local digits.
 */
export function parsePhoneNumber(raw: string, defaultDialCode = "+234") {
  const clean = raw.trim();
  if (!clean) return { dialCode: defaultDialCode, localNumber: "" };

  if (clean.startsWith("+")) {
    // Find matching country code sorted by dialCode length descending
    const sorted = [...COUNTRIES].sort((a, b) => b.dialCode.length - a.dialCode.length);
    const match = sorted.find(c => clean.startsWith(c.dialCode));
    if (match) {
      const localNumber = clean.slice(match.dialCode.length).replace(/^0+/, "");
      return { dialCode: match.dialCode, localNumber };
    }
  }

  // Fallback: strip non-digits and leading zeros
  const digitsOnly = clean.replace(/[^0-9]/g, "");
  const localNumber = digitsOnly.replace(/^0+/, "");
  return { dialCode: defaultDialCode, localNumber };
}

/**
 * Formats combined phone string cleanly e.g. "+234" + "8012345678" -> "+234 801 234 5678"
 */
export function formatFullPhoneNumber(dialCode: string, localNumber: string): string {
  const strippedLocal = localNumber.replace(/[^0-9]/g, "").replace(/^0+/, "");
  if (!strippedLocal) return "";
  return `${dialCode}${strippedLocal}`;
}

interface PhoneInputProps {
  value: string;
  onChange: (fullValue: string) => void;
  id?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export default function PhoneInput({
  value,
  onChange,
  id = "phone-input",
  placeholder = "801 234 5678",
  required = false,
  className = "",
}: PhoneInputProps) {
  const [selectedDialCode, setSelectedDialCode] = useState("+234");
  const [localNumber, setLocalNumber] = useState("");

  // Sync internal state when external value changes
  useEffect(() => {
    const parsed = parsePhoneNumber(value, selectedDialCode);
    setSelectedDialCode(parsed.dialCode);
    setLocalNumber(parsed.localNumber);
  }, [value]);

  const handleDialCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCode = e.target.value;
    setSelectedDialCode(newCode);
    const full = formatFullPhoneNumber(newCode, localNumber);
    onChange(full);
  };

  const handleLocalNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value;
    // Allow digits and spaces/dashes
    const cleanedDigits = inputVal.replace(/[^0-9\s-]/g, "");
    setLocalNumber(cleanedDigits);

    const full = formatFullPhoneNumber(selectedDialCode, cleanedDigits);
    onChange(full);
  };

  // Validate number length (local digits should be 7-12)
  const digitsOnly = localNumber.replace(/[^0-9]/g, "").replace(/^0+/, "");
  const isValidLength = digitsOnly.length >= 7 && digitsOnly.length <= 13;

  return (
    <div className={`w-full flex items-center gap-2.5 ${className}`}>
      {/* Country Dial Code Dropdown */}
      <div className="relative min-w-[130px] sm:min-w-[145px] flex-shrink-0">
        <select
          value={selectedDialCode}
          onChange={handleDialCodeChange}
          className="w-full pl-3 pr-7 py-3 rounded-xl border border-border-light bg-surface-near-white font-body text-xs font-semibold text-text-primary focus:border-accent-blue transition-colors cursor-pointer appearance-none truncate"
          aria-label="Select Country Code"
        >
          {COUNTRIES.map((c) => (
            <option key={`${c.code}-${c.dialCode}`} value={c.dialCode}>
              {c.flag} {c.dialCode} ({c.code})
            </option>
          ))}
        </select>
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-text-subtle text-[10px]">
          ▼
        </div>
      </div>

      {/* Local Phone Number Input */}
      <div className="flex-1 relative">
        <input
          id={id}
          type="tel"
          value={localNumber}
          onChange={handleLocalNumberChange}
          placeholder={placeholder}
          required={required}
          className={`w-full px-4 py-3 rounded-xl border font-body text-xs text-text-primary placeholder:text-text-subtle transition-colors focus:outline-none ${
            localNumber.length > 0 && !isValidLength
              ? "border-amber-400 bg-amber-500/5 focus:border-amber-500"
              : "border-border-light bg-surface-near-white focus:border-accent-blue"
          }`}
          autoComplete="tel-local"
        />
        {localNumber.length > 0 && !isValidLength && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-amber-600 font-bold">
            Check length
          </span>
        )}
      </div>
    </div>
  );
}
