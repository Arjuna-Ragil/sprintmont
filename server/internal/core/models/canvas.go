package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

type Canvas struct {
	ID       string `gorm:"primaryKey" json:"id"`
	Elements datatypes.JSON `gorm:"type:jsonb" json:"elements"`
	Updated_At time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"updated_at"`
	ProjectID string `gorm:"uniqueIndex; not null" json:"project_id"`
	Project *Project `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE" json:"project,omitempty"`
}

func (c *Canvas) BeforeCreate(tx *gorm.DB) (err error){
	if c.ID == ""{
		c.ID = uuid.New().String()
	}
	return
}