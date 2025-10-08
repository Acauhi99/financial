import { Wallet } from "lucide-react";
import { type Transaction } from "../../services/api";
import { PAGINATION } from "../../constants";
import { DataTable, type Column } from "../ui/DataTable";

interface TransactionsListProps {
  data: Transaction[];
  columns: Column<Transaction>[];
  isLoading: boolean;
  error: Error | null;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSort: (key: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  filters: React.ReactNode;
  hasActiveFilters: boolean | string;
  onClearFilters: () => void;
  totalItems: number;
  paginationLoading?: boolean;
}

export function TransactionsList({
  data,
  columns,
  isLoading,
  error,
  searchTerm,
  onSearchChange,
  sortBy,
  sortOrder,
  onSort,
  currentPage,
  totalPages,
  onPageChange,
  filters,
  hasActiveFilters,
  onClearFilters,
  totalItems,
}: Readonly<TransactionsListProps>) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm flex-1 min-h-0 flex flex-col">
      <div className="p-3 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">Histórico</h2>
          <div className="flex items-center space-x-3">
            <span className="text-xs text-gray-500">
              {isLoading
                ? "Carregando..."
                : `${Math.min(
                    (currentPage - 1) * PAGINATION.ITEMS_PER_PAGE + data.length,
                    totalItems
                  )} de ${totalItems} transações`}
            </span>
          </div>
        </div>
      </div>

      <div className="p-2 flex-1 min-h-0">
        <DataTable
          data={data}
          columns={columns}
          loading={isLoading}
          error={error ? String(error) : null}
          searchValue={searchTerm}
          onSearchChange={onSearchChange}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={onSort}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          filters={filters}
        />

        {!isLoading && data.length === 0 && (
          <div className="p-8 text-center">
            <div className="max-w-sm mx-auto">
              <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">
                Nenhuma transação encontrada
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {hasActiveFilters
                  ? "Tente ajustar os filtros ou limpar a busca"
                  : "Adicione sua primeira transação acima"}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={onClearFilters}
                  className="mt-3 text-sm text-gray-600 hover:text-gray-800 underline cursor-pointer"
                >
                  Limpar todos os filtros
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
