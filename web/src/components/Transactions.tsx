import { useState } from "react";
import { TrendingUp, TrendingDown, Wallet, Plus, DollarSign } from "lucide-react";

interface Transaction {
  id: number;
  type: "income" | "expense";
  description: string;
  amount: number;
}

export function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");

  const addTransaction = () => {
    if (!description || !amount) return;

    const newTransaction: Transaction = {
      id: Date.now(),
      type,
      description,
      amount: parseFloat(amount),
    };

    setTransactions([...transactions, newTransaction]);
    setDescription("");
    setAmount("");
  };

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Transações</h1>
        <p className="text-gray-600">Gerencie suas receitas e despesas</p>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Receitas</p>
              <p className="text-2xl font-bold text-gray-900">
                R$ {totalIncome.toFixed(2)}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded flex items-center justify-center">
              <TrendingUp size={20} className="text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Despesas</p>
              <p className="text-2xl font-bold text-gray-900">
                R$ {totalExpenses.toFixed(2)}
              </p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded flex items-center justify-center">
              <TrendingDown size={20} className="text-red-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Saldo</p>
              <p
                className={`text-2xl font-bold ${
                  balance >= 0 ? "text-gray-900" : "text-red-600"
                }`}
              >
                R$ {balance.toFixed(2)}
              </p>
            </div>
            <div
              className={`w-10 h-10 rounded flex items-center justify-center ${
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

      {/* Formulário */}
      <div className="bg-white p-6 rounded border border-gray-200 shadow-sm">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center mr-3">
            <Plus size={20} className="text-gray-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Nova Transação</h2>
            <p className="text-sm text-gray-500">Adicione uma receita ou despesa</p>
          </div>
        </div>
        
        <div className="space-y-4">
          {/* Tipo de Transação */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType('income')}
                className={`p-3 rounded border-2 transition-all flex items-center justify-center space-x-2 ${
                  type === 'income'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <TrendingUp size={16} />
                <span>Receita</span>
              </button>
              <button
                type="button"
                onClick={() => setType('expense')}
                className={`p-3 rounded border-2 transition-all flex items-center justify-center space-x-2 ${
                  type === 'expense'
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <TrendingDown size={16} />
                <span>Despesa</span>
              </button>
            </div>
          </div>
          
          {/* Descrição e Valor */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
              <input
                type="text"
                placeholder="Ex: Salário, Aluguel, Supermercado..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Valor</label>
              <div className="relative">
                <DollarSign size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  placeholder="0,00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>
          </div>
          
          {/* Botão */}
          <div className="flex justify-end pt-2">
            <button
              onClick={addTransaction}
              disabled={!description || !amount}
              className={`px-6 py-3 rounded font-medium transition-all flex items-center space-x-2 ${
                !description || !amount
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-900 text-white hover:bg-gray-800 shadow-sm hover:shadow-md'
              }`}
            >
              <Plus size={16} />
              <span>Adicionar Transação</span>
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Transações */}
      <div className="bg-white rounded border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Histórico</h2>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="p-4 border-b border-gray-100 last:border-b-0 flex justify-between items-center hover:bg-gray-50"
            >
              <div>
                <p className="font-medium text-gray-900">
                  {transaction.description}
                </p>
                <p className="text-sm text-gray-500">
                  {transaction.type === "income" ? "Receita" : "Despesa"}
                </p>
              </div>
              <p
                className={`font-semibold ${
                  transaction.type === "income"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {transaction.type === "income" ? "+" : "-"}R${" "}
                {transaction.amount.toFixed(2)}
              </p>
            </div>
          ))}
          {transactions.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-gray-500">Nenhuma transação encontrada</p>
              <p className="text-sm text-gray-400 mt-1">
                Adicione sua primeira transação acima
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
