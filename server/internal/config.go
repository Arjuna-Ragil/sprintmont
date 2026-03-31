package internal

import (
	"fmt"
	"os"
	"github.com/joho/godotenv"
)

type Config struct {
	AppEnv string
	Bkt_Endpoint string
	Bkt_Access string
	Bkt_Password string
	Port   string
	DBURL  string
}

func LoadConfig() Config {
	err := godotenv.Load("../.env")
	if err != nil {
		fmt.Println("No .env file found, using system environment")
	}
	return Config{
		AppEnv:     getEnv("APP_ENV", "local"),
		Port:       getEnv("PORT", "8080"),
		Bkt_Endpoint: getEnv("BUCKET_ENDPOINT", "127.0.0.1:8335"),
		Bkt_Access: getEnv("BUCKET_ACCESS_KEY", "admin"),
		Bkt_Password: getEnv("BUCKET_SECRET_KEY", "admin"),
		DBURL: "host=" + getEnv("DB_HOST", "localhost") +
			" user=" + getEnv("DB_USER", "postgres") +
			" password=" + getEnv("DB_PASSWORD", "password") +
			" dbname=" + getEnv("DB_NAME", "Porto_DB") +
			" port=" + getEnv("DB_PORT", "5432") +
			" sslmode=disable TimeZone=Asia/Jakarta",
	}
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}