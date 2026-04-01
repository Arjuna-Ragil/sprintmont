package websocket

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {return true},
}

type CanvasHandler struct{
	Manager *WsManager
}

func NewCanvasHandler(manager *WsManager) *CanvasHandler{
	return &CanvasHandler{
		Manager: manager,
	}
}

func (ch *CanvasHandler) WSHandler(c *gin.Context){
	canvasID := c.Param("project_id")

	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil{ return }

	hub, exist := ch.Manager.Hubs[canvasID]; if !exist{
		hub = NewHub(canvasID, ch.Manager.Redis, ch.Manager.CanvasRepo)
		ch.Manager.Hubs[canvasID] = hub
		go hub.Run()
	}

	client := &Client{
		Hub: hub,
		Conn: conn,
		Send: make(chan []byte, 256),
	}

	client.Hub.Register <- client
	go client.WritePump()
	client.ReadPump()
}