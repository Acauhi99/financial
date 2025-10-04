import { useState, useMemo, useCallback } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  LayoutDashboard,
  ArrowLeftRight,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { TransactionsPage, InvestmentsPage, OverviewPage } from "./pages";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

type Page = "overview" | "transactions" | "investments";

const menuItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "transactions", label: "Transações", icon: ArrowLeftRight },
  { id: "investments", label: "Investimentos", icon: TrendingUp },
] as const;

function App() {
  const [currentPage, setCurrentPage] = useState<Page>("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => !prev);
  }, []);

  const handlePageChange = useCallback((page: Page) => {
    setCurrentPage(page);
  }, []);

  const currentPageComponent = useMemo(() => {
    switch (currentPage) {
      case "overview":
        return <OverviewPage />;
      case "transactions":
        return <TransactionsPage />;
      case "investments":
        return <InvestmentsPage />;
      default:
        return <OverviewPage />;
    }
  }, [currentPage]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="h-screen bg-gray-100 flex overflow-hidden">
        {/* Sidebar */}
        <div
          className={`${
            sidebarCollapsed ? "w-16" : "w-64"
          } bg-gradient-to-b from-gray-900 to-gray-800 shadow-2xl transition-all duration-300 flex flex-col border-r border-gray-700`}
        >
          <div className="p-4 flex-shrink-0 border-b border-gray-700/50">
            <div
              className={`flex items-center ${
                sidebarCollapsed ? "justify-center" : "justify-between"
              }`}
            >
              {!sidebarCollapsed && (
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">F</span>
                  </div>
                  <h1 className="text-lg font-bold text-white">Financeiro</h1>
                </div>
              )}
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
              >
                {sidebarCollapsed ? (
                  <ChevronRight size={16} />
                ) : (
                  <ChevronLeft size={16} />
                )}
              </button>
            </div>
          </div>
          <nav className="mt-2 flex-1 px-3 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handlePageChange(item.id as Page)}
                className={(() => {
                  const baseClasses = `w-full flex items-center py-3 rounded-xl text-left transition-all duration-200 group focus:outline-none cursor-pointer`;
                  const positionClasses = sidebarCollapsed
                    ? "justify-center px-2"
                    : "px-3";
                  const isActive = currentPage === item.id;
                  const activeClasses =
                    isActive && !sidebarCollapsed
                      ? "bg-white/10 text-white shadow-lg backdrop-blur-sm"
                      : "";
                  const inactiveClasses = !isActive
                    ? "text-gray-300 hover:bg-white/5 hover:text-white"
                    : "text-white";

                  return `${baseClasses} ${positionClasses} ${activeClasses} ${inactiveClasses}`;
                })()}
                title={sidebarCollapsed ? item.label : ""}
              >
                <div
                  className={`${
                    currentPage === item.id
                      ? "bg-white/20"
                      : "bg-gray-700/50 group-hover:bg-gray-600/50"
                  } p-2 rounded-lg transition-colors duration-200 ${
                    sidebarCollapsed ? "" : "mr-3"
                  }`}
                >
                  <item.icon size={16} />
                </div>
                {!sidebarCollapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
              </button>
            ))}
          </nav>
          <div className="p-4 border-t border-gray-700/50">
            <div
              className={`${
                sidebarCollapsed
                  ? "flex justify-center"
                  : "flex items-center space-x-2"
              } text-gray-400`}
            >
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              {!sidebarCollapsed && (
                <span className="text-xs">Sistema online</span>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full max-w-7xl mx-auto p-6">
            {currentPageComponent}
          </div>
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;
