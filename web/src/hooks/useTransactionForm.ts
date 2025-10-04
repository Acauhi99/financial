import { useState } from "react";
import { useCreateTransaction } from "./useTransactions";

export function useTransactionForm() {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");

  const createMutation = useCreateTransaction();

  const addTransaction = () => {
    if (!description || !amount) return;

    createMutation.mutate(
      {
        type,
        description,
        amount: parseFloat(amount),
      },
      {
        onSuccess: () => {
          setDescription("");
          setAmount("");
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
    addTransaction,
    isLoading: createMutation.isPending,
  };
}
