export const filterByAmountRange = (amount: number, range: string) => {
  if (range === "all") {
    return true;
  }

  const [min, max] = range.split("-").map((v) => v.replace("+", ""));

  if (range.includes("+")) {
    return amount >= parseFloat(min);
  }

  return amount >= parseFloat(min) && amount <= parseFloat(max);
};

export const filterByRateRange = (rate: number, range: string) => {
  if (range === "all") {
    return true;
  }

  const [min, max] = range.split("-").map((v) => v.replace("+", ""));

  if (range.includes("+")) {
    return rate >= parseFloat(min);
  }

  return rate >= parseFloat(min) && rate <= parseFloat(max);
};

export const filterByDateRange = (date: string, range: string) => {
  if (range === "all") {
    return true;
  }

  const itemDate = new Date(date);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (range) {
    case "today":
      return itemDate >= today;
    case "week": {
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      return itemDate >= weekAgo;
    }
    case "month": {
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      return itemDate >= monthAgo;
    }
    case "3months": {
      const threeMonthsAgo = new Date(
        today.getTime() - 90 * 24 * 60 * 60 * 1000
      );
      return itemDate >= threeMonthsAgo;
    }
    default:
      return true;
  }
};
