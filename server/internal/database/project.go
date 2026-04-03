package database

import (
	"github.com/Arjuna-Ragil/sprintmont/internal/config"
	"github.com/Arjuna-Ragil/sprintmont/internal/core/models"
)

type ProjectRepo struct {
	DB *config.DB
}

func NewProjectRepo(db *config.DB) ProjectRepo{
	return ProjectRepo{DB: db}
}

func (r *ProjectRepo) CreateProjects(project *models.Project) (*models.Project, error) {
	err := r.DB.Gorm.Create(project).Error; if err != nil{
		return nil, err
	}
	return project, nil
}

func (r *ProjectRepo) GetProject(projectID string) (*models.Project, error){
	var project models.Project
	err := r.DB.Gorm.Preload("Canvas").Where("id = ?", projectID).First(&project).Error; if err != nil{
		return nil, err
	}
	return &project, nil
}