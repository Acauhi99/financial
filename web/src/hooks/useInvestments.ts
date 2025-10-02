import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type Investment } from "../services/api";

export function useInvestments(page = 1, limit = 10, search = "") {
  return useQuery({
    queryKey: ["investments", page, limit, search],
    queryFn: () => api.getInvestments(page, limit, search),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCreateInvestment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (investment: Omit<Investment, "id" | "monthlyReturn">) =>
      api.createInvestment(investment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["investments"] });
    },
  });
}
