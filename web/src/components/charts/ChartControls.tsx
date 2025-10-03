import { useState } from "react";
import { ArrowUpDown, Eye, EyeOff } from "lucide-react";

type SortOrder = "asc" | "desc" | "none";

interface ChartDataItem {
  name: string;
  value: number;
  color: string;
}

interface ChartControlsProps {
  data: ChartDataItem[];
  onDataChange: (data: ChartDataItem[]) => void;
  title: string;
  icon?: React.ReactNode;
}

export function ChartControls({
  data,
  onDataChange,
  title,
  icon,
}: Readonly<ChartControlsProps>) {
  const [sortOrder, setSortOrder] = useState<SortOrder>("none");
  const [hiddenItems, setHiddenItems] = useState<Set<string>>(new Set());

  const getNextSortOrder = (current: SortOrder) => {
    if (current === "none") return "desc";
    if (current === "desc") return "asc";
    return "none";
  };

  const getSortButtonText = (order: SortOrder) => {
    if (order === "none") return "Ordenar";
    if (order === "desc") return "Maior";
    return "Menor";
  };

  const handleSort = () => {
    const newOrder = getNextSortOrder(sortOrder);
    setSortOrder(newOrder);

    const sortedData = [...data];
    if (newOrder === "desc") {
      sortedData.sort((a, b) => b.value - a.value);
    } else if (newOrder === "asc") {
      sortedData.sort((a, b) => a.value - b.value);
    }

    onDataChange(sortedData.filter((item) => !hiddenItems.has(item.name)));
  };

  const toggleItem = (itemName: string) => {
    const newHidden = new Set(hiddenItems);
    if (newHidden.has(itemName)) {
      newHidden.delete(itemName);
    } else {
      newHidden.add(itemName);
    }
    setHiddenItems(newHidden);
    onDataChange(data.filter((item) => !newHidden.has(item.name)));
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          {icon}
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <button
          onClick={handleSort}
          className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors cursor-pointer"
        >
          <ArrowUpDown size={14} />
          <span>{getSortButtonText(sortOrder)}</span>
        </button>
      </div>

      <div className="bg-gray-50 p-3 rounded-lg border">
        <div className="flex flex-wrap gap-2">
          {data.map((item) => (
            <button
              key={item.name}
              onClick={() => toggleItem(item.name)}
              className={`flex items-center space-x-2 px-3 py-2 text-xs font-medium rounded-md border transition-all cursor-pointer ${
                hiddenItems.has(item.name)
                  ? "bg-gray-200 text-gray-500 border-gray-300 opacity-60"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm"
              }`}
            >
              {hiddenItems.has(item.name) ? (
                <EyeOff size={12} />
              ) : (
                <Eye size={12} />
              )}
              <div
                className="w-3 h-3 rounded-full border border-white shadow-sm"
                style={{
                  backgroundColor: hiddenItems.has(item.name)
                    ? "#9ca3af"
                    : item.color,
                }}
              />
              <span>{item.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
