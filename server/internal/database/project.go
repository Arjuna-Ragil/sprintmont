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