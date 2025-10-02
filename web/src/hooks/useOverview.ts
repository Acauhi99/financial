import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";

export function useOverview() {
  return useQuery({
    queryKey: ["overview"],
    queryFn: () => api.getOverview(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
