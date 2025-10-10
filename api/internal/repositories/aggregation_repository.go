package repositories

import (
	"context"

	"financial-api/internal/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type AggregationRepository struct {
	transactionCollection *mongo.Collection
	investmentCollection  *mongo.Collection
	categoryCollection    *mongo.Collection
}

func NewAggregationRepository(db *mongo.Database) *AggregationRepository {
	return &AggregationRepository{
		transactionCollection: db.Collection("transactions"),
		investmentCollection:  db.Collection("investments"),
		categoryCollection:    db.Collection("categories"),
	}
}

func (r *AggregationRepository) GetMonthlyData(userID string) ([]models.MonthlyItem, error) {
	pipeline := []bson.M{
		{
			"$match": bson.M{"userId": userID},
		},
		{
			"$addFields": bson.M{
				"month": bson.M{
					"$dateToString": bson.M{
						"format": "%Y-%m",
						"date":   bson.M{"$dateFromString": bson.M{"string": "$date"}},
					},
				},
			},
		},
		{
			"$group": bson.M{
				"_id": "$month",
				"receitas": bson.M{
					"$sum": bson.M{
						"$cond": bson.M{
							"if":   bson.M{"$eq": []interface{}{"$type", "income"}},
							"then": "$amount",
							"else": 0,
						},
					},
				},
				"despesas": bson.M{
					"$sum": bson.M{
						"$cond": bson.M{
							"if":   bson.M{"$eq": []interface{}{"$type", "expense"}},
							"then": "$amount",
							"else": 0,
						},
					},
				},
			},
		},
		{
			"$addFields": bson.M{
				"saldo": bson.M{"$subtract": []interface{}{"$receitas", "$despesas"}},
			},
		},
		{
			"$sort": bson.M{"_id": 1},
		},
		{
			"$limit": 12,
		},
	}

	cursor, err := r.transactionCollection.Aggregate(context.Background(), pipeline)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())

	var results []struct {
		ID       string  `bson:"_id"`
		Receitas float64 `bson:"receitas"`
		Despesas float64 `bson:"despesas"`
		Saldo    float64 `bson:"saldo"`
	}

	if err := cursor.All(context.Background(), &results); err != nil {
		return nil, err
	}

	monthlyData := make([]models.MonthlyItem, len(results))
	for i, result := range results {
		monthlyData[i] = models.MonthlyItem{
			Month:         result.ID,
			Receitas:      result.Receitas,
			Despesas:      result.Despesas,
			Saldo:         result.Saldo,
			Investimentos: 0, // TODO: Add investment data per month
		}
	}

	return monthlyData, nil
}

func (r *AggregationRepository) GetExpenseCategories(userID string) ([]models.CategoryItem, error) {
	pipeline := []bson.M{
		{
			"$match": bson.M{"type": "expense", "userId": userID},
		},
		{
			"$lookup": bson.M{
				"from":         "categories",
				"localField":   "categoryId",
				"foreignField": "_id",
				"as":           "category",
			},
		},
		{
			"$unwind": bson.M{
				"path":                       "$category",
				"preserveNullAndEmptyArrays": true,
			},
		},
		{
			"$group": bson.M{
				"_id": bson.M{
					"categoryId": "$categoryId",
					"name":       "$category.name",
					"color":      "$category.color",
				},
				"total": bson.M{"$sum": "$amount"},
			},
		},
		{
			"$sort": bson.M{"total": -1},
		},
	}

	cursor, err := r.transactionCollection.Aggregate(context.Background(), pipeline)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())

	var results []struct {
		ID struct {
			Name  string `bson:"name"`
			Color string `bson:"color"`
		} `bson:"_id"`
		Total float64 `bson:"total"`
	}

	if err := cursor.All(context.Background(), &results); err != nil {
		return nil, err
	}

	categories := make([]models.CategoryItem, len(results))
	for i, result := range results {
		name := result.ID.Name
		if name == "" {
			name = "Outros"
		}
		color := result.ID.Color
		if color == "" {
			color = "#6b7280"
		}

		categories[i] = models.CategoryItem{
			Name:  name,
			Value: result.Total,
			Color: color,
		}
	}

	return categories, nil
}

func (r *AggregationRepository) GetInvestmentTypes(userID string) ([]models.InvestmentType, error) {
	pipeline := []bson.M{
		{
			"$match": bson.M{"userId": userID},
		},
		{
			"$group": bson.M{
				"_id":   "$type",
				"total": bson.M{"$sum": "$amount"},
				"count": bson.M{"$sum": 1},
			},
		},
		{
			"$sort": bson.M{"total": -1},
		},
	}

	cursor, err := r.investmentCollection.Aggregate(context.Background(), pipeline)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())

	var results []struct {
		ID    *string `bson:"_id"`
		Total float64 `bson:"total"`
		Count int     `bson:"count"`
	}

	if err := cursor.All(context.Background(), &results); err != nil {
		return nil, err
	}

	// Calculate total for percentages
	var grandTotal float64
	for _, result := range results {
		grandTotal += result.Total
	}

	colors := []string{"#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"}
	investmentTypes := make([]models.InvestmentType, len(results))

	for i, result := range results {
		name := "Outros"
		if result.ID != nil && *result.ID != "" {
			name = *result.ID
		}

		percentage := float64(0)
		if grandTotal > 0 {
			percentage = (result.Total / grandTotal) * 100
		}

		color := colors[i%len(colors)]

		investmentTypes[i] = models.InvestmentType{
			Name:       name,
			Value:      result.Total,
			Color:      color,
			Percentage: percentage,
		}
	}

	return investmentTypes, nil
}