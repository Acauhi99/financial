package repositories

import (
	"context"

	"financial-api/internal/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type CategoryRepository struct {
	collection *mongo.Collection
}

func NewCategoryRepository(db *mongo.Database) *CategoryRepository {
	return &CategoryRepository{
		collection: db.Collection("categories"),
	}
}

func (r *CategoryRepository) FindAll() ([]models.Category, error) {
	cursor, err := r.collection.Find(context.Background(), bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())

	var categories []models.Category
	if err := cursor.All(context.Background(), &categories); err != nil {
		return nil, err
	}

	return categories, nil
}

func (r *CategoryRepository) SeedDefaultCategories() error {
	// Check if categories already exist
	count, err := r.collection.CountDocuments(context.Background(), bson.M{})
	if err != nil {
		return err
	}
	
	if count > 0 {
		return nil // Categories already exist
	}

	defaultCategories := []interface{}{
		models.Category{Name: "Salário", Color: "#10b981", Type: "income"},
		models.Category{Name: "Freelance", Color: "#059669", Type: "income"},
		models.Category{Name: "Investimentos", Color: "#047857", Type: "income"},
		models.Category{Name: "Moradia", Color: "#ef4444", Type: "expense"},
		models.Category{Name: "Alimentação", Color: "#f97316", Type: "expense"},
		models.Category{Name: "Transporte", Color: "#eab308", Type: "expense"},
		models.Category{Name: "Saúde", Color: "#3b82f6", Type: "expense"},
		models.Category{Name: "Lazer", Color: "#8b5cf6", Type: "expense"},
		models.Category{Name: "Outros", Color: "#6b7280", Type: "expense"},
	}

	_, err = r.collection.InsertMany(context.Background(), defaultCategories)
	return err
}