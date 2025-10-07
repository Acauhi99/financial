import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";

export function useTransactionTotals() {
  return useQuery({
    queryKey: ["transaction-totals"],
    queryFn: async () => {
      const response = await api.getTransactions(1, 1000, "", "all");
      const transactions = response.data;

      const totalIncome = transactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);

      const totalExpenses = transactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

      const balance = totalIncome - totalExpenses;

      return { totalIncome, totalExpenses, balance };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
