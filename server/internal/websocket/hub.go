package websocket

import (
	"context"
	"log"
	"time"

	"github.com/Arjuna-Ragil/sprintmont/internal/database"
	"github.com/redis/go-redis/v9"
)

type Hub struct {
	CanvasID   string
	Clients    map[*Client]bool
	Broadcast  chan []byte
	Register   chan *Client
	Unregister chan *Client
	Redis *redis.Client
	CanvasRepo *database.CanvasRepo
}

type WsManager struct {
	Hubs  map[string]*Hub
	Redis *redis.Client
	CanvasRepo *database.CanvasRepo
}

func NewHub(canvasID string, redisClient *redis.Client, canvasRepo *database.CanvasRepo) *Hub {
	return &Hub{
		CanvasID:   canvasID,
		Clients:    make(map[*Client]bool),
		Broadcast: make(chan []byte),
		Register:   make(chan *Client),
		Unregister: make(chan *Client),
		Redis: redisClient,
		CanvasRepo: canvasRepo,
	}
}

func NewWsManager(redisClient *redis.Client, canvasRepo *database.CanvasRepo) *WsManager {
	return &WsManager{
		Hubs: make(map[string]*Hub),
		Redis: redisClient,
		CanvasRepo: canvasRepo,
	}
}

func (h *Hub) Run() {
	for {
		select {
		case client := <-h.Register:
			h.Clients[client] = true

		case client := <-h.Unregister:
			if _, ok := h.Clients[client]; ok {
				delete(h.Clients, client)
				close(client.Send)

				if len(h.Clients) == 0{
					ctx := context.Background()
					redisKey := "canvas: " + h.CanvasID
					data, err := h.Redis.Get(ctx, redisKey).Bytes()

					if err == nil && len(data) > 0{
						errDB := h.CanvasRepo.SaveCanvas(h.CanvasID, data); if errDB != nil{
							log.Printf("Failed to save canvas in DB: %v", errDB)
						}
						h.Redis.Del(ctx, redisKey)
					} else if err != redis.Nil{
						log.Printf("Failed to read from redis: %v", err)
					}
				} 
			}

		case message := <-h.Broadcast:
			for client := range h.Clients {
				select {
				case client.Send <- message:

				default:
					close(client.Send)
					delete(h.Clients, client)
				}
			}
			go func(msg []byte){
				ctx := context.Background()
				key := "canvas: " + h.CanvasID
				err := h.Redis.Set(ctx, key, msg, 24*time.Hour).Err()
				if err != nil{
					log.Printf("Failed to save canvas in redis: %v", err)
				}
			}(message)
		}
	}
}