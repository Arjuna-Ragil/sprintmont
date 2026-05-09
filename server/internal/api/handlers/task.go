package handlers

import (
	"net/http"

	"github.com/Arjuna-Ragil/sprintmont/internal/core/dto"
	"github.com/Arjuna-Ragil/sprintmont/internal/core/services"
	"github.com/gin-gonic/gin"
)

type TaskHandler struct {
	TaskService *services.TaskService
}

func NewTaskHandler(taskService *services.TaskService) *TaskHandler {
	return &TaskHandler{TaskService: taskService}
}

func (h *TaskHandler) GetTasks(c *gin.Context) {
	userID := c.GetString("userID")
	projectID := c.Param("project_id")

	tasks, err := h.TaskService.GetTasks(projectID, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to retrieve tasks",
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Successfully retrieved tasks",
		"data": tasks,
	})
}

func (h *TaskHandler) CreateTask(c *gin.Context) {
	userID := c.GetString("userID")
	projectID := c.Param("project_id")

	var input dto.CreateTaskInput
	if err := c.ShouldBind(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid input",
			"error": err.Error(),
		})
		return
	}

	task, err := h.TaskService.CreateTask(projectID, userID, input)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to create task",
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Successfully created task",
		"data": task,
	})
}
