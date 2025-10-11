package config

import (
	"fmt"
	"os"
	"strconv"
	"strings"
	"time"
)

type Config struct {
	// Server
	Port        string
	Environment string
	LogLevel    string
	
	// Database
	MongoURI string
	
	// Security
	JWTSecret     string
	JWTExpiration time.Duration
	
	// Rate Limiting
	RateLimitEnabled bool
	RateLimitRPS     int
	RateLimitBurst   int
	
	// CORS
	AllowedOrigins []string
	
	// Features
	EnableSwagger bool
	EnableMetrics bool
}

func Load() *Config {
	env := getEnv("GIN_MODE", "debug")
	
	return &Config{
		// Server
		Port:        getEnv("PORT", "8080"),
		Environment: env,
		LogLevel:    getEnv("LOG_LEVEL", getDefaultLogLevel(env)),
		
		// Database
		MongoURI: getEnv("MONGO_URI", getDefaultMongoURI(env)),
		
		// Security
		JWTSecret:     getEnv("JWT_SECRET", getDefaultJWTSecret(env)),
		JWTExpiration: getEnvDuration("JWT_EXPIRATION", 24*time.Hour),
		
		// Rate Limiting
		RateLimitEnabled: getEnvBool("RATE_LIMIT_ENABLED", getRateLimitDefault(env)),
		RateLimitRPS:     getEnvInt("RATE_LIMIT_RPS", getRateLimitRPS(env)),
		RateLimitBurst:   getEnvInt("RATE_LIMIT_BURST", getRateLimitBurst(env)),
		
		// CORS
		AllowedOrigins: getEnvSlice("ALLOWED_ORIGINS", getAllowedOrigins(env)),
		
		// Features
		EnableSwagger: getEnvBool("ENABLE_SWAGGER", env != "release"),
		EnableMetrics: getEnvBool("ENABLE_METRICS", true),
	}
}

// Environment-specific defaults
func getDefaultLogLevel(env string) string {
	switch env {
	case "release":
		return "info"
	case "test":
		return "error"
	default:
		return "debug"
	}
}

func getDefaultMongoURI(env string) string {
	switch env {
	case "test":
		return "mongodb://admin:password123@localhost:27018/financial_test?authSource=admin"
	default:
		return "mongodb://admin:password123@localhost:27017/financial?authSource=admin"
	}
}

func getDefaultJWTSecret(env string) string {
	switch env {
	case "release":
		// In production, this MUST be set via environment variable
		panic("JWT_SECRET must be set in production environment")
	case "test":
		return "test-jwt-secret-key-not-for-production"
	default:
		return "dev-jwt-secret-key-change-in-production"
	}
}

func getRateLimitDefault(env string) bool {
	switch env {
	case "test":
		return false // Disable rate limiting in tests
	case "debug":
		return false // Disable rate limiting in development
	default:
		return true
	}
}

func getRateLimitRPS(env string) int {
	switch env {
	case "release":
		return 100 // More restrictive in production
	case "test":
		return 1000 // Very permissive in tests
	default:
		return 200 // Moderate in development
	}
}

func getRateLimitBurst(env string) int {
	switch env {
	case "release":
		return 200
	case "test":
		return 2000
	default:
		return 400
	}
}

func getAllowedOrigins(env string) []string {
	switch env {
	case "release":
		return []string{} // Must be configured via env var in production
	case "test":
		return []string{"*"} // Allow all in tests
	default:
		return []string{"http://localhost:3000", "http://localhost:5173"}
	}
}

// Helper functions
func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func getEnvInt(key string, defaultValue int) int {
	if value := os.Getenv(key); value != "" {
		if intValue, err := strconv.Atoi(value); err == nil {
			return intValue
		}
	}
	return defaultValue
}

func getEnvBool(key string, defaultValue bool) bool {
	if value := os.Getenv(key); value != "" {
		if boolValue, err := strconv.ParseBool(value); err == nil {
			return boolValue
		}
	}
	return defaultValue
}

func getEnvDuration(key string, defaultValue time.Duration) time.Duration {
	if value := os.Getenv(key); value != "" {
		if duration, err := time.ParseDuration(value); err == nil {
			return duration
		}
	}
	return defaultValue
}

func getEnvSlice(key string, defaultValue []string) []string {
	if value := os.Getenv(key); value != "" {
		return strings.Split(value, ",")
	}
	return defaultValue
}

// Validation
func (c *Config) Validate() error {
	if c.Environment == "release" {
		if c.JWTSecret == "" {
			return fmt.Errorf("JWT_SECRET is required in production")
		}
		if len(c.AllowedOrigins) == 0 {
			return fmt.Errorf("ALLOWED_ORIGINS must be configured in production")
		}
	}
	return nil
}