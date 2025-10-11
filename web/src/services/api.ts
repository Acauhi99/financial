import { authService } from "./auth";
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

const API_BASE_URL = "http://localhost:8080/api";

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
};
