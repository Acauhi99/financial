import { useState } from "react";
import { useAuth } from "./useAuth";
import { loginSchema, registerSchema } from "../schemas/auth";
import { z } from "zod";

export function useAuthForm(
  isRegisterMode: boolean,
  onRegisterSuccess: () => void
) {
  const { login, register, isLoading } = useAuth();
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    setShowSuccess(false);

    try {
      if (isRegisterMode) {
        const validatedData = registerSchema.parse(formData);
        await register(validatedData);
        setShowSuccess(true);
        setTimeout(() => {
          onRegisterSuccess();
        }, 2000);
      } else {
        const validatedData = loginSchema.parse({
          email: formData.email,
          password: formData.password,
        });
        await login(validatedData);
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        err.issues.forEach((issue) => {
          if (issue.path[0]) {
            errors[issue.path[0] as string] = issue.message;
          }
        });
        setFieldErrors(errors);
      } else {
        setError(err instanceof Error ? err.message : "Erro inesperado");
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return {
    formData,
    error,
    fieldErrors,
    showSuccess,
    isLoading,
    handleSubmit,
    handleChange,
  };
}
