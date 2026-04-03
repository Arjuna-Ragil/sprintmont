package database

import (
	"context"

	"github.com/Arjuna-Ragil/sprintmont/internal/config"
	"github.com/Arjuna-Ragil/sprintmont/internal/core/models"
	"gorm.io/datatypes"
)

type CanvasRepo struct {
	DB *config.DB
	Redis *config.Cache
}

func NewCanvasRepo(db *config.DB, redis *config.Cache) *CanvasRepo{
	return &CanvasRepo{DB: db, Redis: redis}
}

func (r *CanvasRepo) CreateCanvas(canvas *models.Canvas) error{
	err := r.DB.Gorm.Create(&canvas).Error; if err != nil{
		return err
	}
	return nil
}

func (r *CanvasRepo) GetCanvas(projectID string) (*models.Canvas, error){
	var canvas models.Canvas

	ctx := context.Background()
	redisKey := "canvas: " + projectID

	element, err := r.Redis.Client.Get(ctx, redisKey).Bytes()
	if err == nil && len(element) > 0{
		return &models.Canvas{
			ProjectID: projectID,
			Elements: element,
		}, nil
	}

	if err := r.DB.Gorm.Preload("Project").Where("project_id = ?", projectID).First(&canvas).Error; err != nil{
		return nil, err
	}
	return &canvas, nil
}

func (r *CanvasRepo) SaveCanvas(canvasID string, elements []byte) error{
	jsonElements := datatypes.JSON(elements)
	err := r.DB.Gorm.Model(&models.Canvas{}).Where("id = ?", canvasID).Update("elements", jsonElements).Error
	if err != nil{
		return err
	}
	return nil
} 