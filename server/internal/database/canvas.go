package database

import (
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

func (r *CanvasRepo) CreateCanvas(canvas *models.Canvas) error{
	err := r.DB.Gorm.Create(&canvas).Error; if err != nil{
		return err
	}
	return nil
}

func (r *CanvasRepo) GetCanvas(projectID string) (models.Canvas, error){
	var canvas models.Canvas
	err := r.DB.Gorm.Where("project_id = ?", projectID).First(canvas).Error
	return canvas, err
}

func (r *CanvasRepo) SaveCanvas(canvasID string, elements []byte) error{
	jsonElements := datatypes.JSON(elements)
	err := r.DB.Gorm.Model(&models.Canvas{}).Where("id = ?", canvasID).Update("elements", jsonElements).Error
	if err != nil{
		return err
	}
	return nil
} 