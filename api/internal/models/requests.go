package models

type CreateTransactionRequest struct {
	Type        string  `json:"type" validate:"required,oneof=income expense"`
	Description string  `json:"description" validate:"required,min=1,max=255"`
	Amount      float64 `json:"amount" validate:"required,gt=0"`
	Date        string  `json:"date" validate:"required"`
	CategoryID  *string `json:"categoryId,omitempty"`
}

type CreateInvestmentRequest struct {
	Name   string  `json:"name" validate:"required,min=1,max=255"`
	Amount float64 `json:"amount" validate:"required,gt=0"`
	Rate   float64 `json:"rate" validate:"required,gte=0"`
	Date   string  `json:"date" validate:"required"`
	Type   *string `json:"type,omitempty"`
}