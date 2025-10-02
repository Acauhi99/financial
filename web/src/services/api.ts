// Interfaces
export interface Transaction {
  id: number;
  type: "income" | "expense";
  description: string;
  amount: number;
}

export interface Investment {
  id: number;
  name: string;
  amount: number;
  rate: number;
  monthlyReturn: number;
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

// Mock data
const mockTransactions: Transaction[] = [
  { id: 1, type: "income", description: "Salário", amount: 8500 },
  { id: 2, type: "expense", description: "Aluguel", amount: 2200 },
  { id: 3, type: "expense", description: "Supermercado Extra", amount: 450 },
  { id: 4, type: "income", description: "Freelance Design", amount: 1200 },
  { id: 5, type: "expense", description: "Conta de Luz", amount: 180 },
  { id: 6, type: "expense", description: "Internet", amount: 120 },
  { id: 7, type: "expense", description: "Gasolina", amount: 320 },
  { id: 8, type: "income", description: "Dividendos Ações", amount: 280 },
  { id: 9, type: "expense", description: "Restaurante", amount: 85 },
  { id: 10, type: "expense", description: "Farmácia", amount: 65 },
  { id: 11, type: "income", description: "Venda Produto", amount: 350 },
  { id: 12, type: "expense", description: "Academia", amount: 89 },
  { id: 13, type: "expense", description: "Uber", amount: 45 },
  { id: 14, type: "income", description: "Cashback Cartão", amount: 25 },
  { id: 15, type: "expense", description: "Netflix", amount: 32 },
  { id: 16, type: "expense", description: "Spotify", amount: 17 },
  { id: 17, type: "expense", description: "Padaria", amount: 28 },
  { id: 18, type: "income", description: "Consultoria", amount: 800 },
  { id: 19, type: "expense", description: "Posto de Gasolina", amount: 280 },
  {
    id: 20,
    type: "expense",
    description: "Supermercado Pão de Açúcar",
    amount: 380,
  },
  { id: 21, type: "income", description: "Rendimento Poupança", amount: 45 },
  { id: 22, type: "expense", description: "Conta de Água", amount: 95 },
  { id: 23, type: "expense", description: "Plano de Saúde", amount: 420 },
  { id: 24, type: "income", description: "Venda Usados", amount: 150 },
  { id: 25, type: "expense", description: "Shopping", amount: 220 },
  { id: 26, type: "expense", description: "Mecânico", amount: 350 },
  { id: 27, type: "income", description: "Bônus Trabalho", amount: 500 },
  { id: 28, type: "expense", description: "Dentista", amount: 180 },
  { id: 29, type: "expense", description: "Livros", amount: 75 },
  { id: 30, type: "income", description: "Aluguel Imóvel", amount: 1800 },
  { id: 31, type: "expense", description: "Seguro Carro", amount: 280 },
  { id: 32, type: "expense", description: "Celular", amount: 85 },
  { id: 33, type: "income", description: "Projeto Extra", amount: 650 },
  { id: 34, type: "expense", description: "Cinema", amount: 40 },
  { id: 35, type: "expense", description: "Lanchonete", amount: 25 },
  { id: 36, type: "income", description: "Reembolso", amount: 120 },
  { id: 37, type: "expense", description: "Roupas", amount: 180 },
  { id: 38, type: "expense", description: "Transporte Público", amount: 150 },
  { id: 39, type: "income", description: "Vendas Online", amount: 420 },
  { id: 40, type: "expense", description: "Veterinário", amount: 200 },
  {
    id: 41,
    type: "expense",
    description: "Supermercado Carrefour",
    amount: 310,
  },
  {
    id: 42,
    type: "income",
    description: "Trabalho Fim de Semana",
    amount: 300,
  },
  { id: 43, type: "expense", description: "Lavanderia", amount: 35 },
  { id: 44, type: "expense", description: "Correios", amount: 15 },
  { id: 45, type: "income", description: "Prêmio Seguro", amount: 180 },
  { id: 46, type: "expense", description: "Material Escritório", amount: 90 },
  { id: 47, type: "expense", description: "Cabeleireiro", amount: 60 },
  { id: 48, type: "income", description: "Aulas Particulares", amount: 400 },
  { id: 49, type: "expense", description: "Pizza", amount: 55 },
  { id: 50, type: "expense", description: "Estacionamento", amount: 20 },
];

const mockInvestments: Investment[] = [
  {
    id: 1,
    name: "Tesouro Selic 2029",
    amount: 15000,
    rate: 100,
    monthlyReturn: 125,
  },
  {
    id: 2,
    name: "CDB Banco Inter",
    amount: 8500,
    rate: 110,
    monthlyReturn: 77.92,
  },
  { id: 3, name: "LCI Santander", amount: 12000, rate: 95, monthlyReturn: 95 },
  {
    id: 4,
    name: "Tesouro IPCA+ 2035",
    amount: 20000,
    rate: 105,
    monthlyReturn: 175,
  },
  { id: 5, name: "CDB Nubank", amount: 5000, rate: 108, monthlyReturn: 45 },
  { id: 6, name: "Fundo DI XP", amount: 7500, rate: 98, monthlyReturn: 61.25 },
  { id: 7, name: "LCA Itaú", amount: 10000, rate: 102, monthlyReturn: 85 },
  {
    id: 8,
    name: "Tesouro Prefixado 2027",
    amount: 6000,
    rate: 112,
    monthlyReturn: 56,
  },
  {
    id: 9,
    name: "CDB BTG Pactual",
    amount: 18000,
    rate: 115,
    monthlyReturn: 172.5,
  },
  {
    id: 10,
    name: "Fundo Multimercado",
    amount: 25000,
    rate: 120,
    monthlyReturn: 250,
  },
  { id: 11, name: "CRI Kinea", amount: 4000, rate: 125, monthlyReturn: 41.67 },
  {
    id: 12,
    name: "Debênture Petrobras",
    amount: 15000,
    rate: 118,
    monthlyReturn: 147.5,
  },
  {
    id: 13,
    name: "LCI C6 Bank",
    amount: 9000,
    rate: 103,
    monthlyReturn: 77.25,
  },
  {
    id: 14,
    name: "CDB Original",
    amount: 11000,
    rate: 109,
    monthlyReturn: 99.92,
  },
  {
    id: 15,
    name: "Tesouro IPCA+ 2045",
    amount: 30000,
    rate: 106,
    monthlyReturn: 265,
  },
  {
    id: 16,
    name: "Fundo Imobiliário HGLG11",
    amount: 8000,
    rate: 95,
    monthlyReturn: 63.33,
  },
  { id: 17, name: "CDB Sofisa", amount: 7000, rate: 113, monthlyReturn: 65.92 },
  {
    id: 18,
    name: "LCA Bradesco",
    amount: 13000,
    rate: 101,
    monthlyReturn: 109.42,
  },
  {
    id: 19,
    name: "CRI Habitat",
    amount: 5500,
    rate: 122,
    monthlyReturn: 55.92,
  },
  {
    id: 20,
    name: "Tesouro Selic 2026",
    amount: 22000,
    rate: 99,
    monthlyReturn: 181.5,
  },
  {
    id: 21,
    name: "CDB Banco Pan",
    amount: 6500,
    rate: 107,
    monthlyReturn: 58.04,
  },
  {
    id: 22,
    name: "Fundo DI Itaú",
    amount: 14000,
    rate: 97,
    monthlyReturn: 113.17,
  },
  {
    id: 23,
    name: "LCI XP Investimentos",
    amount: 16000,
    rate: 104,
    monthlyReturn: 138.67,
  },
  {
    id: 24,
    name: "CDB Banco do Brasil",
    amount: 9500,
    rate: 100,
    monthlyReturn: 79.17,
  },
  {
    id: 25,
    name: "Debênture Vale",
    amount: 12500,
    rate: 116,
    monthlyReturn: 120.83,
  },
  {
    id: 26,
    name: "Tesouro Prefixado 2030",
    amount: 18500,
    rate: 111,
    monthlyReturn: 171.21,
  },
  {
    id: 27,
    name: "CRI Votorantim",
    amount: 7800,
    rate: 119,
    monthlyReturn: 77.35,
  },
  { id: 28, name: "LCA Caixa", amount: 10500, rate: 96, monthlyReturn: 84 },
  { id: 29, name: "CDB Rico", amount: 8200, rate: 114, monthlyReturn: 77.97 },
  {
    id: 30,
    name: "Fundo Multimercado BTG",
    amount: 35000,
    rate: 125,
    monthlyReturn: 364.58,
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// API functions
export const api = {
  // Transactions
  async getTransactions(
    page = 1,
    limit = 15,
    search = "",
    type = "all"
  ): Promise<PaginatedResponse<Transaction>> {
    await delay(800);

    const filtered = mockTransactions.filter(
      (t) =>
        t.description.toLowerCase().includes(search.toLowerCase()) &&
        (type === "all" || t.type === type)
    );

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const data = filtered.slice(start, start + limit);

    return {
      data,
      pagination: { page, limit, total, totalPages },
    };
  },

  async createTransaction(
    transaction: Omit<Transaction, "id">
  ): Promise<Transaction> {
    await delay(500);
    const newTransaction = { ...transaction, id: Date.now() };
    mockTransactions.unshift(newTransaction);
    return newTransaction;
  },

  // Investments
  async getInvestments(
    page = 1,
    limit = 10,
    search = ""
  ): Promise<PaginatedResponse<Investment>> {
    await delay(800);

    const filtered = mockInvestments.filter((inv) =>
      inv.name.toLowerCase().includes(search.toLowerCase())
    );

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const data = filtered.slice(start, start + limit);

    return {
      data,
      pagination: { page, limit, total, totalPages },
    };
  },

  async createInvestment(
    investment: Omit<Investment, "id" | "monthlyReturn">
  ): Promise<Investment> {
    await delay(500);
    const monthlyReturn = (investment.amount * (investment.rate / 100)) / 12;
    const newInvestment = { ...investment, id: Date.now(), monthlyReturn };
    mockInvestments.unshift(newInvestment);
    return newInvestment;
  },
};
