package api

import (
	"github.com/Arjuna-Ragil/sprintmont/internal/api/handlers"
	"github.com/Arjuna-Ragil/sprintmont/internal/core/middleware"
	"github.com/Arjuna-Ragil/sprintmont/internal/websocket"
	"github.com/gin-gonic/gin"
)

type Deps struct {
	WS *websocket.CanvasHandler
	Canvas *handlers.CanvasHandler
	Project *handlers.ProjectHandler
	Task    *handlers.TaskHandler
	User    *handlers.UserHandler
	AuthMiddleware *middleware.AuthDB
}

func SetupRouter(r *gin.Engine, d Deps){
	Protected := r.Group("/protected")
	Protected.Use(d.AuthMiddleware.AuthMiddleware())
	{
		api := Protected.Group("/api")
		{
			api.GET("/me", d.User.GetUser)
			api.PUT("/me", d.User.UpdateUser)

			api.GET("/project", d.Project.GetAllProject)
			api.POST("/project", d.Project.CreateProject)
			api.GET("/project/:project_id", d.Project.GetProject)
			api.PUT("/project/:project_id", d.Project.UpdateProject)

			api.GET("/project/:project_id/tasks", d.Task.GetTasks)
			api.POST("/project/:project_id/tasks", d.Task.CreateTask)

			api.GET("/canvas/:project_id", d.Canvas.GetCanvas)
		}
		ws := Protected.Group("/ws")
		{
			ws.GET("/canvas/:project_id", d.WS.WSHandler)
		}
	}
	
} 