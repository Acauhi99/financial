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

type InvestmentRepository struct {
	collection *mongo.Collection
}

func NewInvestmentRepository(db *mongo.Database) *InvestmentRepository {
	return &InvestmentRepository{
		collection: db.Collection("investments"),
	}
}

func (r *InvestmentRepository) Create(investment *models.Investment, userID string) error {
	investment.CreatedAt = time.Now()
	investment.UpdatedAt = time.Now()
	investment.UserID = &userID

	// Calculate monthly return
	investment.MonthlyReturn = (investment.Amount * (investment.Rate / 100)) / 12

	result, err := r.collection.InsertOne(context.Background(), investment)
	if err != nil {
		return err
	}

	investment.ID = result.InsertedID.(primitive.ObjectID)
	return nil
}

func (r *InvestmentRepository) FindPaginated(page, limit int, search, userID string) ([]models.Investment, int64, error) {
	filter := bson.M{"userId": userID}

	if search != "" {
		filter["name"] = bson.M{"$regex": search, "$options": "i"}
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
		SetHint(bson.D{{Key: "createdAt", Value: -1}})

	cursor, err := r.collection.Find(context.Background(), filter, opts)
	if err != nil {
		return nil, 0, err
	}
	defer cursor.Close(context.Background())

	var investments []models.Investment
	if err := cursor.All(context.Background(), &investments); err != nil {
		return nil, 0, err
	}

	return investments, total, nil
}

func (r *InvestmentRepository) GetTotals(userID string) (float64, float64, float64, error) {
	pipeline := []bson.M{
		{
			"$match": bson.M{"userId": userID},
		},
		{
			"$group": bson.M{
				"_id":               nil,
				"totalInvestments":  bson.M{"$sum": "$amount"},
				"totalMonthlyReturn": bson.M{"$sum": "$monthlyReturn"},
				"averageRate":       bson.M{"$avg": "$rate"},
			},
		},
	}

	cursor, err := r.collection.Aggregate(context.Background(), pipeline)
	if err != nil {
		return 0, 0, 0, err
	}
	defer cursor.Close(context.Background())

	var result struct {
		TotalInvestments    float64 `bson:"totalInvestments"`
		TotalMonthlyReturn  float64 `bson:"totalMonthlyReturn"`
		AverageRate         float64 `bson:"averageRate"`
	}

	if cursor.Next(context.Background()) {
		if err := cursor.Decode(&result); err != nil {
			return 0, 0, 0, err
		}
	}

	return result.TotalInvestments, result.TotalMonthlyReturn, result.AverageRate, nil
}
