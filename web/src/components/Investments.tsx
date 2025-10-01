import { useState } from "react";
import { PiggyBank, TrendingUp, Plus, DollarSign, Percent } from "lucide-react";

interface Investment {
  id: number;
  name: string;
  amount: number;
  rate: number; // % do CDI
  monthlyReturn: number;
}

export function Investments() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("");

  const addInvestment = () => {
    if (!name || !amount || !rate) return;

    const investmentAmount = parseFloat(amount);
    const investmentRate = parseFloat(rate);
    const monthlyReturn = (investmentAmount * (investmentRate / 100)) / 12;

    const newInvestment: Investment = {
      id: Date.now(),
      name,
      amount: investmentAmount,
      rate: investmentRate,
      monthlyReturn,
    };

    setInvestments([...investments, newInvestment]);

    setName("");
    setAmount("");
    setRate("");
  };

  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalMonthlyReturn = investments.reduce(
    (sum, inv) => sum + inv.monthlyReturn,
    0
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Investimentos</h1>
        <p className="text-gray-600">
          Acompanhe seus investimentos e rendimentos
        </p>
      </div>

      {/* Resumo dos Investimentos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Investido
              </p>
              <p className="text-2xl font-bold text-gray-900">
                R$ {totalInvested.toFixed(2)}
              </p>
            </div>
            <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
              <PiggyBank size={20} className="text-gray-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Retorno Mensal
              </p>
              <p className="text-2xl font-bold text-green-600">
                R$ {totalMonthlyReturn.toFixed(2)}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded flex items-center justify-center">
              <TrendingUp size={20} className="text-green-600" />
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
            <h2 className="text-lg font-semibold text-gray-900">Novo Investimento</h2>
            <p className="text-sm text-gray-500">Adicione um investimento ao seu portfólio</p>
          </div>
        </div>
        
        <div className="space-y-4">
          {/* Nome do Investimento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Investimento</label>
            <input
              type="text"
              placeholder="Ex: Tesouro Selic, CDB Banco X, Fundo Y..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
          </div>
          
          {/* Valor e Taxa */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Valor Investido</label>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Taxa de Rendimento</label>
              <div className="relative">
                <Percent size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  placeholder="100"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  className="w-full pl-3 pr-10 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  step="0.01"
                  min="0"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">% do CDI (ex: 100 para 100% do CDI)</p>
            </div>
          </div>
          
          {/* Preview do Retorno */}
          {name && amount && rate && (
            <div className="bg-gray-50 p-4 rounded border">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Preview do Investimento</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Retorno Mensal Estimado:</span>
                  <p className="font-semibold text-green-600">
                    R$ {((parseFloat(amount) * (parseFloat(rate) / 100)) / 12).toFixed(2)}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Retorno Anual Estimado:</span>
                  <p className="font-semibold text-green-600">
                    R$ {(parseFloat(amount) * (parseFloat(rate) / 100)).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Botão */}
          <div className="flex justify-end pt-2">
            <button
              onClick={addInvestment}
              disabled={!name || !amount || !rate}
              className={`px-6 py-3 rounded font-medium transition-all flex items-center space-x-2 ${
                !name || !amount || !rate
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-900 text-white hover:bg-gray-800 shadow-sm hover:shadow-md'
              }`}
            >
              <Plus size={16} />
              <span>Adicionar Investimento</span>
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Investimentos */}
      <div className="bg-white rounded border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Portfólio</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {investments.map((investment) => (
            <div key={investment.id} className="p-6 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">
                    {investment.name}
                  </h3>
                  <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                    <span>R$ {investment.amount.toFixed(2)}</span>
                    <span>•</span>
                    <span>{investment.rate}% CDI</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">
                    +R$ {investment.monthlyReturn.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">por mês</p>
                </div>
              </div>
            </div>
          ))}
          {investments.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-gray-500">Nenhum investimento encontrado</p>
              <p className="text-sm text-gray-400 mt-1">
                Adicione seu primeiro investimento acima
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
