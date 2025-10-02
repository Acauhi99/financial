import { useState, useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Plus,
  DollarSign,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface Transaction {
  id: number;
  type: "income" | "expense";
  description: string;
  amount: number;
}

type FilterType = "all" | "income" | "expense";
type SortBy = "description" | "amount" | "type";
type SortOrder = "asc" | "desc";

export function Transactions() {
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

  const [transactions, setTransactions] =
    useState<Transaction[]>(mockTransactions);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");

  // Filtros e paginação
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [sortBy, setSortBy] = useState<SortBy>("description");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const addTransaction = () => {
    if (!description || !amount) return;

    const newTransaction: Transaction = {
      id: Date.now(),
      type,
      description,
      amount: parseFloat(amount),
    };

    setTransactions([...transactions, newTransaction]);
    setDescription("");
    setAmount("");
  };

  // Filtrar e ordenar transações
  const filteredAndSortedTransactions = useMemo(() => {
    const filtered = transactions.filter((transaction) => {
      const matchesSearch = transaction.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesType =
        filterType === "all" || transaction.type === filterType;
      return matchesSearch && matchesType;
    });

    filtered.sort((a, b) => {
      let aValue, bValue;

      if (sortBy === "description") {
        aValue = a.description;
        bValue = b.description;
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else if (sortBy === "amount") {
        aValue = a.amount;
        bValue = b.amount;
      } else {
        aValue = a.type;
        bValue = b.type;
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortOrder === "asc"
        ? Number(aValue) - Number(bValue)
        : Number(bValue) - Number(aValue);
    });

    return filtered;
  }, [transactions, searchTerm, filterType, sortBy, sortOrder]);

  // Paginação
  const totalPages = Math.ceil(
    filteredAndSortedTransactions.length / itemsPerPage
  );
  const paginatedTransactions = filteredAndSortedTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Transações</h1>
        <p className="text-gray-600">Gerencie suas receitas e despesas</p>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Receitas</p>
              <p className="text-2xl font-bold text-gray-900">
                R$ {totalIncome.toFixed(2)}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded flex items-center justify-center">
              <TrendingUp size={20} className="text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Despesas</p>
              <p className="text-2xl font-bold text-gray-900">
                R$ {totalExpenses.toFixed(2)}
              </p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded flex items-center justify-center">
              <TrendingDown size={20} className="text-red-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Saldo</p>
              <p
                className={`text-2xl font-bold ${
                  balance >= 0 ? "text-gray-900" : "text-red-600"
                }`}
              >
                R$ {balance.toFixed(2)}
              </p>
            </div>
            <div
              className={`w-10 h-10 rounded flex items-center justify-center ${
                balance >= 0 ? "bg-gray-100" : "bg-red-100"
              }`}
            >
              <Wallet
                size={20}
                className={balance >= 0 ? "text-gray-600" : "text-red-600"}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Formulário */}
      <div className="bg-white p-6 rounded border border-gray-200 shadow-sm">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center mr-3">
            <Plus size={20} className="text-gray-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Nova Transação
            </h2>
            <p className="text-sm text-gray-500">
              Adicione uma receita ou despesa
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Tipo de Transação */}
          <fieldset>
            <legend className="block text-sm font-medium text-gray-700 mb-2">
              Tipo
            </legend>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType("income")}
                className={`p-3 rounded border-2 transition-all flex items-center justify-center space-x-2 ${
                  type === "income"
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-gray-200 hover:border-gray-300 text-gray-600"
                }`}
              >
                <TrendingUp size={16} />
                <span>Receita</span>
              </button>
              <button
                type="button"
                onClick={() => setType("expense")}
                className={`p-3 rounded border-2 transition-all flex items-center justify-center space-x-2 ${
                  type === "expense"
                    ? "border-red-500 bg-red-50 text-red-700"
                    : "border-gray-200 hover:border-gray-300 text-gray-600"
                }`}
              >
                <TrendingDown size={16} />
                <span>Despesa</span>
              </button>
            </div>
          </fieldset>

          {/* Descrição e Valor */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Descrição
              </label>
              <input
                id="description"
                type="text"
                placeholder="Ex: Salário, Aluguel, Supermercado..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              />
            </div>
            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Valor
              </label>
              <div className="relative">
                <DollarSign
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  id="amount"
                  type="number"
                  placeholder="0,00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Botão */}
          <div className="flex justify-end pt-2">
            <button
              onClick={addTransaction}
              disabled={!description || !amount}
              className={`px-6 py-3 rounded font-medium transition-all flex items-center space-x-2 ${
                !description || !amount
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gray-900 text-white hover:bg-gray-800 shadow-sm hover:shadow-md"
              }`}
            >
              <Plus size={16} />
              <span>Adicionar Transação</span>
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Transações */}
      <div className="bg-white rounded border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Histórico</h2>
            <span className="text-sm text-gray-500">
              {filteredAndSortedTransactions.length} transações
            </span>
          </div>

          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Buscar transação..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterType}
                onChange={(e) => {
                  setFilterType(e.target.value as FilterType);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              >
                <option value="all">Todos</option>
                <option value="income">Receitas</option>
                <option value="expense">Despesas</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortBy)}
                className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              >
                <option value="description">Descrição</option>
                <option value="amount">Valor</option>
                <option value="type">Tipo</option>
              </select>
              <button
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
                className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                {sortOrder === "asc" ? "↑" : "↓"}
              </button>
            </div>
          </div>
        </div>

        {/* Tabela */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descrição
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {transaction.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        transaction.type === "income"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {transaction.type === "income" ? "Receita" : "Despesa"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className={`text-sm font-semibold ${
                        transaction.type === "income"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}R${" "}
                      {transaction.amount.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Mostrando {(currentPage - 1) * itemsPerPage + 1} a{" "}
              {Math.min(
                currentPage * itemsPerPage,
                filteredAndSortedTransactions.length
              )}{" "}
              de {filteredAndSortedTransactions.length} transações
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="px-3 py-1 text-sm">
                {currentPage} de {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {filteredAndSortedTransactions.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-gray-500">Nenhuma transação encontrada</p>
            <p className="text-sm text-gray-400 mt-1">
              {searchTerm || filterType !== "all"
                ? "Tente ajustar os filtros"
                : "Adicione sua primeira transação acima"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
