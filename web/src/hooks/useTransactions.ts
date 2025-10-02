import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type Transaction } from "../services/api";

export function useTransactions(
  page = 1,
  limit = 15,
  search = "",
  type = "all"
) {
  return useQuery({
    queryKey: ["transactions", page, limit, search, type],
    queryFn: () => api.getTransactions(page, limit, search, type),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (transaction: Omit<Transaction, "id">) =>
      api.createTransaction(transaction),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}
