import { PiggyBank, TrendingUp, Percent } from "lucide-react";
import { formatCurrency, formatPercentage, CSS_CLASSES } from "../../constants";

interface InvestmentsSummaryProps {
  totalInvested: number;
  totalMonthlyReturn: number;
  averageRate: number;
}

export function InvestmentsSummary({
  totalInvested,
  totalMonthlyReturn,
  averageRate,
}: Readonly<InvestmentsSummaryProps>) {
  return (
    <div className={CSS_CLASSES.GRID_METRICS}>
      <div className={CSS_CLASSES.CARD}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-600">Total Investido</p>
            <p className="text-lg font-bold text-gray-900">
              {formatCurrency(totalInvested)}
            </p>
          </div>
          <div className={`${CSS_CLASSES.ICON_CONTAINER} bg-gray-100`}>
            <PiggyBank size={20} className="text-gray-600" />
          </div>
        </div>
      </div>
      <div className={CSS_CLASSES.CARD}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-600">Retorno Mensal</p>
            <p className="text-lg font-bold text-green-600">
              {formatCurrency(totalMonthlyReturn)}
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
            <p className="text-xs font-medium text-gray-600">Taxa Média</p>
            <p className="text-lg font-bold text-blue-600">
              {formatPercentage(averageRate)} CDI
            </p>
          </div>
          <div className={`${CSS_CLASSES.ICON_CONTAINER} bg-blue-100`}>
            <Percent size={20} className="text-blue-600" />
          </div>
        </div>
      </div>
    </div>
  );
}
