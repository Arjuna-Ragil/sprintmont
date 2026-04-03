package handlers

import (
	"net/http"

	"github.com/Arjuna-Ragil/sprintmont/internal/core/dto"
	"github.com/Arjuna-Ragil/sprintmont/internal/core/services"
	"github.com/gin-gonic/gin"
)

type ProjectHandler struct {
	ProjectService *services.ProjectService
	CanvasService *services.CanvasService
}

func NewProjectHandler(projectService *services.ProjectService, canvasService *services.CanvasService) *ProjectHandler{
	return &ProjectHandler{ProjectService: projectService, CanvasService: canvasService}
}

func (h *ProjectHandler) CreateProject(c *gin.Context){
	var input dto.ProjectInput
	if err := c.ShouldBind(&input); err != nil{
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Input not valid",
			"data": err.Error(),
		})
		return
	}
	project, err := h.ProjectService.CreateProject(input); if err != nil{
		c.JSON(http.StatusBadGateway, gin.H{
			"message": "Failed to create project",
			"data": err.Error(),
		})
		return
	}
	if err := h.CanvasService.CreateCanvas(project.ID); err != nil{
		c.JSON(http.StatusBadGateway, gin.H{
			"message": "Failed to create Canvas",
			"data": err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "Successfully created project and canvas",
		"data": project,
	})
}

func (h *ProjectHandler) GetProject(c *gin.Context){
	projectID := c.Param("project_id")
	project, err := h.ProjectService.GetProject(projectID); if err != nil{
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Failed to retrieve project",
			"data": err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "Successfully retrieve project",
		"data": project,
	})
}