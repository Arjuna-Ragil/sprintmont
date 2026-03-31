package main

import (
	"fmt"
	"log"

	"github.com/Arjuna-Ragil/sprintmont/internal"
	"github.com/Arjuna-Ragil/sprintmont/internal/database"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	cfg := internal.LoadConfig()
	if cfg.AppEnv != "local" {
		gin.SetMode(gin.ReleaseMode)
	}
	
	db, err := database.ConnectDB(&cfg); if err != nil{
		log.Fatalf("DB didn't run successfully: %v", err)
	}
	if err := db.MigrateDB(); err != nil {
		log.Fatalf("Failed to migrate DB: %v", err)
	}

	// bkt, err := database.InitBucket(&cfg); if err != nil {
	// 	log.Fatalf("Bucket didn't initiate successfully: %v", err)
	// }

	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders: []string{"Origin", "Content-Length", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	server_port := fmt.Sprintf(":%s", cfg.Port)
	if err := r.Run(server_port); err != nil {
		log.Fatalf("Server didn't run successfully: %v", err)
	}
}