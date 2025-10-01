import { useState } from "react";
import {
  LayoutDashboard,
  ArrowLeftRight,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Overview } from "./components/Overview";
import { Transactions } from "./components/Transactions";
import { Investments } from "./components/Investments";

type Page = "overview" | "transactions" | "investments";

function App() {
  const [currentPage, setCurrentPage] = useState<Page>("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const menuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "transactions", label: "Transações", icon: ArrowLeftRight },
    { id: "investments", label: "Investimentos", icon: TrendingUp },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case "overview":
        return <Overview />;
      case "transactions":
        return <Transactions />;
      case "investments":
        return <Investments />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div
        className={`${
          sidebarCollapsed ? "w-16" : "w-64"
        } bg-gray-900 shadow-xl transition-all duration-300`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <h1 className="text-lg font-semibold text-white">Financeiro</h1>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="text-gray-400 hover:text-white transition-colors p-1"
            >
              {sidebarCollapsed ? (
                <ChevronRight size={16} />
              ) : (
                <ChevronLeft size={16} />
              )}
            </button>
          </div>
        </div>
        <nav className="mt-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id as Page)}
              className={`w-full flex items-center px-4 py-3 text-left hover:bg-gray-800 transition-colors ${
                currentPage === item.id
                  ? "bg-gray-800 border-r-2 border-gray-400 text-white"
                  : "text-gray-300"
              }`}
              title={sidebarCollapsed ? item.label : ""}
            >
              <item.icon
                size={20}
                className={sidebarCollapsed ? "mx-auto" : "mr-3"}
              />
              {!sidebarCollapsed && item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">{renderPage()}</div>
    </div>
  );
}

export default App;
