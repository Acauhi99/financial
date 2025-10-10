package repositories

import (
	"context"
	"time"

	"financial-api/internal/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type TransactionRepository struct {
	collection *mongo.Collection
}

func NewTransactionRepository(db *mongo.Database) *TransactionRepository {
	return &TransactionRepository{
		collection: db.Collection("transactions"),
	}
}

func (r *TransactionRepository) Create(transaction *models.Transaction, userID string) error {
	transaction.CreatedAt = time.Now()
	transaction.UpdatedAt = time.Now()
	transaction.UserID = &userID

	result, err := r.collection.InsertOne(context.Background(), transaction)
	if err != nil {
		return err
	}

	transaction.ID = result.InsertedID.(primitive.ObjectID)
	return nil
}

func (r *TransactionRepository) FindPaginated(page, limit int, search, transactionType, userID string) ([]models.Transaction, int64, error) {
	filter := bson.M{"userId": userID}

	if transactionType != "all" && transactionType != "" {
		filter["type"] = transactionType
	}

	if search != "" {
		filter["description"] = bson.M{"$regex": search, "$options": "i"}
	}

	// Count total documents
	total, err := r.collection.CountDocuments(context.Background(), filter)
	if err != nil {
		return nil, 0, err
	}

	// Calculate skip
	skip := (page - 1) * limit

	// Find with pagination (optimized with indexes)
	opts := options.Find().
		SetSkip(int64(skip)).
		SetLimit(int64(limit)).
		SetSort(bson.D{{Key: "createdAt", Value: -1}}).
		SetHint(bson.D{{Key: "type", Value: 1}, {Key: "createdAt", Value: -1}})

	cursor, err := r.collection.Find(context.Background(), filter, opts)
	if err != nil {
		return nil, 0, err
	}
	defer cursor.Close(context.Background())

	var transactions []models.Transaction
	if err := cursor.All(context.Background(), &transactions); err != nil {
		return nil, 0, err
	}

	return transactions, total, nil
}

func (r *TransactionRepository) GetTotals(userID string) (*models.Totals, error) {
	pipeline := []bson.M{
		{
			"$match": bson.M{"userId": userID},
		},
		{
			"$group": bson.M{
				"_id": "$type",
				"total": bson.M{"$sum": "$amount"},
			},
		},
	}

	cursor, err := r.collection.Aggregate(context.Background(), pipeline)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())

	totals := &models.Totals{}
	for cursor.Next(context.Background()) {
		var result struct {
			ID    string  `bson:"_id"`
			Total float64 `bson:"total"`
		}
		if err := cursor.Decode(&result); err != nil {
			continue
		}

		switch result.ID {
		case "income":
			totals.TotalIncome = result.Total
		case "expense":
			totals.TotalExpenses = result.Total
		}
	}

	totals.Balance = totals.TotalIncome - totals.TotalExpenses
	return totals, nil
}
