import { type Investment } from "../../services/api";
import { formatCurrency, formatPercentage, formatDate } from "../../constants";
import type { Column } from "../ui/DataTable";

export const investmentColumns: Column<Investment>[] = [
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
  {
    key: "date",
    label: "Data",
    sortable: true,
    render: (inv) => (
      <div className="text-sm text-gray-600">{formatDate(inv.date)}</div>
    ),
  },
];
