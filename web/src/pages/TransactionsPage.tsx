import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Plus,
  DollarSign,
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import {
  useTransactions,
  useCreateTransaction,
} from "../hooks/useTransactions";

export function TransactionsPage() {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");

  // Filtros e paginação
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">(
    "all"
  );
  const [sortBy, setSortBy] = useState<"description" | "amount" | "type">(
    "description"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const { data, isLoading, error } = useTransactions(
    currentPage,
    itemsPerPage,
    searchTerm,
    filterType
  );
  const createMutation = useCreateTransaction();

  const addTransaction = () => {
    if (!description || !amount) return;

    createMutation.mutate(
      {
        type,
        description,
        amount: parseFloat(amount),
      },
      {
        onSuccess: () => {
          setDescription("");
          setAmount("");
        },
      }
    );
  };

  // Calcular totais dos dados carregados
  const allTransactions = data?.data || [];
  const totalIncome = allTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = allTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-2">Erro ao carregar transações</p>
          <p className="text-sm text-gray-500">Tente novamente mais tarde</p>
        </div>
      </div>
    );
  }

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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo
            </label>
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
          </div>

          {/* Descrição e Valor */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição
              </label>
              <input
                type="text"
                placeholder="Ex: Salário, Aluguel, Supermercado..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor
              </label>
              <div className="relative">
                <DollarSign
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
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
              disabled={!description || !amount || createMutation.isPending}
              className={`px-6 py-3 rounded font-medium transition-all flex items-center space-x-2 ${
                !description || !amount || createMutation.isPending
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gray-900 text-white hover:bg-gray-800 shadow-sm hover:shadow-md"
              }`}
            >
              {createMutation.isPending ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Plus size={16} />
              )}
              <span>
                {createMutation.isPending
                  ? "Adicionando..."
                  : "Adicionar Transação"}
              </span>
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
              {data?.pagination.total || 0} transações
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
                  setFilterType(e.target.value as any);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              >
                <option value="all">Todos</option>
                <option value="income">Receitas</option>
                <option value="expense">Despesas</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabela */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 size={32} className="animate-spin text-gray-400" />
            </div>
          ) : (
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
                {allTransactions.map((transaction) => (
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
          )}
        </div>

        {/* Paginação */}
        {data && data.pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Mostrando {(currentPage - 1) * itemsPerPage + 1} a{" "}
              {Math.min(currentPage * itemsPerPage, data.pagination.total)} de{" "}
              {data.pagination.total} transações
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
                {currentPage} de {data.pagination.totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage(
                    Math.min(data.pagination.totalPages, currentPage + 1)
                  )
                }
                disabled={currentPage === data.pagination.totalPages}
                className="p-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {!isLoading && allTransactions.length === 0 && (
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
