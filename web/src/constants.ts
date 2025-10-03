// Configurações de paginação
export const PAGINATION = {
  ITEMS_PER_PAGE: 7,
} as const;

// Configurações de formatação
export const CURRENCY_FORMAT = {
  LOCALE: "pt-BR",
  CURRENCY: "BRL",
} as const;

// Paleta de cores padronizada
export const COLORS = {
  PRIMARY: "#1f2937",
  SUCCESS: "#10b981",
  DANGER: "#ef4444",
  WARNING: "#f59e0b",
  INFO: "#3b82f6",
  PURPLE: "#8b5cf6",
  GRAY: "#6b7280",
  LIGHT_GRAY: "#9ca3af",
  CHART: {
    GREEN: "#10b981",
    RED: "#ef4444", 
    BLUE: "#3b82f6",
    ORANGE: "#f97316",
    YELLOW: "#eab308",
    PURPLE: "#8b5cf6",
    GRAY: "#6b7280",
    TEAL: "#14b8a6",
    PINK: "#ec4899",
    INDIGO: "#6366f1"
  }
} as const;

// Classes CSS reutilizáveis
export const CSS_CLASSES = {
  INPUT:
    "w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent",
  INPUT_WITH_ICON:
    "w-full pl-10 pr-3 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent",
  BUTTON_PRIMARY:
    "px-6 py-3 rounded font-medium transition-all flex items-center space-x-2 bg-gray-900 text-white hover:bg-gray-800 shadow-sm hover:shadow-md",
  BUTTON_DISABLED:
    "px-6 py-3 rounded font-medium transition-all flex items-center space-x-2 bg-gray-200 text-gray-400 cursor-not-allowed",
  CARD: "bg-white p-6 rounded border border-gray-200 shadow-sm",
  ICON_CONTAINER: "w-10 h-10 rounded flex items-center justify-center",
  LABEL: "block text-sm font-medium text-gray-700 mb-2",
  SELECT:
    "px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent",
} as const;

// Filtros e opções
export const FILTER_OPTIONS = {
  TRANSACTION_TYPES: [
    { value: "all", label: "Todos os tipos" },
    { value: "income", label: "Receitas" },
    { value: "expense", label: "Despesas" },
  ],
  AMOUNT_RANGES: [
    { value: "all", label: "Todos os valores" },
    { value: "0-100", label: "Até R$ 100" },
    { value: "100-500", label: "R$ 100 - R$ 500" },
    { value: "500-1000", label: "R$ 500 - R$ 1.000" },
    { value: "1000-5000", label: "R$ 1.000 - R$ 5.000" },
    { value: "5000+", label: "Acima de R$ 5.000" },
  ],
  INVESTMENT_RATES: [
    { value: "all", label: "Todas as taxas" },
    { value: "0-50", label: "0% - 50% CDI" },
    { value: "50-80", label: "50% - 80% CDI" },
    { value: "80-100", label: "80% - 100% CDI" },
    { value: "100+", label: "Acima de 100% CDI" },
  ],
  SORT_OPTIONS: [
    { value: "newest", label: "Mais recentes" },
    { value: "oldest", label: "Mais antigos" },
    { value: "highest", label: "Maior valor" },
    { value: "lowest", label: "Menor valor" },
  ],
} as const;

// Utilitários
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat(CURRENCY_FORMAT.LOCALE, {
    style: "currency",
    currency: CURRENCY_FORMAT.CURRENCY,
  }).format(amount);
};

export const formatDate = (date: string | Date) => {
  return new Intl.DateTimeFormat(CURRENCY_FORMAT.LOCALE, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
};

export const formatPercentage = (value: number) => {
  return `${value.toFixed(2)}%`;
};

export const filterByAmountRange = (amount: number, range: string) => {
  if (range === "all") return true;

  const [min, max] = range.split("-").map((v) => v.replace("+", ""));

  if (range.includes("+")) {
    return amount >= parseFloat(min);
  }

  return amount >= parseFloat(min) && amount <= parseFloat(max);
};

export const filterByRateRange = (rate: number, range: string) => {
  if (range === "all") return true;

  const [min, max] = range.split("-").map((v) => v.replace("+", ""));

  if (range.includes("+")) {
    return rate >= parseFloat(min);
  }

  return rate >= parseFloat(min) && rate <= parseFloat(max);
};