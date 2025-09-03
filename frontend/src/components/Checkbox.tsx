import React, { useRef } from "react";

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const OtpInput: React.FC<OtpInputProps> = ({ length = 6, value, onChange, error }) => {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value.replace(/[^0-9]/g, ""); // digits only
    if (!val) return;

    const newValue =
      value.substring(0, index) + val + value.substring(index + 1);
    onChange(newValue);

    // auto-focus next box
    if (val && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">OTP</label>
      <div className="flex gap-2 justify-center">
        {Array.from({ length }).map((_, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            value={value[index] || ""}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            ref={(el) => (inputsRef.current[index] = el)}
            className={`
              w-12 h-12 text-center text-lg border border-gray-300 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-blue-500
              ${error ? "border-red-500 focus:ring-red-500" : ""}
            `}
          />
        ))}
      </div>
      {error && <p className="text-sm text-red-600 text-center">{error}</p>}
    </div>
  );
};

export default OtpInput;
