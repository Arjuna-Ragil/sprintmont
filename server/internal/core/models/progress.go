package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Task struct {
	ID         string `gorm:"primaryKey" json:"id"`
	Title      string `gorm:"not null" json:"title"`
	Desc       string `json:"desc"`
	Week       string `gorm:"not null" json:"week"`
	Status     string `gorm:"not null" json:"status"`
	ProjectID  string `gorm:"not null" json:"project_id"`
	Created_At time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"created_at"`
	Updated_At time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"updated_at"`
}

func (t *Task) BeforeCreate(tx *gorm.DB) (err error){
	if t.ID == ""{
		t.ID = uuid.New().String()
	}
	return
}