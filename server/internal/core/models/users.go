package models

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type User struct {
	ID           string        `gorm:"primaryKey" json:"id"`
	Username     string        `gorm:"not null" json:"username"`
	Email        string        `gorm:"not null" json:"email"`
	ProfileURL   string        `json:"profile_url"`
	ProjectUsers []ProjectUser `gorm:"foreignKey:UserID" json:"project_users"`
}

func (c *User) BeforeCreate(tx *gorm.DB) (err error) {
	if c.ID == "" {
		c.ID = uuid.New().String()
	}
	return
}