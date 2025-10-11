interface FormFieldProps {
  label: string;
  id: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  children?: React.ReactNode;
}

export function FormField({
  label,
  id,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  children,
}: Readonly<FormFieldProps>) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors ${
            error ? "border-red-300 bg-red-50" : "border-gray-300"
          } ${children ? "pr-12" : ""}`}
          placeholder={placeholder}
        />
        {children}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
