package database

import (
	"context"
	"time"

	"financial-api/internal/logger"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.uber.org/zap"
)

func CreateIndexes(db *mongo.Database) error {
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	// Transactions indexes
	transactionIndexes := []mongo.IndexModel{
		{
			Keys: bson.D{
				{Key: "type", Value: 1},
				{Key: "createdAt", Value: -1},
			},
		},
		{
			Keys: bson.D{
				{Key: "date", Value: -1},
			},
		},
		{
			Keys: bson.D{
				{Key: "description", Value: "text"},
			},
		},
		{
			Keys: bson.D{
				{Key: "categoryId", Value: 1},
			},
		},
		{
			Keys: bson.D{
				{Key: "userId", Value: 1},
				{Key: "createdAt", Value: -1},
			},
		},
	}

	if _, err := db.Collection("transactions").Indexes().CreateMany(ctx, transactionIndexes); err != nil {
		logger.Logger.Error("Failed to create transaction indexes", zap.Error(err))
		return err
	}

	// Investments indexes
	investmentIndexes := []mongo.IndexModel{
		{
			Keys: bson.D{
				{Key: "name", Value: "text"},
			},
		},
		{
			Keys: bson.D{
				{Key: "type", Value: 1},
			},
		},
		{
			Keys: bson.D{
				{Key: "createdAt", Value: -1},
			},
		},
		{
			Keys: bson.D{
				{Key: "userId", Value: 1},
				{Key: "createdAt", Value: -1},
			},
		},
		{
			Keys: bson.D{
				{Key: "rate", Value: -1},
			},
		},
	}

	if _, err := db.Collection("investments").Indexes().CreateMany(ctx, investmentIndexes); err != nil {
		logger.Logger.Error("Failed to create investment indexes", zap.Error(err))
		return err
	}

	// Categories indexes
	categoryIndexes := []mongo.IndexModel{
		{
			Keys: bson.D{
				{Key: "type", Value: 1},
			},
		},
		{
			Keys: bson.D{
				{Key: "name", Value: 1},
			},
			Options: options.Index().SetUnique(true),
		},
	}

	if _, err := db.Collection("categories").Indexes().CreateMany(ctx, categoryIndexes); err != nil {
		logger.Logger.Error("Failed to create category indexes", zap.Error(err))
		return err
	}

	logger.Logger.Info("Database indexes created successfully")
	return nil
}