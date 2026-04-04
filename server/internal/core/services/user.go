package services

import (
	"github.com/Arjuna-Ragil/sprintmont/internal/core/models"
	"github.com/Arjuna-Ragil/sprintmont/internal/database"
)

type UserService struct {
	UserRepo *database.UserRepo
}

func NewUserService(userRepo *database.UserRepo) *UserService{
	return &UserService{UserRepo: userRepo}
}

func (s *UserService) GetUser(id string) (*models.User, error){
	user, err := s.UserRepo.GetUser(id); if err != nil{
		return nil, err
	}
	return user, nil
}