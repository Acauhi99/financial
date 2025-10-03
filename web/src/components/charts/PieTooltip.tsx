import { formatCurrency } from "../../constants";

interface TooltipPayload {
  value: number;
  name: string;
  color: string;
  payload: {
    total: number;
  };
}

interface PieTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

export function PieTooltip({ active, payload }: Readonly<PieTooltipProps>) {
  if (!active || !payload?.length) return null;

  const data = payload[0];
  const percentage = ((data.value / data.payload.total) * 100).toFixed(1);

  return (
    <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
      <div className="flex items-center space-x-2">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: data.color }}
        />
        <span className="text-sm text-gray-600">{data.name}:</span>
        <span className="text-sm font-medium text-gray-900">
          {formatCurrency(data.value)} ({percentage}%)
        </span>
      </div>
    </div>
  );
}
