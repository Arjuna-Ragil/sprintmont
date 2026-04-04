package handlers

import (
	"net/http"

	"github.com/Arjuna-Ragil/sprintmont/internal/core/services"
	"github.com/gin-gonic/gin"
)

type UserHandler struct {
	UserService *services.UserService
}

func NewUserHandler(userService *services.UserService) *UserHandler{
	return &UserHandler{UserService: userService}
}

func (h *UserHandler) GetUser(c *gin.Context){
	userID := c.GetString("userID")
	user, err := h.UserService.GetUser(userID); if err != nil{
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Failed to get user data",
			"data": err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "Successfully retrieve user data",
		"data": user,
	})
}