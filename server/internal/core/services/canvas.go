package services

import (
	"github.com/Arjuna-Ragil/sprintmont/internal/core/models"
	"github.com/Arjuna-Ragil/sprintmont/internal/database"
)

type CanvasService struct {
	CanvasRepo *database.CanvasRepo
}

func NewCanvasService(canvasRepo *database.CanvasRepo) *CanvasService {
	return &CanvasService{CanvasRepo: canvasRepo}
}

func (s *CanvasService) CreateCanvas(projectID string) error {
	canvas := models.Canvas{
		Elements: []byte(`[]`),
		ProjectID: projectID,
	}
	err := s.CanvasRepo.CreateCanvas(&canvas); if err != nil {
		return err
	}
	return nil
}

func (s *CanvasService) GetCanvas(projectID string) (*models.Canvas, error){
	canvas, err := s.CanvasRepo.GetCanvas(projectID); if err != nil{
		return nil, err
	}
	return canvas, nil
}