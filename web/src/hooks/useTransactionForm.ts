import { useState } from "react";
import { useCreateTransaction } from "./useTransactions";
import { transactionSchema } from "../schemas/validation";

export function useTransactionForm() {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createMutation = useCreateTransaction();

  const addTransaction = () => {
    const result = transactionSchema.safeParse({ description, amount, type });
    
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
        type: result.data.type,
        description: result.data.description,
        amount: parseFloat(result.data.amount),
        date: new Date().toISOString().split('T')[0]
      },
      {
        onSuccess: () => {
          setDescription("");
          setAmount("");
          setErrors({});
        },
      }
    );
  };

  return {
    description,
    setDescription,
    amount,
    setAmount,
    type,
    setType,
    errors,
    addTransaction,
    isLoading: createMutation.isPending,
  };
}
