import { formatCurrency } from "../../constants";

interface TooltipPayloadEntry {
  value: number;
  name: string;
  color: string;
}

interface TooltipProps {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  label?: string;
  formatter?: (value: number) => string;
}

export function CustomTooltip({
  active,
  payload,
  label,
  formatter = formatCurrency,
}: Readonly<TooltipProps>) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
      {label && (
        <p className="text-sm font-medium text-gray-900 mb-2">{label}</p>
      )}
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center space-x-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-gray-600">{entry.name}:</span>
          <span className="text-sm font-medium text-gray-900">
            {formatter(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
}
