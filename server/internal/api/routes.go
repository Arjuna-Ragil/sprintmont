package api

import (
	"github.com/Arjuna-Ragil/sprintmont/internal/api/handlers"
	"github.com/Arjuna-Ragil/sprintmont/internal/websocket"
	"github.com/gin-gonic/gin"
)

type Deps struct {
	WS *websocket.CanvasHandler
	Canvas *handlers.CanvasHandler
	Project *handlers.ProjectHandler
}

func SetupRouter(r *gin.Engine, d Deps){
	ws := r.Group("/ws")
	{
		ws.GET("/canvas/:project_id", d.WS.WSHandler)
	}
	api := r.Group("/api")
	{
		api.GET("/canvas/:project_id", d.Canvas.GetCanvas)

		api.POST("/project", d.Project.CreateProject)
	}
} 