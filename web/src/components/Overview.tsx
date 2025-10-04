import { Loading } from "./Loading";
import { MetricCard } from "./MetricCard";
import { MonthlyEvolutionChart } from "./charts/MonthlyEvolutionChart";
import { PieTooltip } from "./charts/PieTooltip";
import { InteractiveChartLegend } from "./charts/InteractiveChartLegend";
import {
  BarChart3,
  TrendingUp as TrendingUpIcon,
  Wallet,
  TrendingUp,
  DollarSign,
  CircleDollarSign,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useOverview } from "../hooks/useOverview";
import { formatCurrency } from "../constants";
import { useState } from "react";

export function Overview() {
  const { data, isLoading, error } = useOverview();

  const [hiddenItems, setHiddenItems] = useState({
    balance: new Set<string>(),
    expense: new Set<string>(),
    investment: new Set<string>(),
    monthly: new Set<string>(),
  });

  const [timePeriod, setTimePeriod] = useState("12");

  const {
    balanceData,
    monthlyData,
    expenseCategories,
    investmentTypes,
    summary,
  } = data || {};

  const filteredBalanceData = (balanceData || []).filter(
    (item) => !hiddenItems.balance.has(item.name)
  );
  const filteredExpenseData = (expenseCategories || []).filter(
    (item) => !hiddenItems.expense.has(item.name)
  );
  const filteredInvestmentData = (investmentTypes || []).filter(
    (item) => !hiddenItems.investment.has(item.name)
  );

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="text-red-600 text-center py-8">
        Erro ao carregar dados do overview
      </div>
    );
  }

  const toggleItem = (
    type: "balance" | "expense" | "investment" | "monthly",
    itemName: string
  ) => {
    setHiddenItems((prev) => {
      const newSet = new Set(prev[type]);
      if (newSet.has(itemName)) {
        newSet.delete(itemName);
      } else {
        newSet.add(itemName);
      }
      return { ...prev, [type]: newSet };
    });
  };

  const balanceTotal = filteredBalanceData.reduce(
    (sum, item) => sum + item.value,
    0
  );
  const expenseTotal = filteredExpenseData.reduce(
    (sum, item) => sum + item.value,
    0
  );
  const investmentTotal = filteredInvestmentData.reduce(
    (sum, item) => sum + item.value,
    0
  );

  const balanceDataWithTotal = filteredBalanceData.map((item) => ({
    ...item,
    total: balanceTotal,
  }));
  const expenseCategoriesWithTotal = filteredExpenseData.map((item) => ({
    ...item,
    total: expenseTotal,
  }));
  const investmentTypesWithTotal = filteredInvestmentData.map((item) => ({
    ...item,
    total: investmentTotal,
  }));

  return (
    <div className="h-full flex flex-col space-y-4 overflow-hidden">
      <div className="flex-shrink-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Overview</h1>
        <p className="text-gray-600 text-base">
          Visão geral do estado da sua conta
        </p>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-shrink-0">
        <div className="relative">
          <MetricCard
            title="Saldo Total"
            value={summary?.balance || 0}
            icon={<Wallet size={16} className="text-gray-600" />}
            iconBgColor="bg-gray-100"
            valueColor="text-gray-900"
            isActive={!hiddenItems.monthly.has("saldo")}
          />
          <button
            onClick={() => toggleItem("monthly", "saldo")}
            className={`absolute top-2 right-2 w-6 h-6 rounded-full text-xs font-bold transition-colors cursor-pointer ${
              hiddenItems.monthly.has("saldo")
                ? "bg-gray-300 text-gray-600"
                : "bg-blue-500 text-white"
            }`}
          >
            {hiddenItems.monthly.has("saldo") ? "✕" : "✓"}
          </button>
        </div>

        <div className="relative">
          <MetricCard
            title="Receitas"
            value={summary?.totalIncome || 0}
            icon={<DollarSign size={16} className="text-green-600" />}
            iconBgColor="bg-green-100"
            valueColor="text-green-600"
            isActive={!hiddenItems.monthly.has("receitas")}
          />
          <button
            onClick={() => toggleItem("monthly", "receitas")}
            className={`absolute top-2 right-2 w-6 h-6 rounded-full text-xs font-bold transition-colors cursor-pointer ${
              hiddenItems.monthly.has("receitas")
                ? "bg-gray-300 text-gray-600"
                : "bg-green-500 text-white"
            }`}
          >
            {hiddenItems.monthly.has("receitas") ? "✕" : "✓"}
          </button>
        </div>

        <div className="relative">
          <MetricCard
            title="Despesas"
            value={summary?.totalExpenses || 0}
            icon={<TrendingUp size={16} className="text-red-600" />}
            iconBgColor="bg-red-100"
            valueColor="text-red-600"
            isActive={!hiddenItems.monthly.has("despesas")}
          />
          <button
            onClick={() => toggleItem("monthly", "despesas")}
            className={`absolute top-2 right-2 w-6 h-6 rounded-full text-xs font-bold transition-colors cursor-pointer ${
              hiddenItems.monthly.has("despesas")
                ? "bg-gray-300 text-gray-600"
                : "bg-red-500 text-white"
            }`}
          >
            {hiddenItems.monthly.has("despesas") ? "✕" : "✓"}
          </button>
        </div>

        <div className="relative">
          <MetricCard
            title="Investimentos"
            value={summary?.totalInvestments || 0}
            icon={<TrendingUpIcon size={16} className="text-purple-600" />}
            iconBgColor="bg-purple-100"
            valueColor="text-purple-600"
            isActive={!hiddenItems.monthly.has("investimentos")}
          />
          <button
            onClick={() => toggleItem("monthly", "investimentos")}
            className={`absolute top-2 right-2 w-6 h-6 rounded-full text-xs font-bold transition-colors cursor-pointer ${
              hiddenItems.monthly.has("investimentos")
                ? "bg-gray-300 text-gray-600"
                : "bg-purple-500 text-white"
            }`}
          >
            {hiddenItems.monthly.has("investimentos") ? "✕" : "✓"}
          </button>
        </div>
      </div>

      {/* Layout em duas linhas */}
      <div className="flex-1 min-h-0 flex flex-col space-y-4">
        {/* Gráfico de Evolução Mensal */}
        <div className="h-1/2">
          <MonthlyEvolutionChart
            data={monthlyData || []}
            hiddenLines={hiddenItems.monthly}
            onToggleLine={(name) => toggleItem("monthly", name)}
            timePeriod={timePeriod}
            onTimePeriodChange={setTimePeriod}
          />
        </div>

        {/* Gráficos de Pizza */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-1/2">
          {/* Gráfico de Distribuição Financeira */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-md hover:shadow-xl hover:shadow-gray-300/70 transition-all duration-300 flex flex-col focus:outline-none">
            <div className="flex items-center space-x-2 mb-3 flex-shrink-0">
              <CircleDollarSign size={20} className="text-gray-600" />
              <h3 className="text-sm font-semibold text-gray-900">
                Distribuição Financeira
              </h3>
            </div>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={balanceDataWithTotal}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {balanceDataWithTotal?.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-shrink-0">
              <InteractiveChartLegend
                items={balanceData || []}
                hiddenItems={hiddenItems.balance}
                onToggleItem={(name) => toggleItem("balance", name)}
                showValues
                formatter={formatCurrency}
              />
            </div>
          </div>

          {/* Gráfico de Tipos de Investimento */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-md hover:shadow-xl hover:shadow-gray-300/70 transition-all duration-300 flex flex-col focus:outline-none">
            <div className="flex items-center space-x-2 mb-3 flex-shrink-0">
              <TrendingUpIcon size={20} className="text-gray-600" />
              <h3 className="text-sm font-semibold text-gray-900">
                Distribuição de Investimentos
              </h3>
            </div>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={investmentTypesWithTotal}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                  >
                    {investmentTypesWithTotal?.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-shrink-0">
              <InteractiveChartLegend
                items={investmentTypes || []}
                hiddenItems={hiddenItems.investment}
                onToggleItem={(name) => toggleItem("investment", name)}
                showValues
                formatter={formatCurrency}
              />
            </div>
          </div>

          {/* Gráfico de Despesas por Categoria */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-md hover:shadow-xl hover:shadow-gray-300/70 transition-all duration-300 flex flex-col focus:outline-none">
            <div className="flex items-center space-x-2 mb-3 flex-shrink-0">
              <BarChart3 size={20} className="text-gray-600" />
              <h3 className="text-sm font-semibold text-gray-900">
                Despesas por Categoria
              </h3>
            </div>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseCategoriesWithTotal}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                  >
                    {expenseCategoriesWithTotal?.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-shrink-0">
              <InteractiveChartLegend
                items={expenseCategories || []}
                hiddenItems={hiddenItems.expense}
                onToggleItem={(name) => toggleItem("expense", name)}
                showValues
                formatter={formatCurrency}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
