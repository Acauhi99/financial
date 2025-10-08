export function useFormValidation() {
  const validateRequired = (value: string, fieldName: string): string => {
    if (!value.trim()) {
      return `${fieldName} é obrigatório`;
    }
    return "";
  };

  const validateNumber = (value: string, fieldName: string): string => {
    const num = parseFloat(value);
    if (isNaN(num) || num <= 0) {
      return `${fieldName} deve ser um número maior que zero`;
    }
    return "";
  };

  const validateTransaction = (description: string, amount: string) => {
    const errors: Record<string, string> = {};

    const descError = validateRequired(description, "Descrição");
    if (descError) errors.description = descError;

    const amountError = validateNumber(amount, "Valor");
    if (amountError) errors.amount = amountError;

    return errors;
  };

  const validateInvestment = (name: string, amount: string, rate: string) => {
    const errors: Record<string, string> = {};

    const nameError = validateRequired(name, "Nome");
    if (nameError) errors.name = nameError;

    const amountError = validateNumber(amount, "Valor");
    if (amountError) errors.amount = amountError;

    const rateError = validateNumber(rate, "Taxa");
    if (rateError) errors.rate = rateError;

    return errors;
  };

  return {
    validateTransaction,
    validateInvestment,
  };
}
