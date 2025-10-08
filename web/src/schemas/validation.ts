import { z } from "zod";

export const transactionSchema = z.object({
  description: z
    .string()
    .min(1, "Descrição é obrigatória")
    .min(3, "Descrição deve ter pelo menos 3 caracteres")
    .max(100, "Descrição deve ter no máximo 100 caracteres"),
  amount: z
    .string()
    .min(1, "Valor é obrigatório")
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) > 0,
      "Valor deve ser maior que zero"
    ),
  type: z.enum(["income", "expense"], {
    message: "Tipo deve ser receita ou despesa",
  }),
});

export const investmentSchema = z.object({
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  amount: z
    .string()
    .min(1, "Valor é obrigatório")
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) > 0,
      "Valor deve ser maior que zero"
    ),
  rate: z
    .string()
    .min(1, "Taxa é obrigatória")
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) >= 0,
      "Taxa deve ser maior ou igual a zero"
    ),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;
export type InvestmentFormData = z.infer<typeof investmentSchema>;
