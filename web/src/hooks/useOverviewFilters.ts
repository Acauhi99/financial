import { useState, useMemo } from "react";

export function useOverviewFilters() {
  const [hiddenItems, setHiddenItems] = useState({
    balance: new Set<string>(),
    expense: new Set<string>(),
    investment: new Set<string>(),
    monthly: new Set<string>(),
  });

  const [timePeriod, setTimePeriod] = useState("12");

  const toggleMonthlyItem = (itemName: string) => {
    setHiddenItems((prev) => {
      const newSet = new Set(prev.monthly);
      if (newSet.has(itemName)) {
        newSet.delete(itemName);
      } else {
        newSet.add(itemName);
      }
      return { ...prev, monthly: newSet };
    });
  };

  const toggleChartItem = (
    type: "balance" | "expense" | "investment",
    itemName: string
  ) => {
    setHiddenItems((prev) => {
      const newSet = new Set(prev[type]);
      if (newSet.has(itemName)) {
        newSet.delete(itemName);
      } else {
        newSet.add(itemName);
      }
      return { ...prev, [type]: newSet };
    });
  };

  const getFilteredData = useMemo(() => {
    return <T extends { name: string }>(
      data: T[],
      type: "balance" | "expense" | "investment"
    ) => {
      return (data || []).filter((item) => !hiddenItems[type].has(item.name));
    };
  }, [hiddenItems]);

  return {
    hiddenItems,
    timePeriod,
    setTimePeriod,
    toggleMonthlyItem,
    toggleChartItem,
    getFilteredData,
  };
}
