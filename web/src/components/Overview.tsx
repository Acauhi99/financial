import { Loading } from "./Loading";
import { MetricCard } from "./MetricCard";
import { ChartContainer } from "./charts/ChartContainer";
import { CustomTooltip } from "./charts/CustomTooltip";
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
import {
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  Tooltip,
  Legend,
} from "recharts";
import { useOverview } from "../hooks/useOverview";
import { COLORS, formatCurrency } from "../constants";
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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Overview</h1>
        <p className="text-gray-600">Visão geral do estado da sua conta</p>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Saldo Total"
          value={summary?.balance || 0}
          icon={<Wallet size={20} className="text-gray-600" />}
          iconBgColor="bg-gray-100"
          valueColor="text-gray-900"
        />
        <MetricCard
          title="Receitas"
          value={summary?.totalIncome || 0}
          icon={<DollarSign size={20} className="text-green-600" />}
          iconBgColor="bg-green-100"
          valueColor="text-green-600"
        />
        <MetricCard
          title="Despesas"
          value={summary?.totalExpenses || 0}
          icon={<TrendingUp size={20} className="text-red-600" />}
          iconBgColor="bg-red-100"
          valueColor="text-red-600"
        />
      </div>

      {/* Gráfico de Evolução Mensal - Destaque Principal */}
      <ChartContainer title="Evolução Mensal" className="ring-2 ring-blue-100">
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fontSize: 14 }} />
              <YAxis tick={{ fontSize: 14 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="receitas"
                stroke={COLORS.CHART.GREEN}
                strokeWidth={4}
                dot={{ fill: COLORS.CHART.GREEN, strokeWidth: 3, r: 6 }}
                name="Receitas"
              />
              <Line
                type="monotone"
                dataKey="despesas"
                stroke={COLORS.CHART.RED}
                strokeWidth={4}
                dot={{ fill: COLORS.CHART.RED, strokeWidth: 3, r: 6 }}
                name="Despesas"
              />
              <Line
                type="monotone"
                dataKey="saldo"
                stroke={COLORS.CHART.INDIGO}
                strokeWidth={4}
                dot={{ fill: COLORS.CHART.INDIGO, strokeWidth: 3, r: 6 }}
                name="Saldo"
              />
              <Line
                type="monotone"
                dataKey="investimentos"
                stroke={COLORS.CHART.TEAL}
                strokeWidth={4}
                dot={{ fill: COLORS.CHART.TEAL, strokeWidth: 3, r: 6 }}
                name="Investimentos"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartContainer>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Gráfico de Distribuição Financeira */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center space-x-3 mb-6">
            <CircleDollarSign size={24} className="text-gray-600" />
            <h3 className="text-xl font-semibold text-gray-900">
              Distribuição Financeira
            </h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={balanceDataWithTotal}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={3}
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
          <InteractiveChartLegend
            items={balanceData || []}
            hiddenItems={hiddenItems.balance}
            onToggleItem={(name) => toggleItem("balance", name)}
            showValues
            formatter={formatCurrency}
          />
        </div>

        {/* Gráfico de Tipos de Investimento */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center space-x-3 mb-6">
            <TrendingUpIcon size={24} className="text-gray-600" />
            <h3 className="text-xl font-semibold text-gray-900">
              Distribuição de Investimentos
            </h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={investmentTypesWithTotal}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
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
          <InteractiveChartLegend
            items={investmentTypes || []}
            hiddenItems={hiddenItems.investment}
            onToggleItem={(name) => toggleItem("investment", name)}
            showValues
            formatter={formatCurrency}
          />
        </div>

        {/* Gráfico de Despesas por Categoria */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center space-x-3 mb-6">
            <BarChart3 size={24} className="text-gray-600" />
            <h3 className="text-xl font-semibold text-gray-900">
              Despesas por Categoria
            </h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseCategoriesWithTotal}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
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
  );
}
