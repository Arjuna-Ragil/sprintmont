package handlers

import (
	"net/http"

	"github.com/Arjuna-Ragil/sprintmont/internal/core/dto"
	"github.com/Arjuna-Ragil/sprintmont/internal/core/services"
	"github.com/gin-gonic/gin"
)

type UserHandler struct {
	UserService   *services.UserService
	BucketService *services.BucketService
}

func NewUserHandler(userService *services.UserService, bucketService *services.BucketService) *UserHandler {
	return &UserHandler{UserService: userService, BucketService: bucketService}
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

func (h *UserHandler) UpdateUser(c *gin.Context){
	userID := c.GetString("userID")
	var input dto.UpdateUserInput
	if err := c.ShouldBind(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Input not valid",
			"data":    err.Error(),
		})
		return
	}

	file, err := c.FormFile("profile_picture")
	if err == nil && file != nil {
		url, uploadErr := h.BucketService.UploadImage(file, "sprintmont")
		if uploadErr != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "Failed to upload profile picture",
				"data":    uploadErr.Error(),
			})
			return
		}
		input.ProfileURL = url
	}

	updatedUser, err := h.UserService.UpdateUser(userID, input)
	if err != nil {
		c.JSON(http.StatusBadGateway, gin.H{
			"message": "Failed to update user",
			"data": err.Error(),
		})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{
		"message": "Successfully updated user profile",
		"data": updatedUser,
	})
}