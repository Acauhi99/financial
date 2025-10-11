// Interfaces
export interface Category {
  id: string;
  name: string;
  color: string;
  type: "income" | "expense";
}

export interface Transaction {
  id: number | string;
  type: "income" | "expense";
  description: string;
  amount: number;
  date: string;
  categoryId?: string;
  category?: Category;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Investment {
  id: number | string;
  name: string;
  amount: number;
  rate: number;
  monthlyReturn: number;
  date: string;
  type?: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface DashboardSummary {
  totals: {
    balance: number;
    totalIncome: number;
    totalExpenses: number;
    totalInvestments: number;
    totalMonthlyReturn: number;
    averageRate: number;
  };
  categories: Category[];
}

export interface OverviewData {
  summary: {
    balance: number;
    totalIncome: number;
    totalExpenses: number;
    totalInvestments: number;
  };
  balanceData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  monthlyData: Array<{
    month: string;
    receitas: number;
    despesas: number;
    saldo: number;
    investimentos: number;
  }>;
  expenseCategories: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  investmentTypes: Array<{
    name: string;
    value: number;
    color: string;
    percentage: number;
  }>;
}

// Helper para gerar transações com nova estrutura
const createTransactionMock = (
  id: number,
  type: "income" | "expense",
  description: string,
  amount: number,
  date: string,
  categoryId: string
): Transaction => ({
  id: `txn-${id}`,
  type,
  description,
  amount,
  date,
  categoryId,
  userId: "user-1",
  createdAt: `${date}T10:00:00Z`,
  updatedAt: `${date}T10:00:00Z`,
});

const mockTransactions: Transaction[] = [
  createTransactionMock(1, "income", "Salário", 8500, "2024-12-15", "cat-1"),
  createTransactionMock(2, "expense", "Aluguel", 2200, "2024-12-14", "cat-4"),
  createTransactionMock(
    3,
    "expense",
    "Supermercado Extra",
    450,
    "2024-12-13",
    "cat-5"
  ),
  createTransactionMock(
    4,
    "income",
    "Freelance Design",
    1200,
    "2024-12-12",
    "cat-2"
  ),
  createTransactionMock(
    5,
    "expense",
    "Conta de Luz",
    180,
    "2024-12-11",
    "cat-4"
  ),
  createTransactionMock(6, "expense", "Internet", 120, "2024-12-10", "cat-4"),
  createTransactionMock(7, "expense", "Gasolina", 320, "2024-12-09", "cat-6"),
  createTransactionMock(
    8,
    "income",
    "Dividendos Ações",
    280,
    "2024-12-08",
    "cat-3"
  ),
  {
    id: 9,
    type: "expense",
    description: "Restaurante",
    amount: 85,
    date: "2024-12-07",
  },
  {
    id: 10,
    type: "expense",
    description: "Farmácia",
    amount: 65,
    date: "2024-12-06",
  },
  {
    id: 11,
    type: "income",
    description: "Venda Produto",
    amount: 350,
    date: "2024-12-05",
  },
  {
    id: 12,
    type: "expense",
    description: "Academia",
    amount: 89,
    date: "2024-12-04",
  },
  {
    id: 13,
    type: "expense",
    description: "Uber",
    amount: 45,
    date: "2024-12-03",
  },
  {
    id: 14,
    type: "income",
    description: "Cashback Cartão",
    amount: 25,
    date: "2024-12-02",
  },
  {
    id: 15,
    type: "expense",
    description: "Netflix",
    amount: 32,
    date: "2024-12-01",
  },
  {
    id: 16,
    type: "expense",
    description: "Spotify",
    amount: 17,
    date: "2024-11-30",
  },
  {
    id: 17,
    type: "expense",
    description: "Padaria",
    amount: 28,
    date: "2024-11-29",
  },
  {
    id: 18,
    type: "income",
    description: "Consultoria",
    amount: 800,
    date: "2024-11-28",
  },
  {
    id: 19,
    type: "expense",
    description: "Posto de Gasolina",
    amount: 280,
    date: "2024-11-27",
  },
  {
    id: 20,
    type: "expense",
    description: "Supermercado Pão de Açúcar",
    amount: 380,
    date: "2024-11-26",
  },
  {
    id: 21,
    type: "income",
    description: "Rendimento Poupança",
    amount: 45,
    date: "2024-11-25",
  },
  {
    id: 22,
    type: "expense",
    description: "Conta de Água",
    amount: 95,
    date: "2024-11-24",
  },
  {
    id: 23,
    type: "expense",
    description: "Plano de Saúde",
    amount: 420,
    date: "2024-11-23",
  },
  {
    id: 24,
    type: "income",
    description: "Venda Usados",
    amount: 150,
    date: "2024-11-22",
  },
  {
    id: 25,
    type: "expense",
    description: "Shopping",
    amount: 220,
    date: "2024-11-21",
  },
  {
    id: 26,
    type: "expense",
    description: "Mecânico",
    amount: 350,
    date: "2024-11-20",
  },
  {
    id: 27,
    type: "income",
    description: "Bônus Trabalho",
    amount: 500,
    date: "2024-11-19",
  },
  {
    id: 28,
    type: "expense",
    description: "Dentista",
    amount: 180,
    date: "2024-11-18",
  },
  {
    id: 29,
    type: "expense",
    description: "Livros",
    amount: 75,
    date: "2024-11-17",
  },
  {
    id: 30,
    type: "income",
    description: "Aluguel Imóvel",
    amount: 1800,
    date: "2024-11-16",
  },
  {
    id: 31,
    type: "expense",
    description: "Seguro Carro",
    amount: 280,
    date: "2024-11-15",
  },
  {
    id: 32,
    type: "expense",
    description: "Celular",
    amount: 85,
    date: "2024-11-14",
  },
  {
    id: 33,
    type: "income",
    description: "Projeto Extra",
    amount: 650,
    date: "2024-11-13",
  },
  {
    id: 34,
    type: "expense",
    description: "Cinema",
    amount: 40,
    date: "2024-11-12",
  },
  {
    id: 35,
    type: "expense",
    description: "Lanchonete",
    amount: 25,
    date: "2024-11-11",
  },
  {
    id: 36,
    type: "income",
    description: "Reembolso",
    amount: 120,
    date: "2024-11-10",
  },
  {
    id: 37,
    type: "expense",
    description: "Roupas",
    amount: 180,
    date: "2024-11-09",
  },
  {
    id: 38,
    type: "expense",
    description: "Transporte Público",
    amount: 150,
    date: "2024-11-08",
  },
  {
    id: 39,
    type: "income",
    description: "Vendas Online",
    amount: 420,
    date: "2024-11-07",
  },
  {
    id: 40,
    type: "expense",
    description: "Veterinário",
    amount: 200,
    date: "2024-11-06",
  },
  {
    id: 41,
    type: "expense",
    description: "Supermercado Carrefour",
    amount: 310,
    date: "2024-11-05",
  },
  {
    id: 42,
    type: "income",
    description: "Trabalho Fim de Semana",
    amount: 300,
    date: "2024-11-04",
  },
  {
    id: 43,
    type: "expense",
    description: "Lavanderia",
    amount: 35,
    date: "2024-11-03",
  },
  {
    id: 44,
    type: "expense",
    description: "Correios",
    amount: 15,
    date: "2024-11-02",
  },
  {
    id: 45,
    type: "income",
    description: "Prêmio Seguro",
    amount: 180,
    date: "2024-11-01",
  },
  {
    id: 46,
    type: "expense",
    description: "Material Escritório",
    amount: 90,
    date: "2024-10-31",
  },
  {
    id: 47,
    type: "expense",
    description: "Cabeleireiro",
    amount: 60,
    date: "2024-10-30",
  },
  {
    id: 48,
    type: "income",
    description: "Aulas Particulares",
    amount: 400,
    date: "2024-10-29",
  },
  {
    id: 49,
    type: "expense",
    description: "Pizza",
    amount: 55,
    date: "2024-10-28",
  },
  {
    id: 50,
    type: "expense",
    description: "Estacionamento",
    amount: 20,
    date: "2024-10-27",
  },
];

// Helper para gerar investimentos com nova estrutura
const createInvestmentMock = (
  id: number,
  name: string,
  amount: number,
  rate: number,
  date: string,
  type: string
): Investment => ({
  id: `inv-${id}`,
  name,
  amount,
  rate,
  monthlyReturn: (amount * (rate / 100)) / 12,
  date,
  type,
  userId: "user-1",
  createdAt: `${date}T10:00:00Z`,
  updatedAt: `${date}T10:00:00Z`,
});

const mockInvestments: Investment[] = [
  createInvestmentMock(
    1,
    "Tesouro Selic 2029",
    15000,
    100,
    "2024-12-15",
    "Tesouro Direto"
  ),
  {
    id: 2,
    name: "CDB Banco Inter",
    amount: 8500,
    rate: 110,
    monthlyReturn: 77.92,
    date: "2024-12-14",
  },
  {
    id: 3,
    name: "LCI Santander",
    amount: 12000,
    rate: 95,
    monthlyReturn: 95,
    date: "2024-12-13",
  },
  {
    id: 4,
    name: "Tesouro IPCA+ 2035",
    amount: 20000,
    rate: 105,
    monthlyReturn: 175,
    date: "2024-12-12",
  },
  {
    id: 5,
    name: "CDB Nubank",
    amount: 5000,
    rate: 108,
    monthlyReturn: 45,
    date: "2024-12-11",
  },
  {
    id: 6,
    name: "Fundo DI XP",
    amount: 7500,
    rate: 98,
    monthlyReturn: 61.25,
    date: "2024-12-10",
  },
  {
    id: 7,
    name: "LCA Itaú",
    amount: 10000,
    rate: 102,
    monthlyReturn: 85,
    date: "2024-12-09",
  },
  {
    id: 8,
    name: "Tesouro Prefixado 2027",
    amount: 6000,
    rate: 112,
    monthlyReturn: 56,
    date: "2024-12-08",
  },
  {
    id: 9,
    name: "CDB BTG Pactual",
    amount: 18000,
    rate: 115,
    monthlyReturn: 172.5,
    date: "2024-12-07",
  },
  {
    id: 10,
    name: "Fundo Multimercado",
    amount: 25000,
    rate: 120,
    monthlyReturn: 250,
    date: "2024-12-06",
  },
  {
    id: 11,
    name: "CRI Kinea",
    amount: 4000,
    rate: 125,
    monthlyReturn: 41.67,
    date: "2024-12-05",
  },
  {
    id: 12,
    name: "Debênture Petrobras",
    amount: 15000,
    rate: 118,
    monthlyReturn: 147.5,
    date: "2024-12-04",
  },
  {
    id: 13,
    name: "LCI C6 Bank",
    amount: 9000,
    rate: 103,
    monthlyReturn: 77.25,
    date: "2024-12-03",
  },
  {
    id: 14,
    name: "CDB Original",
    amount: 11000,
    rate: 109,
    monthlyReturn: 99.92,
    date: "2024-12-02",
  },
  {
    id: 15,
    name: "Tesouro IPCA+ 2045",
    amount: 30000,
    rate: 106,
    monthlyReturn: 265,
    date: "2024-12-01",
  },
  {
    id: 16,
    name: "Fundo Imobiliário HGLG11",
    amount: 8000,
    rate: 95,
    monthlyReturn: 63.33,
    date: "2024-11-30",
  },
  {
    id: 17,
    name: "CDB Sofisa",
    amount: 7000,
    rate: 113,
    monthlyReturn: 65.92,
    date: "2024-11-29",
  },
  {
    id: 18,
    name: "LCA Bradesco",
    amount: 13000,
    rate: 101,
    monthlyReturn: 109.42,
    date: "2024-11-28",
  },
  {
    id: 19,
    name: "CRI Habitat",
    amount: 5500,
    rate: 122,
    monthlyReturn: 55.92,
    date: "2024-11-27",
  },
  {
    id: 20,
    name: "Tesouro Selic 2026",
    amount: 22000,
    rate: 99,
    monthlyReturn: 181.5,
    date: "2024-11-26",
  },
  {
    id: 21,
    name: "CDB Banco Pan",
    amount: 6500,
    rate: 107,
    monthlyReturn: 58.04,
    date: "2024-11-25",
  },
  {
    id: 22,
    name: "Fundo DI Itaú",
    amount: 14000,
    rate: 97,
    monthlyReturn: 113.17,
    date: "2024-11-24",
  },
  {
    id: 23,
    name: "LCI XP Investimentos",
    amount: 16000,
    rate: 104,
    monthlyReturn: 138.67,
    date: "2024-11-23",
  },
  {
    id: 24,
    name: "CDB Banco do Brasil",
    amount: 9500,
    rate: 100,
    monthlyReturn: 79.17,
    date: "2024-11-22",
  },
  {
    id: 25,
    name: "Debênture Vale",
    amount: 12500,
    rate: 116,
    monthlyReturn: 120.83,
    date: "2024-11-21",
  },
  {
    id: 26,
    name: "Tesouro Prefixado 2030",
    amount: 18500,
    rate: 111,
    monthlyReturn: 171.21,
    date: "2024-11-20",
  },
  {
    id: 27,
    name: "CRI Votorantim",
    amount: 7800,
    rate: 119,
    monthlyReturn: 77.35,
    date: "2024-11-19",
  },
  {
    id: 28,
    name: "LCA Caixa",
    amount: 10500,
    rate: 96,
    monthlyReturn: 84,
    date: "2024-11-18",
  },
  {
    id: 29,
    name: "CDB Rico",
    amount: 8200,
    rate: 114,
    monthlyReturn: 77.97,
    date: "2024-11-17",
  },
  {
    id: 30,
    name: "Fundo Multimercado BTG",
    amount: 35000,
    rate: 125,
    monthlyReturn: 364.58,
    date: "2024-11-16",
  },
];

import { authService } from "./auth";

const API_BASE_URL = "http://localhost:8080/api";

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper para fazer requisições autenticadas
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const authHeaders = authService.getAuthHeaders();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  // Adiciona Authorization apenas se existir
  if (authHeaders.Authorization) {
    headers.Authorization = authHeaders.Authorization;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    authService.logout();
    window.location.reload();
    throw new Error("Sessão expirada");
  }

  return response;
};

// API functions
export const api = {
  // Transactions
  async getTransactions(
    page = 1,
    limit = 15,
    search = "",
    type = "all"
  ): Promise<PaginatedResponse<Transaction>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
      ...(type !== "all" && { type }),
    });

    const response = await fetchWithAuth(`/transactions?${params}`);

    if (!response.ok) {
      throw new Error("Erro ao buscar transações");
    }

    return response.json();
  },

  async createTransaction(
    transaction: Omit<Transaction, "id">
  ): Promise<Transaction> {
    const response = await fetchWithAuth("/transactions", {
      method: "POST",
      body: JSON.stringify(transaction),
    });

    if (!response.ok) {
      throw new Error("Erro ao criar transação");
    }

    return response.json();
  },

  // Investments
  async getInvestments(
    page = 1,
    limit = 10,
    search = ""
  ): Promise<PaginatedResponse<Investment>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
    });

    const response = await fetchWithAuth(`/investments?${params}`);

    if (!response.ok) {
      throw new Error("Erro ao buscar investimentos");
    }

    return response.json();
  },

  async createInvestment(
    investment: Omit<Investment, "id" | "monthlyReturn">
  ): Promise<Investment> {
    const response = await fetchWithAuth("/investments", {
      method: "POST",
      body: JSON.stringify(investment),
    });

    if (!response.ok) {
      throw new Error("Erro ao criar investimento");
    }

    return response.json();
  },

  async getDashboardSummary(): Promise<DashboardSummary> {
    const response = await fetchWithAuth("/dashboard/summary");

    if (!response.ok) {
      throw new Error("Erro ao buscar resumo do dashboard");
    }

    return response.json();
  },

  async getCategories(): Promise<Category[]> {
    const response = await fetchWithAuth("/categories");

    if (!response.ok) {
      throw new Error("Erro ao buscar categorias");
    }

    return response.json();
  },

  async getOverview(): Promise<OverviewData> {
    const response = await fetchWithAuth("/overview");

    if (!response.ok) {
      throw new Error("Erro ao buscar dados do overview");
    }

    return response.json();
  },

  // Fallback para overview com dados mock (caso a API não esteja implementada)
  async getOverviewMock(): Promise<OverviewData> {
    await delay(800);

    const totalIncome = mockTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = mockTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalInvestments = mockInvestments.reduce(
      (sum, inv) => sum + inv.amount,
      0
    );

    const balance = totalIncome - totalExpenses;

    return {
      summary: {
        balance,
        totalIncome,
        totalExpenses,
        totalInvestments,
      },
      balanceData: [
        { name: "Receitas", value: totalIncome, color: "#10b981" },
        { name: "Despesas", value: totalExpenses, color: "#ef4444" },
        { name: "Investimentos", value: totalInvestments, color: "#6b7280" },
      ],
      monthlyData: [
        {
          month: "Jan/23",
          receitas: 4800,
          despesas: 4200,
          saldo: 600,
          investimentos: 800,
        },
        {
          month: "Fev/23",
          receitas: 5100,
          despesas: 4400,
          saldo: 700,
          investimentos: 850,
        },
        {
          month: "Mar/23",
          receitas: 4900,
          despesas: 4600,
          saldo: 300,
          investimentos: 900,
        },
        {
          month: "Abr/23",
          receitas: 5300,
          despesas: 4500,
          saldo: 800,
          investimentos: 950,
        },
        {
          month: "Mai/23",
          receitas: 5200,
          despesas: 4700,
          saldo: 500,
          investimentos: 1000,
        },
        {
          month: "Jun/23",
          receitas: 5400,
          despesas: 4800,
          saldo: 600,
          investimentos: 1100,
        },
        {
          month: "Jul/23",
          receitas: 5600,
          despesas: 4900,
          saldo: 700,
          investimentos: 1150,
        },
        {
          month: "Ago/23",
          receitas: 5500,
          despesas: 5000,
          saldo: 500,
          investimentos: 1200,
        },
        {
          month: "Set/23",
          receitas: 5700,
          despesas: 5100,
          saldo: 600,
          investimentos: 1250,
        },
        {
          month: "Out/23",
          receitas: 5800,
          despesas: 5200,
          saldo: 600,
          investimentos: 1300,
        },
        {
          month: "Nov/23",
          receitas: 5900,
          despesas: 5300,
          saldo: 600,
          investimentos: 1350,
        },
        {
          month: "Dez/23",
          receitas: 6000,
          despesas: 5400,
          saldo: 600,
          investimentos: 1400,
        },
        {
          month: "Jan/24",
          receitas: 6100,
          despesas: 5500,
          saldo: 600,
          investimentos: 1450,
        },
        {
          month: "Fev/24",
          receitas: 6200,
          despesas: 5600,
          saldo: 600,
          investimentos: 1500,
        },
        {
          month: "Mar/24",
          receitas: 6300,
          despesas: 5700,
          saldo: 600,
          investimentos: 1550,
        },
        {
          month: "Abr/24",
          receitas: 6400,
          despesas: 5800,
          saldo: 600,
          investimentos: 1600,
        },
        {
          month: "Mai/24",
          receitas: 6500,
          despesas: 5900,
          saldo: 600,
          investimentos: 1650,
        },
        {
          month: "Jun/24",
          receitas: 6600,
          despesas: 6000,
          saldo: 600,
          investimentos: 1700,
        },
        {
          month: "Jul/24",
          receitas: 6700,
          despesas: 6100,
          saldo: 600,
          investimentos: 1750,
        },
        {
          month: "Ago/24",
          receitas: 6800,
          despesas: 6200,
          saldo: 600,
          investimentos: 1800,
        },
        {
          month: "Set/24",
          receitas: 6900,
          despesas: 6300,
          saldo: 600,
          investimentos: 1850,
        },
        {
          month: "Out/24",
          receitas: 7000,
          despesas: 6400,
          saldo: 600,
          investimentos: 1900,
        },
        {
          month: "Nov/24",
          receitas: 7100,
          despesas: 6500,
          saldo: 600,
          investimentos: 1950,
        },
        {
          month: "Dez/24",
          receitas: 7200,
          despesas: 6600,
          saldo: 600,
          investimentos: 2000,
        },
      ],
      expenseCategories: [
        { name: "Alimentação", value: 1850, color: "#ef4444" },
        { name: "Transporte", value: 920, color: "#f97316" },
        { name: "Moradia", value: 2200, color: "#eab308" },
        { name: "Lazer", value: 480, color: "#10b981" },
        { name: "Saúde", value: 650, color: "#3b82f6" },
        { name: "Educação", value: 320, color: "#8b5cf6" },
        { name: "Outros", value: 580, color: "#6b7280" },
      ],
      investmentTypes: [
        { name: "Renda Fixa", value: 45000, color: "#10b981", percentage: 65 },
        { name: "Fundos", value: 18000, color: "#3b82f6", percentage: 26 },
        { name: "Ações", value: 6000, color: "#f59e0b", percentage: 9 },
      ],
    };
  },
};
