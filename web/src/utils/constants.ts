// Configurações de paginação
export const PAGINATION = {
  ITEMS_PER_PAGE: 10,
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
  WHITE: "#ffffff",
  GRID: "#e5e7eb",
  // Cores específicas para gráficos
  CHART_GREEN: "#22c55e",
  CHART_RED: "#ef4444",
  CHART_BLUE: "#3b82f6",
  CHART_PURPLE: "#8b5cf6",
} as const;

// Classes CSS reutilizáveis
export const CSS_CLASSES = {
  INPUT:
    "w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm",
  INPUT_WITH_ICON:
    "w-full pl-8 pr-2 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm",
  BUTTON_PRIMARY:
    "px-4 py-2 rounded font-medium transition-all flex items-center space-x-1 bg-gray-900 text-white hover:bg-gray-800 shadow-sm hover:shadow-md text-sm",
  BUTTON_DISABLED:
    "px-4 py-2 rounded font-medium transition-all flex items-center space-x-1 bg-gray-200 text-gray-400 cursor-not-allowed text-sm",
  BUTTON_SMALL: "px-2 py-1 text-xs rounded transition-colors cursor-pointer",
  BUTTON_SMALL_ACTIVE: "bg-gray-200 text-gray-900 font-medium",
  BUTTON_SMALL_INACTIVE: "text-gray-500 hover:text-gray-700 hover:bg-gray-100",
  CARD: "bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-lg hover:shadow-gray-200/60 transition-all duration-300",
  CHART_CONTAINER:
    "bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-lg hover:shadow-gray-200/60 transition-all duration-300 flex flex-col",
  CHART_HEADER: "flex items-center space-x-2 mb-3 flex-shrink-0",
  CHART_TITLE: "text-sm font-semibold text-gray-900",
  TOGGLE_BUTTON:
    "absolute top-2 right-2 w-6 h-6 rounded-full text-xs font-bold transition-colors cursor-pointer",
  TOGGLE_ACTIVE: "text-white",
  TOGGLE_INACTIVE: "bg-gray-300 text-gray-600",
  ICON_CONTAINER: "w-10 h-10 rounded flex items-center justify-center",
  LABEL: "block text-xs font-medium text-gray-700 mb-1",
  SELECT:
    "px-2 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm",
  PAGE_HEADER: "flex-shrink-0 mb-3",
  PAGE_TITLE: "text-2xl font-bold text-gray-900 mb-1",
  PAGE_SUBTITLE: "text-gray-600 text-sm",
  GRID_METRICS: "grid grid-cols-1 md:grid-cols-4 gap-3 flex-shrink-0 mb-3",
  GRID_CHARTS: "grid grid-cols-1 lg:grid-cols-3 gap-3 flex-1",
  LAYOUT_MAIN: "h-screen flex flex-col p-4 gap-3 pb-6",
  LAYOUT_CONTENT: "flex-1 min-h-0 flex flex-col gap-3 mb-4",
  ERROR_MESSAGE: "text-red-600 text-center py-8",
} as const;

// Configurações de UI
export const UI_CONFIG = {
  CHART: {
    PIE_OUTER_RADIUS: 78,
    PIE_PADDING_ANGLE: 1,
    PIE_STROKE_WIDTH: 1,
    LINE_STROKE_WIDTH: 3,
    LINE_DOT_RADIUS: 4,
    LINE_ACTIVE_DOT_RADIUS: 6,
  },
  SIZES: {
    ICON_SMALL: 16,
    ICON_MEDIUM: 20,
    ICON_LARGE: 24,
    FONT_TICK: 12,
    FONT_LABEL: 11,
    FONT_LEGEND: 12,
  },
  TIME_PERIODS: [
    { value: "3", label: "3M" },
    { value: "6", label: "6M" },
    { value: "9", label: "9M" },
    { value: "12", label: "1A" },
    { value: "60", label: "5A" },
  ],
} as const;

// Configurações de métricas
export const METRICS_CONFIG = {
  BALANCE: {
    key: "saldo",
    title: "Saldo Total",
    color: "gray",
    chartColor: COLORS.INFO,
  },
  INCOME: {
    key: "receitas",
    title: "Receitas",
    color: "green",
    chartColor: COLORS.CHART_GREEN,
  },
  EXPENSES: {
    key: "despesas",
    title: "Despesas",
    color: "red",
    chartColor: COLORS.CHART_RED,
  },
  INVESTMENTS: {
    key: "investimentos",
    title: "Investimentos",
    color: "purple",
    chartColor: COLORS.CHART_PURPLE,
  },
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
  DATE_RANGES: [
    { value: "all", label: "Todas as datas" },
    { value: "today", label: "Hoje" },
    { value: "week", label: "Última semana" },
    { value: "month", label: "Último mês" },
    { value: "3months", label: "Últimos 3 meses" },
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
