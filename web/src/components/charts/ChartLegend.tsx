interface LegendItem {
  name: string;
  color: string;
  value?: number;
}

interface ChartLegendProps {
  items: LegendItem[];
  showValues?: boolean;
  formatter?: (value: number) => string;
}

export function ChartLegend({
  items,
  showValues = false,
  formatter,
}: Readonly<ChartLegendProps>) {
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-4">
      {items.map((item) => (
        <div key={item.name} className="flex items-center space-x-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-sm text-gray-600">
            {item.name}
            {showValues && item.value !== undefined && formatter && (
              <span className="font-medium ml-1">
                ({formatter(item.value)})
              </span>
            )}
          </span>
        </div>
      ))}
    </div>
  );
}
