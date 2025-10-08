import { Plus, DollarSign, Percent } from "lucide-react";
import { CSS_CLASSES } from "../../utils/constants";

interface InvestmentFormProps {
  name: string;
  amount: string;
  rate: string;
  isLoading: boolean;
  errors: Record<string, string>;
  onNameChange: (value: string) => void;
  onAmountChange: (value: string) => void;
  onRateChange: (value: string) => void;
  onSubmit: () => void;
}

export function InvestmentForm({
  name,
  amount,
  rate,
  isLoading,
  errors,
  onNameChange,
  onAmountChange,
  onRateChange,
  onSubmit,
}: Readonly<InvestmentFormProps>) {
  return (
    <div className={CSS_CLASSES.CARD}>
      <div className="flex items-center mb-3">
        <div
          className={`w-6 h-6 rounded flex items-center justify-center bg-gray-100 mr-2`}
        >
          <Plus size={14} className="text-gray-600" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-900">
            Novo Investimento
          </h2>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <label htmlFor="investment-name" className={CSS_CLASSES.LABEL}>
            Nome do Investimento
          </label>
          <input
            id="investment-name"
            type="text"
            placeholder="Ex: Tesouro Selic, CDB Banco X, Fundo Y..."
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            className={`${CSS_CLASSES.INPUT} ${
              errors.name ? "border-red-500 focus:ring-red-500" : ""
            }`}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label htmlFor="investment-amount" className={CSS_CLASSES.LABEL}>
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
                onChange={(e) => onAmountChange(e.target.value)}
                className={`${CSS_CLASSES.INPUT_WITH_ICON} ${
                  errors.amount ? "border-red-500 focus:ring-red-500" : ""
                }`}
                step="0.01"
                min="0"
              />
            </div>
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
            )}
          </div>
          <div>
            <label htmlFor="investment-rate" className={CSS_CLASSES.LABEL}>
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
                onChange={(e) => onRateChange(e.target.value)}
                className={`${CSS_CLASSES.INPUT_WITH_ICON} ${
                  errors.rate ? "border-red-500 focus:ring-red-500" : ""
                }`}
                step="0.01"
                min="0"
              />
            </div>
            {errors.rate && (
              <p className="mt-1 text-sm text-red-600">{errors.rate}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button
            onClick={onSubmit}
            disabled={!name || !amount || !rate || isLoading}
            className={
              !name || !amount || !rate || isLoading
                ? CSS_CLASSES.BUTTON_DISABLED
                : CSS_CLASSES.BUTTON_PRIMARY
            }
          >
            <Plus size={16} />
            <span>
              {isLoading ? "Adicionando..." : "Adicionar Investimento"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
