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

func (s *ProjectService) CreateProject(input dto.ProjectInput, userid string) (*models.Project, error){
	projectInput := models.Project{
		Title: input.Title,
		Desc: input.Desc,
		Active: input.Active,
		BannerURL: input.BannerURL,
		Github: input.Github,
		Demo: input.Demo,
		PitchDeck: input.PitchDeck,
	}
	project, err := s.ProjectRepo.CreateProjects(&projectInput, userid); if err != nil{
		return nil, err
	}
	return project, nil
}

func (s *ProjectService) GetAllProject(userid string) ([]models.Project, error){
	projects, err := s.ProjectRepo.GetAllProject(userid); if err != nil{
		return nil, err
	}
	return projects, nil
}

func (s *ProjectService) GetProject(projectID string) (*models.Project, error){
	project, err := s.ProjectRepo.GetProject(projectID); if err != nil{
		return nil, err
	}
	return project, nil
}

func (s *ProjectService) UpdateProject(projectID string, input dto.ProjectInput) (*models.Project, error) {
	// Fetch existing to ensure it exists and to merge data if necessary
	existingProject, err := s.ProjectRepo.GetProject(projectID)
	if err != nil {
		return nil, err
	}

	updatedProject := models.Project{
		Title:     input.Title,
		Desc:      input.Desc,
		Active:    input.Active,
		Github:    input.Github,
		Demo:      input.Demo,
		PitchDeck: input.PitchDeck,
	}

	// Only update BannerURL if a new one is provided
	if input.BannerURL != "" {
		updatedProject.BannerURL = input.BannerURL
	} else {
		updatedProject.BannerURL = existingProject.BannerURL
	}

	return s.ProjectRepo.UpdateProject(projectID, &updatedProject)
}