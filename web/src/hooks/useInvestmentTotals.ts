import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";

export function useInvestmentTotals() {
  return useQuery({
    queryKey: ["investment-totals"],
    queryFn: async () => {
      const response = await api.getInvestments(1, 1000, "");
      const investments = response.data;

      const totalInvested = investments.reduce(
        (sum, inv) => sum + inv.amount,
        0
      );
      const totalMonthlyReturn = investments.reduce(
        (sum, inv) => sum + inv.monthlyReturn,
        0
      );
      const averageRate =
        investments.length > 0
          ? investments.reduce((sum, inv) => sum + inv.rate, 0) /
            investments.length
          : 0;

      return { totalInvested, totalMonthlyReturn, averageRate };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
