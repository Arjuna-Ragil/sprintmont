package models

import (
	"time"

	"gorm.io/datatypes"
)

type Canvas struct {
	ID       string `gorm:"primaryKey" json:"id"`
	Elements datatypes.JSON `gorm:"type:jsonb" json:"elements"`
	AppState datatypes.JSON `gorm:"type:jsonb" json:"app_state"`
	Updated_At time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"updated_at"`
	ProjectID string `gorm:"uniqueIndex; not null" json:"project_id"`
	Project *Project `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE" json:"project,omitempty"`
}