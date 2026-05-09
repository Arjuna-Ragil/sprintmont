package handlers

import (
	"net/http"

	"github.com/Arjuna-Ragil/sprintmont/internal/core/dto"
	"github.com/Arjuna-Ragil/sprintmont/internal/core/services"
	"github.com/gin-gonic/gin"
)

type ProjectHandler struct {
	ProjectService *services.ProjectService
	CanvasService  *services.CanvasService
	BucketService  *services.BucketService
}

func NewProjectHandler(projectService *services.ProjectService, canvasService *services.CanvasService, bucketService *services.BucketService) *ProjectHandler {
	return &ProjectHandler{ProjectService: projectService, CanvasService: canvasService, BucketService: bucketService}
}

func (h *ProjectHandler) CreateProject(c *gin.Context){
	userID := c.GetString("userID")
	var input dto.ProjectInput
	if err := c.ShouldBind(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Input not valid",
			"data":    err.Error(),
		})
		return
	}

	file, err := c.FormFile("banner_image")
	if err == nil && file != nil {
		url, uploadErr := h.BucketService.UploadImage(file, "sprintmont")
		if uploadErr != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "Failed to upload banner image",
				"data":    uploadErr.Error(),
			})
			return
		}
		input.BannerURL = url
	}

	project, err := h.ProjectService.CreateProject(input, userID)
	if err != nil {
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

func (h *ProjectHandler) GetAllProject(c *gin.Context){
	projectID := c.GetString("userID")
	projects, err := h.ProjectService.GetAllProject(projectID); if err != nil{
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Failed to retrieve all project",
			"data": err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "Successfully retrieve all project",
		"data": projects,
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

func (h *ProjectHandler) UpdateProject(c *gin.Context) {
	projectID := c.Param("project_id")
	var input dto.ProjectInput

	if err := c.ShouldBind(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Input not valid",
			"data":    err.Error(),
		})
		return
	}

	file, err := c.FormFile("banner_image")
	if err == nil && file != nil {
		url, uploadErr := h.BucketService.UploadImage(file, "sprintmont")
		if uploadErr != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "Failed to upload banner image",
				"data":    uploadErr.Error(),
			})
			return
		}
		input.BannerURL = url
	}

	updatedProject, err := h.ProjectService.UpdateProject(projectID, input)
	if err != nil {
		c.JSON(http.StatusBadGateway, gin.H{
			"message": "Failed to update project",
			"data":    err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Successfully updated project",
		"data":    updatedProject,
	})
}