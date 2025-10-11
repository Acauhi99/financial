import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { FormField } from "./FormField";

interface PasswordFieldProps {
  label: string;
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
}

export function PasswordField({
  label,
  id,
  name,
  value,
  onChange,
  placeholder,
  error,
}: Readonly<PasswordFieldProps>) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormField
      label={label}
      id={id}
      name={name}
      type={showPassword ? "text" : "password"}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      error={error}
    >
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </FormField>
  );
}
