import { useState } from "react";
import { useCreateInvestment } from "./useInvestments";

export function useInvestmentForm() {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("");

  const createMutation = useCreateInvestment();

  const addInvestment = () => {
    if (!name || !amount || !rate) return;

    createMutation.mutate(
      { name, amount: parseFloat(amount), rate: parseFloat(rate) },
      {
        onSuccess: () => {
          setName("");
          setAmount("");
          setRate("");
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
    addInvestment,
    isLoading: createMutation.isPending,
  };
}
