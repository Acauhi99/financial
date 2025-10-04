import { TrendingUp, TrendingDown, Plus, DollarSign } from "lucide-react";
import { CSS_CLASSES } from "../../constants";

interface TransactionFormProps {
  description: string;
  amount: string;
  type: "income" | "expense";
  isLoading: boolean;
  errors: Record<string, string>;
  onDescriptionChange: (value: string) => void;
  onAmountChange: (value: string) => void;
  onTypeChange: (type: "income" | "expense") => void;
  onSubmit: () => void;
}

export function TransactionForm({
  description,
  amount,
  type,
  isLoading,
  errors,
  onDescriptionChange,
  onAmountChange,
  onTypeChange,
  onSubmit,
}: Readonly<TransactionFormProps>) {
  return (
    <div className={CSS_CLASSES.CARD}>
      <div className="flex items-center mb-6">
        <div className={`${CSS_CLASSES.ICON_CONTAINER} bg-gray-100 mr-3`}>
          <Plus size={20} className="text-gray-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Nova Transação
          </h2>
          <p className="text-sm text-gray-500">
            Adicione uma receita ou despesa
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <fieldset>
          <legend className={CSS_CLASSES.LABEL}>Tipo</legend>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onTypeChange("income")}
              className={`p-3 rounded border-2 transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                type === "income"
                  ? "border-green-500 bg-green-50 text-green-700"
                  : "border-gray-200 hover:border-gray-300 text-gray-600"
              }`}
            >
              <TrendingUp size={16} />
              <span>Receita</span>
            </button>
            <button
              type="button"
              onClick={() => onTypeChange("expense")}
              className={`p-3 rounded border-2 transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                type === "expense"
                  ? "border-red-500 bg-red-50 text-red-700"
                  : "border-gray-200 hover:border-gray-300 text-gray-600"
              }`}
            >
              <TrendingDown size={16} />
              <span>Despesa</span>
            </button>
          </div>
        </fieldset>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="transaction-description"
              className={CSS_CLASSES.LABEL}
            >
              Descrição
            </label>
            <input
              id="transaction-description"
              type="text"
              placeholder="Ex: Salário, Aluguel, Supermercado..."
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              className={`${CSS_CLASSES.INPUT} ${errors.description ? 'border-red-500 focus:ring-red-500' : ''}`}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>
          <div>
            <label htmlFor="transaction-amount" className={CSS_CLASSES.LABEL}>
              Valor
            </label>
            <div className="relative">
              <DollarSign
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                id="transaction-amount"
                type="number"
                placeholder="0,00"
                value={amount}
                onChange={(e) => onAmountChange(e.target.value)}
                className={`${CSS_CLASSES.INPUT_WITH_ICON} ${errors.amount ? 'border-red-500 focus:ring-red-500' : ''}`}
                step="0.01"
                min="0"
              />
            </div>
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onSubmit}
            disabled={!description || !amount || isLoading}
            className={
              !description || !amount || isLoading
                ? CSS_CLASSES.BUTTON_DISABLED
                : CSS_CLASSES.BUTTON_PRIMARY
            }
          >
            <Plus size={16} />
            <span>{isLoading ? "Adicionando..." : "Adicionar Transação"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
