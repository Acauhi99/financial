import { useState, useMemo } from "react";
import {
  useTransactionFilters,
  useTransactionForm,
  useTransactions,
} from "../hooks";
import { Loading } from "./Loading";
import { PAGINATION, CSS_CLASSES } from "../constants";
import {
  TransactionsSummary,
  TransactionForm,
  TransactionsList,
  TransactionFilters,
  transactionColumns,
} from "./transactions";

export function Transactions() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = PAGINATION.ITEMS_PER_PAGE;

  const { data, isLoading, error } = useTransactions(
    currentPage,
    itemsPerPage,
    "",
    "all"
  );

  const {
    description,
    setDescription,
    amount,
    setAmount,
    type,
    setType,
    addTransaction,
    isLoading: isCreating,
  } = useTransactionForm();

  const {
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    amountRange,
    setAmountRange,
    showFilters,
    setShowFilters,
    sortBy,
    sortOrder,
    filteredAndSortedTransactions,
    clearFilters,
    hasActiveFilters,
    handleSort,
  } = useTransactionFilters(data?.data);

  const totalIncome = useMemo(
    () =>
      filteredAndSortedTransactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0),
    [filteredAndSortedTransactions]
  );

  const totalExpenses = useMemo(
    () =>
      filteredAndSortedTransactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0),
    [filteredAndSortedTransactions]
  );

  const balance = totalIncome - totalExpenses;

  const handleClearFilters = () => {
    clearFilters();
    setCurrentPage(1);
  };

  const filters = (
    <TransactionFilters
      filterType={filterType}
      amountRange={amountRange}
      searchTerm={searchTerm}
      showFilters={showFilters}
      hasActiveFilters={hasActiveFilters}
      onFilterTypeChange={(type) => {
        setFilterType(type);
        setCurrentPage(1);
      }}
      onAmountRangeChange={(range) => {
        setAmountRange(range);
        setCurrentPage(1);
      }}
      onToggleFilters={() => setShowFilters(!showFilters)}
      onClearFilters={handleClearFilters}
    />
  );

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className={CSS_CLASSES.ERROR_MESSAGE}>
        Erro ao carregar dados das transações
      </div>
    );
  }

  return (
    <div className={CSS_CLASSES.LAYOUT_MAIN}>
      <div className={CSS_CLASSES.PAGE_HEADER}>
        <h1 className={CSS_CLASSES.PAGE_TITLE}>Transações</h1>
        <p className={CSS_CLASSES.PAGE_SUBTITLE}>
          Gerencie suas receitas e despesas
        </p>
      </div>

      <TransactionsSummary
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
        balance={balance}
      />

      <TransactionForm
        description={description}
        amount={amount}
        type={type}
        isLoading={isCreating}
        onDescriptionChange={setDescription}
        onAmountChange={setAmount}
        onTypeChange={setType}
        onSubmit={addTransaction}
      />

      <div className={CSS_CLASSES.LAYOUT_CONTENT}>
        <TransactionsList
          data={filteredAndSortedTransactions}
          columns={transactionColumns}
          isLoading={isLoading}
          error={error}
          searchTerm={searchTerm}
          onSearchChange={(value) => {
            setSearchTerm(value);
            setCurrentPage(1);
          }}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          currentPage={currentPage}
          totalPages={data?.pagination.totalPages || 1}
          onPageChange={setCurrentPage}
          filters={filters}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={handleClearFilters}
          totalItems={data?.pagination.total || 0}
        />
      </div>
    </div>
  );
}
