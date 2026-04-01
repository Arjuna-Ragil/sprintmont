package main

import (
	"fmt"
	"log"

	"github.com/Arjuna-Ragil/sprintmont/internal/api"
	"github.com/Arjuna-Ragil/sprintmont/internal/config"
	"github.com/Arjuna-Ragil/sprintmont/internal/database"
	"github.com/Arjuna-Ragil/sprintmont/internal/websocket"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	cfg := config.LoadConfig()
	if cfg.AppEnv != "local" {
		gin.SetMode(gin.ReleaseMode)
	}
	
	db, err := config.ConnectDB(&cfg); if err != nil{
		log.Fatalf("DB didn't run successfully: %v", err)
	}
	if err := db.MigrateDB(); err != nil {
		log.Fatalf("Failed to migrate DB: %v", err)
	}

	redis, err := config.InitRedis(&cfg); if err != nil {
		log.Fatalf("Redis didn't run successfully: %v", err)
	}

	bkt, err := config.InitBucket(&cfg); if err != nil {
		log.Fatalf("Bucket didn't initiate successfully: %v", err)
	}

	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders: []string{"Origin", "Content-Length", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	deps := SetupApp(db, bkt, redis)

	api.SetupRouter(r, deps)

	server_port := fmt.Sprintf(":%s", cfg.Port)
	if err := r.Run(server_port); err != nil {
		log.Fatalf("Server didn't run successfully: %v", err)
	}
}

func SetupApp(db *config.DB, bkt *config.Bucket, cache *config.Cache) api.Deps{
	canvasRepo := database.NewCanvasRepo(db)
	wsManager := websocket.NewWsManager(cache.Client, canvasRepo)
	canvasHandler := websocket.NewCanvasHandler(wsManager)

	return api.Deps{
		WS: canvasHandler,
	}
}