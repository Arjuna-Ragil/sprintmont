package services

import (
	"github.com/Arjuna-Ragil/sprintmont/internal/core/dto"
	"github.com/Arjuna-Ragil/sprintmont/internal/core/models"
	"github.com/Arjuna-Ragil/sprintmont/internal/database"
)

type ProjectService struct {
	ProjectRepo *database.ProjectRepo
}

func NewProjectService(projectRepo *database.ProjectRepo) *ProjectService{
	return &ProjectService{ProjectRepo: projectRepo}
}

func (s *ProjectService) CreateProject(input dto.ProjectInput) (*models.Project, error){
	projectInput := models.Project{
		Title: input.Title,
		Desc: input.Desc,
		Active: input.Active,
		BannerURL: input.BannerURL,
		Github: input.Github,
		Demo: input.Demo,
		PitchDeck: input.PitchDeck,
	}
	project, err := s.ProjectRepo.CreateProjects(&projectInput); if err != nil{
		return nil, err
	}
	return project, nil
}

func (s *ProjectService) GetProject(projectID string) (*models.Project, error){
	project, err := s.ProjectRepo.GetProject(projectID); if err != nil{
		return nil, err
	}
	return project, nil
}