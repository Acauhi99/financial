import { useState } from "react";
import { TrendingUp, Plus, DollarSign, Loader2 } from "lucide-react";
import { useInvestments, useCreateInvestment } from "../hooks/useInvestments";
import { DataTable, type Column } from "../components/DataTable";
import { type Investment } from "../services/api";

type FilterType = "all" | "stocks" | "bonds" | "crypto";

export function InvestmentsPage() {
  const [symbol, setSymbol] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState<"stocks" | "bonds" | "crypto">("stocks");

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [sortBy, setSortBy] = useState<"name" | "amount" | "rate">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const { data, isLoading, error } = useInvestments(
    currentPage,
    itemsPerPage,
    searchTerm
  );
  const createMutation = useCreateInvestment();

  const addInvestment = () => {
    if (!symbol || !quantity || !price) return;

    createMutation.mutate(
      {
        name: symbol,
        amount: parseInt(quantity) * parseFloat(price),
        rate: 100,
      },
      {
        onSuccess: () => {
          setSymbol("");
          setQuantity("");
          setPrice("");
        },
      }
    );
  };

  const allInvestments = data?.data || [];
  const totalValue = allInvestments.reduce((sum, inv) => sum + inv.amount, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount);
  };

  const columns: Column<Investment>[] = [
    {
      key: "name",
      label: "Nome",
      sortable: true,
    },
    {
      key: "amount",
      label: "Valor Investido",
      sortable: true,
      render: (investment) => formatCurrency(investment.amount),
    },
    {
      key: "rate",
      label: "Taxa (%)",
      sortable: true,
      render: (investment) => `${investment.rate}%`,
    },
    {
      key: "monthlyReturn",
      label: "Retorno Mensal",
      render: (investment) => (
        <div className="text-sm font-semibold text-green-600">
          {formatCurrency(investment.monthlyReturn)}
        </div>
      ),
    },
  ];

  const filters = (
    <select
      value={filterType}
      onChange={(e) => {
        setFilterType(e.target.value as FilterType);
        setCurrentPage(1);
      }}
      className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent"
    >
      <option value="all">Todos os tipos</option>
      <option value="stocks">Ações</option>
      <option value="bonds">Títulos</option>
      <option value="crypto">Crypto</option>
    </select>
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
        <p className="text-gray-600">Gerencie sua carteira de investimentos</p>
      </div>

      {/* Resumo */}
      <div className="bg-white p-6 rounded border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">
              Valor Total da Carteira
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(totalValue)}
            </p>
          </div>
          <div className="w-10 h-10 bg-green-100 rounded flex items-center justify-center">
            <TrendingUp size={20} className="text-green-600" />
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
              Adicione um investimento à sua carteira
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Tipo de Investimento */}
          <fieldset>
            <legend className="block text-sm font-medium text-gray-700 mb-2">
              Tipo
            </legend>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setType("stocks")}
                className={`p-3 rounded border-2 transition-all text-center ${
                  type === "stocks"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 hover:border-gray-300 text-gray-600"
                }`}
              >
                Ações
              </button>
              <button
                type="button"
                onClick={() => setType("bonds")}
                className={`p-3 rounded border-2 transition-all text-center ${
                  type === "bonds"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 hover:border-gray-300 text-gray-600"
                }`}
              >
                Títulos
              </button>
              <button
                type="button"
                onClick={() => setType("crypto")}
                className={`p-3 rounded border-2 transition-all text-center ${
                  type === "crypto"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 hover:border-gray-300 text-gray-600"
                }`}
              >
                Crypto
              </button>
            </div>
          </fieldset>

          {/* Campos do formulário */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="investment-symbol"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Símbolo
              </label>
              <input
                id="investment-symbol"
                type="text"
                placeholder="Ex: PETR4, ITUB4..."
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              />
            </div>
            <div>
              <label
                htmlFor="investment-quantity"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Quantidade
              </label>
              <input
                id="investment-quantity"
                type="number"
                placeholder="100"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                min="1"
              />
            </div>
            <div>
              <label
                htmlFor="investment-price"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Preço
              </label>
              <div className="relative">
                <DollarSign
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  id="investment-price"
                  type="number"
                  placeholder="25.50"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
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
              onClick={addInvestment}
              disabled={
                !symbol || !quantity || !price || createMutation.isPending
              }
              className={`px-6 py-3 rounded font-medium transition-all flex items-center space-x-2 ${
                !symbol || !quantity || !price || createMutation.isPending
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
            <h2 className="text-lg font-semibold text-gray-900">Carteira</h2>
            <span className="text-sm text-gray-500">
              {data?.pagination.total || 0} investimentos
            </span>
          </div>
        </div>

        <div className="p-6">
          <DataTable
            data={allInvestments}
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

          {!isLoading && allInvestments.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-gray-500">Nenhum investimento encontrado</p>
              <p className="text-sm text-gray-400 mt-1">
                {searchTerm || filterType !== "all"
                  ? "Tente ajustar os filtros"
                  : "Adicione seu primeiro investimento acima"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
