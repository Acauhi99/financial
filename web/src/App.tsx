import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  LayoutDashboard,
  ArrowLeftRight,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { OverviewPage } from "./pages/OverviewPage";
import { TransactionsPage } from "./pages/TransactionsPage";
import { InvestmentsPage } from "./pages/InvestmentsPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

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
        return <OverviewPage />;
      case "transactions":
        return <TransactionsPage />;
      case "investments":
        return <InvestmentsPage />;
      default:
        return <OverviewPage />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
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
                className="text-gray-400 hover:text-white transition-colors p-1 cursor-pointer"
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
                className={`w-full flex items-center px-4 py-3 text-left hover:bg-gray-800 transition-colors cursor-pointer ${
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
    </QueryClientProvider>
  );
}

export default App;
