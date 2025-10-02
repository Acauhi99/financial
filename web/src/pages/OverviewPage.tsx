import { Wallet, TrendingUp, DollarSign } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { useOverview } from "../hooks/useOverview";

export function OverviewPage() {
  const { data, isLoading, error } = useOverview();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-center py-8">
        Erro ao carregar dados do overview
      </div>
    );
  }

  const { balanceData, monthlyData, expenseCategories, summary } = data || {};

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Overview</h1>
        <p className="text-gray-600">Visão geral do estado da sua conta</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Saldo Total</p>
              <p className="text-2xl font-bold text-gray-900">
                R${" "}
                {summary?.balance?.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                }) || "0,00"}
              </p>
            </div>
            <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
              <Wallet size={20} className="text-gray-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Receitas</p>
              <p className="text-2xl font-bold text-green-600">
                R${" "}
                {summary?.totalIncome?.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                }) || "0,00"}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded flex items-center justify-center">
              <DollarSign size={20} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Despesas</p>
              <p className="text-2xl font-bold text-red-600">
                R${" "}
                {summary?.totalExpenses?.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                }) || "0,00"}
              </p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded flex items-center justify-center">
              <TrendingUp size={20} className="text-red-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Distribuição */}
        <div className="bg-white p-6 rounded border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Distribuição Financeira
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={balanceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {balanceData?.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-4 mt-4">
            {balanceData?.map((item) => (
              <div key={item.name} className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-gray-600">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Gráfico de Despesas por Categoria */}
        <div className="bg-white p-6 rounded border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Despesas por Categoria
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={expenseCategories || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Bar dataKey="value" fill="#6b7280" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Gráfico de Evolução Mensal */}
      <div className="bg-white p-6 rounded border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Evolução Mensal
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Line
                type="monotone"
                dataKey="receitas"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: "#10b981" }}
              />
              <Line
                type="monotone"
                dataKey="despesas"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ fill: "#ef4444" }}
              />
              <Line
                type="monotone"
                dataKey="saldo"
                stroke="#6b7280"
                strokeWidth={2}
                dot={{ fill: "#6b7280" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center space-x-6 mt-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Receitas</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Despesas</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Saldo</span>
          </div>
        </div>
      </div>
    </div>
  );
}
