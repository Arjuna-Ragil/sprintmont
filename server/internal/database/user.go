package database

import (
	"github.com/Arjuna-Ragil/sprintmont/internal/config"
	"github.com/Arjuna-Ragil/sprintmont/internal/core/models"
)

type UserRepo struct {
	DB *config.DB
}

func NewUserRepo(db *config.DB) *UserRepo{
	return &UserRepo{DB: db}
}

func (r *UserRepo) GetUser(id string) (*models.User, error){
	var user models.User
	err := r.DB.Gorm.Where("id = ?", id).First(&user).Error; if err != nil{
		return nil, err
	}
	return &user, nil
}