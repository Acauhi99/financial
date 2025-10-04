import { useState, useMemo } from "react";
import { useInvestments } from "../hooks/useInvestments";
import { useInvestmentForm } from "../hooks/useInvestmentForm";
import { useInvestmentFilters } from "../hooks/useInvestmentFilters";
import { PAGINATION, CSS_CLASSES } from "../constants";
import {
  InvestmentsSummary,
  InvestmentForm,
  InvestmentsList,
  InvestmentFilters,
  investmentColumns,
} from "./investments";
import { Loading } from "./ui";

export function Investments() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = PAGINATION.ITEMS_PER_PAGE;

  const { data, isLoading, error } = useInvestments(
    currentPage,
    itemsPerPage,
    ""
  );

  const {
    name,
    setName,
    amount,
    setAmount,
    rate,
    setRate,
    addInvestment,
    isLoading: isCreating,
  } = useInvestmentForm();

  const {
    searchTerm,
    setSearchTerm,
    amountRange,
    setAmountRange,
    rateRange,
    setRateRange,
    showFilters,
    setShowFilters,
    sortBy,
    sortOrder,
    filteredAndSortedInvestments,
    clearFilters,
    hasActiveFilters,
    handleSort,
  } = useInvestmentFilters(data?.data);

  const totalInvested = useMemo(
    () =>
      filteredAndSortedInvestments.reduce((sum, inv) => sum + inv.amount, 0),
    [filteredAndSortedInvestments]
  );

  const totalMonthlyReturn = useMemo(
    () =>
      filteredAndSortedInvestments.reduce(
        (sum, inv) => sum + inv.monthlyReturn,
        0
      ),
    [filteredAndSortedInvestments]
  );

  const averageRate = useMemo(
    () =>
      filteredAndSortedInvestments.length > 0
        ? filteredAndSortedInvestments.reduce((sum, inv) => sum + inv.rate, 0) /
          filteredAndSortedInvestments.length
        : 0,
    [filteredAndSortedInvestments]
  );

  const handleClearFilters = () => {
    clearFilters();
    setCurrentPage(1);
  };

  const filters = (
    <InvestmentFilters
      amountRange={amountRange}
      rateRange={rateRange}
      searchTerm={searchTerm}
      showFilters={showFilters}
      hasActiveFilters={hasActiveFilters}
      onAmountRangeChange={(range) => {
        setAmountRange(range);
        setCurrentPage(1);
      }}
      onRateRangeChange={(range) => {
        setRateRange(range);
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
        Erro ao carregar dados dos investimentos
      </div>
    );
  }

  return (
    <div className={CSS_CLASSES.LAYOUT_MAIN}>
      <div className={CSS_CLASSES.PAGE_HEADER}>
        <h1 className={CSS_CLASSES.PAGE_TITLE}>Investimentos</h1>
        <p className={CSS_CLASSES.PAGE_SUBTITLE}>
          Acompanhe seus investimentos e rendimentos
        </p>
      </div>

      <InvestmentsSummary
        totalInvested={totalInvested}
        totalMonthlyReturn={totalMonthlyReturn}
        averageRate={averageRate}
      />

      <InvestmentForm
        name={name}
        amount={amount}
        rate={rate}
        isLoading={isCreating}
        onNameChange={setName}
        onAmountChange={setAmount}
        onRateChange={setRate}
        onSubmit={addInvestment}
      />

      <div className={CSS_CLASSES.LAYOUT_CONTENT}>
        <InvestmentsList
          data={filteredAndSortedInvestments}
          columns={investmentColumns}
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
