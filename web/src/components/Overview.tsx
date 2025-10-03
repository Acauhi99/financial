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
  });

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
    type: "balance" | "expense" | "investment",
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-shrink-0">
        <MetricCard
          title="Saldo Total"
          value={summary?.balance || 0}
          icon={<Wallet size={16} className="text-gray-600" />}
          iconBgColor="bg-gray-100"
          valueColor="text-gray-900"
        />
        <MetricCard
          title="Receitas"
          value={summary?.totalIncome || 0}
          icon={<DollarSign size={16} className="text-green-600" />}
          iconBgColor="bg-green-100"
          valueColor="text-green-600"
        />
        <MetricCard
          title="Despesas"
          value={summary?.totalExpenses || 0}
          icon={<TrendingUp size={16} className="text-red-600" />}
          iconBgColor="bg-red-100"
          valueColor="text-red-600"
        />
      </div>

      {/* Layout em duas linhas */}
      <div className="flex-1 min-h-0 flex flex-col space-y-4">
        {/* Gráfico de Evolução Mensal */}
        <div className="h-1/2">
          <MonthlyEvolutionChart data={monthlyData || []} />
        </div>

        {/* Gráficos de Pizza */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-1/2">
          {/* Gráfico de Distribuição Financeira */}
          <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-shadow flex flex-col">
            <div className="flex items-center space-x-1 mb-2 flex-shrink-0">
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
          <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-shadow flex flex-col">
            <div className="flex items-center space-x-1 mb-2 flex-shrink-0">
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
          <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-shadow flex flex-col">
            <div className="flex items-center space-x-1 mb-2 flex-shrink-0">
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
