import { TrendingUp, TrendingDown } from "lucide-react";
import { type Transaction } from "../../services/api";
import { formatCurrency, formatDate } from "../../utils/constants";
import type { Column } from "../ui/DataTable";

export const transactionColumns: Column<Transaction>[] = [
  {
    key: "description",
    label: "Descrição",
    sortable: true,
    render: (transaction) => (
      <div className="font-medium text-gray-900">{transaction.description}</div>
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
  {
    key: "date",
    label: "Data",
    sortable: true,
    render: (transaction) => (
      <div className="text-sm text-gray-600">
        {formatDate(transaction.date)}
      </div>
    ),
  },
];
