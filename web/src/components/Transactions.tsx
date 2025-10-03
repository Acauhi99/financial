import { useState, useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Plus,
  DollarSign,
  Filter,
  X,
} from "lucide-react";
import {
  useTransactions,
  useCreateTransaction,
} from "../hooks/useTransactions";
import { DataTable, type Column } from "./DataTable";
import { type Transaction } from "../services/api";
import {
  formatCurrency,
  PAGINATION,
  FILTER_OPTIONS,
  filterByAmountRange,
} from "../constants";

type FilterType = "all" | "income" | "expense";
type AmountRangeType =
  | "all"
  | "0-100"
  | "100-500"
  | "500-1000"
  | "1000-5000"
  | "5000+";
type SortableValue = string | number | Date;

export function Transactions() {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [amountRange, setAmountRange] = useState<AmountRangeType>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<"description" | "amount" | "type">(
    "description"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = PAGINATION.ITEMS_PER_PAGE;

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

  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = data?.data || [];

    if (filterType !== "all") {
      filtered = filtered.filter((t) => t.type === filterType);
    }

    if (amountRange !== "all") {
      filtered = filtered.filter((t) =>
        filterByAmountRange(t.amount, amountRange)
      );
    }

    if (searchTerm) {
      filtered = filtered.filter((t) =>
        t.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    const sorted = [...filtered];
    sorted.sort((a, b) => {
      const aValue: SortableValue = a[sortBy as keyof Transaction];
      const bValue: SortableValue = b[sortBy as keyof Transaction];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
    return sorted;
  }, [data, sortBy, sortOrder, filterType, amountRange, searchTerm]);
  const totalIncome = filteredAndSortedTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = filteredAndSortedTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  const columns: Column<Transaction>[] = [
    {
      key: "description",
      label: "Descrição",
      sortable: true,
      render: (transaction) => (
        <div className="font-medium text-gray-900">
          {transaction.description}
        </div>
      ),
    },
    {
      key: "type",
      label: "Tipo",
      sortable: true,
      render: (transaction) => (
        <span
          className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full ${
            transaction.type === "income"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {transaction.type === "income" ? (
            <TrendingUp className="w-3 h-3 mr-1" />
          ) : (
            <TrendingDown className="w-3 h-3 mr-1" />
          )}
          {transaction.type === "income" ? "Receita" : "Despesa"}
        </span>
      ),
    },
    {
      key: "amount",
      label: "Valor",
      sortable: true,
      render: (transaction) => (
        <div
          className={`text-sm font-bold ${
            transaction.type === "income" ? "text-green-600" : "text-red-600"
          }`}
        >
          {transaction.type === "income" ? "+" : "-"}
          {formatCurrency(transaction.amount)}
        </div>
      ),
    },
  ];

  const clearFilters = () => {
    setFilterType("all");
    setAmountRange("all");
    setSearchTerm("");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    filterType !== "all" || amountRange !== "all" || searchTerm;

  const filters = (
    <>
      <button
        onClick={() => setShowFilters(!showFilters)}
        className={`flex items-center space-x-2 px-3 py-2 border rounded-md text-sm font-medium transition-colors cursor-pointer ${
          hasActiveFilters
            ? "border-gray-500 bg-gray-100 text-gray-700"
            : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
        }`}
      >
        <Filter className="w-4 h-4" />
        <span>Filtros</span>
        {hasActiveFilters && (
          <span className="bg-gray-500 text-white text-xs px-1.5 py-0.5 rounded-full">
            {
              [filterType !== "all", amountRange !== "all", searchTerm].filter(
                Boolean
              ).length
            }
          </span>
        )}
      </button>

      {showFilters && (
        <div className="flex flex-wrap gap-2">
          <select
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value as FilterType);
              setCurrentPage(1);
            }}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white cursor-pointer"
          >
            {FILTER_OPTIONS.TRANSACTION_TYPES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={amountRange}
            onChange={(e) => {
              setAmountRange(e.target.value as AmountRangeType);
              setCurrentPage(1);
            }}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white cursor-pointer"
          >
            {FILTER_OPTIONS.AMOUNT_RANGES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50 bg-white cursor-pointer"
            >
              <X className="w-4 h-4" />
              <span>Limpar</span>
            </button>
          )}
        </div>
      )}
    </>
  );

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
          <fieldset>
            <legend className="block text-sm font-medium text-gray-700 mb-2">
              Tipo
            </legend>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType("income")}
                className={`p-3 rounded border-2 transition-all flex items-center justify-center space-x-2 cursor-pointer ${
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
                className={`p-3 rounded border-2 transition-all flex items-center justify-center space-x-2 cursor-pointer ${
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="transaction-description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Descrição
              </label>
              <input
                id="transaction-description"
                type="text"
                placeholder="Ex: Salário, Aluguel, Supermercado..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              />
            </div>
            <div>
              <label
                htmlFor="transaction-amount"
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
                  id="transaction-amount"
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

          <div className="flex justify-end pt-2">
            <button
              onClick={addTransaction}
              disabled={!description || !amount || createMutation.isPending}
              className={`px-6 py-3 rounded font-medium transition-all flex items-center space-x-2 ${
                !description || !amount || createMutation.isPending
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gray-900 text-white hover:bg-gray-800 shadow-sm hover:shadow-md cursor-pointer"
              }`}
            >
              <Plus size={16} />
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
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                {isLoading
                  ? "Carregando..."
                  : `${Math.min(
                      (currentPage - 1) * itemsPerPage +
                        filteredAndSortedTransactions.length,
                      data?.pagination.total || 0
                    )} de ${data?.pagination.total || 0} transações`}
              </span>
              {hasActiveFilters && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  Filtros ativos
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="p-6">
          <DataTable
            data={filteredAndSortedTransactions}
            columns={columns}
            loading={isLoading}
            error={error ? String(error) : null}
            searchValue={searchTerm}
            onSearchChange={(value) => {
              setSearchTerm(value);
              setCurrentPage(1);
            }}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={(key) => {
              if (sortBy === key) {
                setSortOrder(sortOrder === "asc" ? "desc" : "asc");
              } else {
                setSortBy(key as typeof sortBy);
                setSortOrder("asc");
              }
            }}
            currentPage={currentPage}
            totalPages={data?.pagination.totalPages || 1}
            onPageChange={setCurrentPage}
            filters={filters}
          />

          {!isLoading && filteredAndSortedTransactions.length === 0 && (
            <div className="p-8 text-center">
              <div className="max-w-sm mx-auto">
                <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">
                  Nenhuma transação encontrada
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  {hasActiveFilters
                    ? "Tente ajustar os filtros ou limpar a busca"
                    : "Adicione sua primeira transação acima"}
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="mt-3 text-sm text-gray-600 hover:text-gray-800 underline cursor-pointer"
                  >
                    Limpar todos os filtros
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
