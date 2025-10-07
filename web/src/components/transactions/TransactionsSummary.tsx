import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { formatCurrency, CSS_CLASSES } from "../../constants";

interface TransactionsSummaryProps {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

export function TransactionsSummary({
  totalIncome,
  totalExpenses,
  balance,
}: Readonly<TransactionsSummaryProps>) {
  return (
    <div className={CSS_CLASSES.GRID_METRICS}>
      <div className={CSS_CLASSES.CARD}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-600">Receitas</p>
            <p className="text-lg font-bold text-green-600">
              {formatCurrency(totalIncome)}
            </p>
          </div>
          <div className={`${CSS_CLASSES.ICON_CONTAINER} bg-green-100`}>
            <TrendingUp size={20} className="text-green-600" />
          </div>
        </div>
      </div>
      <div className={CSS_CLASSES.CARD}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-600">Despesas</p>
            <p className="text-lg font-bold text-red-600">
              {formatCurrency(totalExpenses)}
            </p>
          </div>
          <div className={`${CSS_CLASSES.ICON_CONTAINER} bg-red-100`}>
            <TrendingDown size={20} className="text-red-600" />
          </div>
        </div>
      </div>
      <div className={CSS_CLASSES.CARD}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-600">Saldo</p>
            <p
              className={`text-lg font-bold ${
                balance >= 0 ? "text-gray-900" : "text-red-600"
              }`}
            >
              {formatCurrency(balance)}
            </p>
          </div>
          <div
            className={`${CSS_CLASSES.ICON_CONTAINER} ${
              balance >= 0 ? "bg-gray-100" : "bg-red-100"
            }`}
          >
            <Wallet
              size={20}
              className={balance >= 0 ? "text-gray-600" : "text-red-600"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
