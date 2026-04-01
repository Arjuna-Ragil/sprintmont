package config

import (
	"context"
	"log"

	"github.com/redis/go-redis/v9"
)

var RedisCtx = context.Background()

type Cache struct{
	Client *redis.Client
}

func InitRedis(cfg *Config) (*Cache, error){
	client := redis.NewClient(&redis.Options{
		Addr: cfg.Redis_Endpoint,
		Password: cfg.Redis_Password,
		DB: 0,
	})

	_, err := client.Ping(RedisCtx).Result()
	if err != nil {
		log.Fatalf("Failed to initiate Redis: %v", err)
	}
	log.Printf("Successfully initiate Redis")
	return &Cache{Client: client}, nil
}