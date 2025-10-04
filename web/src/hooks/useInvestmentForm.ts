import { useState } from "react";
import { useCreateInvestment } from "./useInvestments";
import { investmentSchema } from "../schemas/validation";

export function useInvestmentForm() {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createMutation = useCreateInvestment();

  const addInvestment = () => {
    const result = investmentSchema.safeParse({ name, amount, rate });
    
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
    createMutation.mutate(
      { 
        name: result.data.name, 
        amount: parseFloat(result.data.amount), 
        rate: parseFloat(result.data.rate) 
      },
      {
        onSuccess: () => {
          setName("");
          setAmount("");
          setRate("");
          setErrors({});
        },
      }
    );
  };

  return {
    name,
    setName,
    amount,
    setAmount,
    rate,
    setRate,
    errors,
    addInvestment,
    isLoading: createMutation.isPending,
  };
}
