package database

import (
	"log"

	"github.com/Arjuna-Ragil/sprintmont/internal/config"
	"github.com/Arjuna-Ragil/sprintmont/internal/core/models"
	"gorm.io/datatypes"
)

type CanvasRepo struct {
	DB *config.DB
}

func NewCanvasRepo(db *config.DB) *CanvasRepo{
	return &CanvasRepo{DB: db}
}

func (r *CanvasRepo) SaveCanvas(canvasID string, elements []byte) error{
	jsonElements := datatypes.JSON(elements)
	err := r.DB.Gorm.Model(&models.Canvas{}).Where("id = ?", canvasID).Update("elements", jsonElements).Error
	if err != nil{
		log.Printf("Failed to save canvas to DB: %v", err)
	}
	return nil
} 