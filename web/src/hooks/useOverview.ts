import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";

export function useOverview() {
  return useQuery({
    queryKey: ["overview"],
    queryFn: () => api.getOverview(),
    staleTime: 0, // Always fresh data
  });
}
