package handlers

import (
	"net/http"

	"github.com/Arjuna-Ragil/sprintmont/internal/core/services"
	"github.com/gin-gonic/gin"
)

type CanvasHandler struct {
	CanvasService *services.CanvasService
}

func NewCanvasHandler(canvasService *services.CanvasService) *CanvasHandler{
	return &CanvasHandler{CanvasService: canvasService}
}

func (h *CanvasHandler) GetCanvas(c *gin.Context){
	projectID := c.Param("project_id")
	canvas, err := h.CanvasService.GetCanvas(projectID); if err != nil{
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Failed to retrieve canvas",
			"data": err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "Successfully retrieve canvas",
		"data": canvas,
	})
}