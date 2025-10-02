import { useState } from "react";
import { PiggyBank, TrendingUp, Plus, DollarSign, Percent } from "lucide-react";
import { useInvestments, useCreateInvestment } from "../hooks/useInvestments";
import { DataTable, type Column } from "./DataTable";
import { type Investment } from "../services/api";

export function Investments() {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<
    "name" | "amount" | "rate" | "monthlyReturn"
  >("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  const allInvestments = data?.data || [];
  const totalInvested = allInvestments.reduce(
    (sum, inv) => sum + inv.amount,
    0
  );
  const totalMonthlyReturn = allInvestments.reduce(
    (sum, inv) => sum + inv.monthlyReturn,
    0
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount);
  };

  const columns: Column<Investment>[] = [
    { key: "name", label: "Nome", sortable: true },
    {
      key: "amount",
      label: "Valor Investido",
      sortable: true,
      render: (inv) => (
        <span className="font-semibold">{formatCurrency(inv.amount)}</span>
      ),
    },
    {
      key: "rate",
      label: "Taxa (% CDI)",
      sortable: true,
      render: (inv) => <span>{inv.rate}%</span>,
    },
    {
      key: "monthlyReturn",
      label: "Retorno Mensal",
      sortable: true,
      render: (inv) => (
        <span className="text-green-600 font-semibold">
          {formatCurrency(inv.monthlyReturn)}
        </span>
      ),
    },
  ];

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  : "bg-gray-900 text-white hover:bg-gray-800 shadow-sm hover:shadow-md"
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
          />

          {!isLoading && allInvestments.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-gray-500">Nenhum investimento encontrado</p>
              <p className="text-sm text-gray-400 mt-1">
                {searchTerm
                  ? "Tente ajustar a busca"
                  : "Adicione seu primeiro investimento acima"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
