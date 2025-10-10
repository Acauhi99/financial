package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Transaction struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Type        string             `bson:"type" json:"type"`
	Description string             `bson:"description" json:"description"`
	Amount      float64            `bson:"amount" json:"amount"`
	Date        string             `bson:"date" json:"date"`
	CategoryID  *string            `bson:"categoryId,omitempty" json:"categoryId,omitempty"`
	UserID      *string            `bson:"userId,omitempty" json:"userId,omitempty"`
	CreatedAt   time.Time          `bson:"createdAt" json:"createdAt"`
	UpdatedAt   time.Time          `bson:"updatedAt" json:"updatedAt"`
}

type Investment struct {
	ID            primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Name          string             `bson:"name" json:"name"`
	Amount        float64            `bson:"amount" json:"amount"`
	Rate          float64            `bson:"rate" json:"rate"`
	MonthlyReturn float64            `bson:"monthlyReturn" json:"monthlyReturn"`
	Date          string             `bson:"date" json:"date"`
	Type          *string            `bson:"type,omitempty" json:"type,omitempty"`
	UserID        *string            `bson:"userId,omitempty" json:"userId,omitempty"`
	CreatedAt     time.Time          `bson:"createdAt" json:"createdAt"`
	UpdatedAt     time.Time          `bson:"updatedAt" json:"updatedAt"`
}

type Category struct {
	ID    primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Name  string             `bson:"name" json:"name"`
	Color string             `bson:"color" json:"color"`
	Type  string             `bson:"type" json:"type"`
}

type PaginatedResponse struct {
	Data       interface{} `json:"data"`
	Pagination Pagination  `json:"pagination"`
}

type Pagination struct {
	Page       int `json:"page"`
	Limit      int `json:"limit"`
	Total      int64 `json:"total"`
	TotalPages int `json:"totalPages"`
}

type DashboardSummary struct {
	Totals     Totals     `json:"totals"`
	Categories []Category `json:"categories"`
}

type Totals struct {
	Balance             float64 `json:"balance"`
	TotalIncome         float64 `json:"totalIncome"`
	TotalExpenses       float64 `json:"totalExpenses"`
	TotalInvestments    float64 `json:"totalInvestments"`
	TotalMonthlyReturn  float64 `json:"totalMonthlyReturn"`
	AverageRate         float64 `json:"averageRate"`
}

type OverviewData struct {
	Summary             Summary             `json:"summary"`
	BalanceData         []BalanceItem       `json:"balanceData"`
	MonthlyData         []MonthlyItem       `json:"monthlyData"`
	ExpenseCategories   []CategoryItem      `json:"expenseCategories"`
	InvestmentTypes     []InvestmentType    `json:"investmentTypes"`
}

type Summary struct {
	Balance          float64 `json:"balance"`
	TotalIncome      float64 `json:"totalIncome"`
	TotalExpenses    float64 `json:"totalExpenses"`
	TotalInvestments float64 `json:"totalInvestments"`
}

type BalanceItem struct {
	Name  string  `json:"name"`
	Value float64 `json:"value"`
	Color string  `json:"color"`
}

type MonthlyItem struct {
	Month         string  `json:"month"`
	Receitas      float64 `json:"receitas"`
	Despesas      float64 `json:"despesas"`
	Saldo         float64 `json:"saldo"`
	Investimentos float64 `json:"investimentos"`
}

type CategoryItem struct {
	Name  string  `json:"name"`
	Value float64 `json:"value"`
	Color string  `json:"color"`
}

type InvestmentType struct {
	Name       string  `json:"name"`
	Value      float64 `json:"value"`
	Color      string  `json:"color"`
	Percentage float64 `json:"percentage"`
}