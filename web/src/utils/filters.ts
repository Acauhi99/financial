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

  const itemDate = new Date(date + "T00:00:00");
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (range) {
    case "today": {
      const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
      return itemDate >= today && itemDate < tomorrow;
    }
    case "week": {
      const weekAgo = new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000);
      const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
      return itemDate >= weekAgo && itemDate < tomorrow;
    }
    case "month": {
      const monthAgo = new Date(today.getTime() - 29 * 24 * 60 * 60 * 1000);
      const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
      return itemDate >= monthAgo && itemDate < tomorrow;
    }
    case "3months": {
      const threeMonthsAgo = new Date(
        today.getTime() - 89 * 24 * 60 * 60 * 1000
      );
      const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
      return itemDate >= threeMonthsAgo && itemDate < tomorrow;
    }
    case "6months": {
      const sixMonthsAgo = new Date(
        today.getTime() - 179 * 24 * 60 * 60 * 1000
      );
      const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
      return itemDate >= sixMonthsAgo && itemDate < tomorrow;
    }
    default:
      return true;
  }
};
