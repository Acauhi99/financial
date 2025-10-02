import { useState, useMemo } from "react";
import {
  PiggyBank,
  TrendingUp,
  Plus,
  DollarSign,
  Percent,
  Filter,
  X,
} from "lucide-react";
import { useInvestments, useCreateInvestment } from "../hooks/useInvestments";
import { DataTable, type Column } from "./DataTable";
import { type Investment } from "../services/api";
import {
  PAGINATION,
  formatCurrency,
  FILTER_OPTIONS,
  filterByAmountRange,
  filterByRateRange,
  formatPercentage,
} from "../constants";

type AmountRangeType =
  | "all"
  | "0-100"
  | "100-500"
  | "500-1000"
  | "1000-5000"
  | "5000+";
type RateRangeType = "all" | "0-50" | "50-80" | "80-100" | "100+";

export function Investments() {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [amountRange, setAmountRange] = useState<AmountRangeType>("all");
  const [rateRange, setRateRange] = useState<RateRangeType>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<
    "name" | "amount" | "rate" | "monthlyReturn"
  >("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = PAGINATION.ITEMS_PER_PAGE;

  const { data, isLoading, error } = useInvestments(
    currentPage,
    itemsPerPage,
    searchTerm
  );
  const createMutation = useCreateInvestment();

  const addInvestment = () => {
    if (!name || !amount || !rate) return;

    createMutation.mutate(
      { name, amount: parseFloat(amount), rate: parseFloat(rate) },
      {
        onSuccess: () => {
          setName("");
          setAmount("");
          setRate("");
        },
      }
    );
  };

  const filteredAndSortedInvestments = useMemo(() => {
    let filtered = data?.data || [];

    // Aplicar filtros
    if (amountRange !== "all") {
      filtered = filtered.filter((inv) =>
        filterByAmountRange(inv.amount, amountRange)
      );
    }

    if (rateRange !== "all") {
      filtered = filtered.filter((inv) =>
        filterByRateRange(inv.rate, rateRange)
      );
    }

    // Aplicar busca
    if (searchTerm) {
      filtered = filtered.filter((inv) =>
        inv.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Ordenar
    const sorted = [...filtered];
    sorted.sort((a, b) => {
      const aValue = a[sortBy as keyof Investment];
      const bValue = b[sortBy as keyof Investment];

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
  }, [data, sortBy, sortOrder, amountRange, rateRange, searchTerm]);

  const totalInvested = filteredAndSortedInvestments.reduce(
    (sum, inv) => sum + inv.amount,
    0
  );
  const totalMonthlyReturn = filteredAndSortedInvestments.reduce(
    (sum, inv) => sum + inv.monthlyReturn,
    0
  );
  const averageRate =
    filteredAndSortedInvestments.length > 0
      ? filteredAndSortedInvestments.reduce((sum, inv) => sum + inv.rate, 0) /
        filteredAndSortedInvestments.length
      : 0;

  const columns: Column<Investment>[] = [
    {
      key: "name",
      label: "Nome",
      sortable: true,
      render: (inv) => (
        <div className="font-medium text-gray-900">{inv.name}</div>
      ),
    },
    {
      key: "amount",
      label: "Valor Investido",
      sortable: true,
      render: (inv) => (
        <span className="font-bold text-gray-900">
          {formatCurrency(inv.amount)}
        </span>
      ),
    },
    {
      key: "rate",
      label: "Taxa (% CDI)",
      sortable: true,
      render: (inv) => {
        const getRateColor = (rate: number) => {
          if (rate >= 100) return "text-green-600";
          if (rate >= 80) return "text-blue-600";
          return "text-orange-600";
        };

        return (
          <div className="flex items-center space-x-1">
            <span className={`font-semibold ${getRateColor(inv.rate)}`}>
              {formatPercentage(inv.rate)}
            </span>
            <span className="text-xs text-gray-500">CDI</span>
          </div>
        );
      },
    },
    {
      key: "monthlyReturn",
      label: "Retorno Mensal",
      sortable: true,
      render: (inv) => (
        <span className="text-green-600 font-bold">
          {formatCurrency(inv.monthlyReturn)}
        </span>
      ),
    },
  ];

  const clearFilters = () => {
    setAmountRange("all");
    setRateRange("all");
    setSearchTerm("");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    amountRange !== "all" || rateRange !== "all" || searchTerm;

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
              [amountRange !== "all", rateRange !== "all", searchTerm].filter(
                Boolean
              ).length
            }
          </span>
        )}
      </button>

      {showFilters && (
        <div className="flex flex-wrap gap-2">
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

          <select
            value={rateRange}
            onChange={(e) => {
              setRateRange(e.target.value as RateRangeType);
              setCurrentPage(1);
            }}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white cursor-pointer"
          >
            {FILTER_OPTIONS.INVESTMENT_RATES.map((option) => (
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
          <p className="text-red-600 mb-2">Erro ao carregar investimentos</p>
          <p className="text-sm text-gray-500">Tente novamente mais tarde</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Investimentos</h1>
        <p className="text-gray-600">
          Acompanhe seus investimentos e rendimentos
        </p>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Investido
              </p>
              <p className="text-2xl font-bold text-gray-900">
                R$ {totalInvested.toFixed(2)}
              </p>
            </div>
            <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
              <PiggyBank size={20} className="text-gray-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Retorno Mensal
              </p>
              <p className="text-2xl font-bold text-green-600">
                R$ {totalMonthlyReturn.toFixed(2)}
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
              <p className="text-sm font-medium text-gray-600">Taxa Média</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatPercentage(averageRate)} CDI
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center">
              <Percent size={20} className="text-blue-600" />
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
              Novo Investimento
            </h2>
            <p className="text-sm text-gray-500">
              Adicione um investimento ao seu portfólio
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="investment-name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Nome do Investimento
            </label>
            <input
              id="investment-name"
              type="text"
              placeholder="Ex: Tesouro Selic, CDB Banco X, Fundo Y..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="investment-amount"
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
                  id="investment-amount"
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
            <div>
              <label
                htmlFor="investment-rate"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Taxa (% do CDI)
              </label>
              <div className="relative">
                <Percent
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  id="investment-rate"
                  type="number"
                  placeholder="100"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={addInvestment}
              disabled={!name || !amount || !rate || createMutation.isPending}
              className={`px-6 py-3 rounded font-medium transition-all flex items-center space-x-2 ${
                !name || !amount || !rate || createMutation.isPending
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gray-900 text-white hover:bg-gray-800 shadow-sm hover:shadow-md cursor-pointer"
              }`}
            >
              <Plus size={16} />
              <span>
                {createMutation.isPending
                  ? "Adicionando..."
                  : "Adicionar Investimento"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Investimentos */}
      <div className="bg-white rounded border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Portfólio</h2>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                {isLoading
                  ? "Carregando..."
                  : `${Math.min(
                      (currentPage - 1) * itemsPerPage +
                        filteredAndSortedInvestments.length,
                      data?.pagination.total || 0
                    )} de ${data?.pagination.total || 0} investimentos`}
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
            data={filteredAndSortedInvestments}
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

          {!isLoading && filteredAndSortedInvestments.length === 0 && (
            <div className="p-8 text-center">
              <div className="max-w-sm mx-auto">
                <PiggyBank className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">
                  Nenhum investimento encontrado
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  {hasActiveFilters
                    ? "Tente ajustar os filtros ou limpar a busca"
                    : "Adicione seu primeiro investimento acima"}
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
