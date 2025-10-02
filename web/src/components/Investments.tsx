import { useState, useMemo } from "react";
import {
  PiggyBank,
  TrendingUp,
  Plus,
  DollarSign,
  Percent,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface Investment {
  id: number;
  name: string;
  amount: number;
  rate: number; // % do CDI
  monthlyReturn: number;
}

export function Investments() {
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
    {
      id: 3,
      name: "LCI Santander",
      amount: 12000,
      rate: 95,
      monthlyReturn: 95,
    },
    {
      id: 4,
      name: "Tesouro IPCA+ 2035",
      amount: 20000,
      rate: 105,
      monthlyReturn: 175,
    },
    { id: 5, name: "CDB Nubank", amount: 5000, rate: 108, monthlyReturn: 45 },
    {
      id: 6,
      name: "Fundo DI XP",
      amount: 7500,
      rate: 98,
      monthlyReturn: 61.25,
    },
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
    {
      id: 11,
      name: "CRI Kinea",
      amount: 4000,
      rate: 125,
      monthlyReturn: 41.67,
    },
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
    {
      id: 17,
      name: "CDB Sofisa",
      amount: 7000,
      rate: 113,
      monthlyReturn: 65.92,
    },
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

  const [investments, setInvestments] = useState<Investment[]>(mockInvestments);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("");

  // Filtros e paginação
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<
    "name" | "amount" | "rate" | "monthlyReturn"
  >("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const addInvestment = () => {
    if (!name || !amount || !rate) return;

    const investmentAmount = parseFloat(amount);
    const investmentRate = parseFloat(rate);
    const monthlyReturn = (investmentAmount * (investmentRate / 100)) / 12;

    const newInvestment: Investment = {
      id: Date.now(),
      name,
      amount: investmentAmount,
      rate: investmentRate,
      monthlyReturn,
    };

    setInvestments([...investments, newInvestment]);

    setName("");
    setAmount("");
    setRate("");
  };

  // Filtrar e ordenar investimentos
  const filteredAndSortedInvestments = useMemo(() => {
    const filtered = investments.filter((inv) =>
      inv.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortOrder === "asc"
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });

    return filtered;
  }, [investments, searchTerm, sortBy, sortOrder]);

  // Paginação
  const totalPages = Math.ceil(
    filteredAndSortedInvestments.length / itemsPerPage
  );
  const paginatedInvestments = filteredAndSortedInvestments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalMonthlyReturn = investments.reduce(
    (sum, inv) => sum + inv.monthlyReturn,
    0
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Investimentos</h1>
        <p className="text-gray-600">
          Acompanhe seus investimentos e rendimentos
        </p>
      </div>

      {/* Resumo dos Investimentos */}
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
          {/* Nome do Investimento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Investimento
            </label>
            <input
              type="text"
              placeholder="Ex: Tesouro Selic, CDB Banco X, Fundo Y..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
          </div>

          {/* Valor e Taxa */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor Investido
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Taxa de Rendimento
              </label>
              <div className="relative">
                <Percent
                  size={16}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="number"
                  placeholder="100"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  className="w-full pl-3 pr-10 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  step="0.01"
                  min="0"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                % do CDI (ex: 100 para 100% do CDI)
              </p>
            </div>
          </div>

          {/* Preview do Retorno */}
          {name && amount && rate && (
            <div className="bg-gray-50 p-4 rounded border">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Preview do Investimento
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">
                    Retorno Mensal Estimado:
                  </span>
                  <p className="font-semibold text-green-600">
                    R${" "}
                    {(
                      (parseFloat(amount) * (parseFloat(rate) / 100)) /
                      12
                    ).toFixed(2)}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Retorno Anual Estimado:</span>
                  <p className="font-semibold text-green-600">
                    R${" "}
                    {(parseFloat(amount) * (parseFloat(rate) / 100)).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Botão */}
          <div className="flex justify-end pt-2">
            <button
              onClick={addInvestment}
              disabled={!name || !amount || !rate}
              className={`px-6 py-3 rounded font-medium transition-all flex items-center space-x-2 ${
                !name || !amount || !rate
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gray-900 text-white hover:bg-gray-800 shadow-sm hover:shadow-md"
              }`}
            >
              <Plus size={16} />
              <span>Adicionar Investimento</span>
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
              {filteredAndSortedInvestments.length} investimentos
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
                placeholder="Buscar investimento..."
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
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              >
                <option value="name">Nome</option>
                <option value="amount">Valor</option>
                <option value="rate">Taxa</option>
                <option value="monthlyReturn">Retorno</option>
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
                  Investimento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Taxa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Retorno/Mês
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedInvestments.map((investment) => (
                <tr key={investment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {investment.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      R${" "}
                      {investment.amount.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {investment.rate}% CDI
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-green-600">
                      +R$ {investment.monthlyReturn.toFixed(2)}
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
                filteredAndSortedInvestments.length
              )}{" "}
              de {filteredAndSortedInvestments.length} investimentos
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

        {filteredAndSortedInvestments.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-gray-500">Nenhum investimento encontrado</p>
            <p className="text-sm text-gray-400 mt-1">
              {searchTerm
                ? "Tente ajustar os filtros"
                : "Adicione seu primeiro investimento acima"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
