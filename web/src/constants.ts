// Configurações de paginação
export const PAGINATION = {
  ITEMS_PER_PAGE: 7,
} as const;

// Configurações de formatação
export const CURRENCY_FORMAT = {
  LOCALE: "pt-BR",
  CURRENCY: "BRL",
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

// Utilitários
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat(CURRENCY_FORMAT.LOCALE, {
    style: "currency",
    currency: CURRENCY_FORMAT.CURRENCY,
  }).format(amount);
};
