import { useState } from "react";

export function useFormState<T extends Record<string, string>>(
  initialState: T
) {
  const [values, setValues] = useState<T>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setValue = (key: keyof T, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key as string]) {
      setErrors((prev) => ({ ...prev, [key]: "" }));
    }
  };

  const setError = (key: keyof T, error: string) => {
    setErrors((prev) => ({ ...prev, [key]: error }));
  };

  const clearErrors = () => setErrors({});

  const reset = () => {
    setValues(initialState);
    setErrors({});
  };

  return {
    values,
    errors,
    setValue,
    setError,
    clearErrors,
    reset,
  };
}
