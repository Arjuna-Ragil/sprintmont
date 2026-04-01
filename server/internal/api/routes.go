package api

import (
	"github.com/Arjuna-Ragil/sprintmont/internal/websocket"
	"github.com/gin-gonic/gin"
)

type Deps struct {
	WS *websocket.CanvasHandler
}

func SetupRouter(r *gin.Engine, d Deps){
	ws := r.Group("/ws")
	{
		ws.GET("/canvas/:project_id", d.WS.WSHandler)
	}
} 