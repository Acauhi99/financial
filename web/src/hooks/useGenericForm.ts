import { useState } from "react";
import { z } from "zod";

export function useGenericForm<T extends Record<string, any>>(
  initialValues: T,
  schema: z.ZodSchema<T>,
  onSubmit: (data: T) => Promise<any> | void,
  onSuccess?: () => void
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const setValue = (key: string, value: any) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: "" }));
    }
  };

  const handleSubmit = async () => {
    const result = schema.safeParse(values);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((error) => {
        if (error.path[0]) {
          fieldErrors[error.path[0] as string] = error.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      await onSubmit(result.data);
      setValues(initialValues);
      setErrors({});
      onSuccess?.();
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    values,
    errors,
    isLoading,
    setValue,
    handleSubmit,
  };
}
