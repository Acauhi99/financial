import { Eye, EyeOff } from "lucide-react";

interface LegendItem {
  name: string;
  color: string;
  value?: number;
}

interface InteractiveChartLegendProps {
  items: LegendItem[];
  hiddenItems: Set<string>;
  onToggleItem: (itemName: string) => void;
  showValues?: boolean;
  formatter?: (value: number) => string;
}

export function InteractiveChartLegend({
  items,
  hiddenItems,
  onToggleItem,
  showValues = false,
  formatter,
}: Readonly<InteractiveChartLegendProps>) {
  return (
    <div className="grid grid-cols-1 gap-2 mt-4">
      {items.map((item) => (
        <button
          key={item.name}
          onClick={() => onToggleItem(item.name)}
          className={`flex items-center justify-between px-2 py-1.5 text-sm rounded transition-all cursor-pointer ${
            hiddenItems.has(item.name)
              ? "text-gray-500 opacity-60"
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          <div className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{
                backgroundColor: hiddenItems.has(item.name)
                  ? "#9ca3af"
                  : item.color,
              }}
            />
            <span className="font-medium text-left">{item.name}</span>
          </div>
          <div className="flex items-center space-x-2">
            {showValues && item.value !== undefined && formatter && (
              <span className="text-xs opacity-75">
                {formatter(item.value)}
              </span>
            )}
            {hiddenItems.has(item.name) ? (
              <EyeOff size={12} />
            ) : (
              <Eye size={12} />
            )}
          </div>
        </button>
      ))}
    </div>
  );
}
