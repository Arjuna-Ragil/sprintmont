package database

import (
	"github.com/Arjuna-Ragil/sprintmont/internal/config"
	"github.com/Arjuna-Ragil/sprintmont/internal/core/models"
	"gorm.io/gorm"
)

type ProjectRepo struct {
	DB *config.DB
}

func NewProjectRepo(db *config.DB) ProjectRepo{
	return ProjectRepo{DB: db}
}

func (r *ProjectRepo) CreateProjects(project *models.Project, userid string) (*models.Project, error) {
	err := r.DB.Gorm.Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(project).Error; err != nil {
			return err
		}
		projectUser := models.ProjectUser{
			UserID: userid,
			ProjectID: project.ID,
		}
		if err := tx.Create(&projectUser).Error; err != nil {
			return err
		}
		return nil
	})
	if err != nil {
		return nil, err
	}
	return project, nil
}

func (r *ProjectRepo) GetAllProject(userid string) ([]models.Project, error){
	projects := make([]models.Project, 0)
	err := r.DB.Gorm.Joins("JOIN project_users ON project_users.project_id = projects.id").Where("project_users.user_id = ?", userid).Find(&projects).Error
	if err != nil {
		return nil, err
	}
	return projects, nil
}

func (r *ProjectRepo) GetProject(projectID string) (*models.Project, error){
	var project models.Project
	err := r.DB.Gorm.Preload("Canvas").Where("id = ?", projectID).First(&project).Error; if err != nil{
		return nil, err
	}
	return &project, nil
}

func (r *ProjectRepo) UpdateProject(projectID string, updatedData *models.Project) (*models.Project, error) {
	err := r.DB.Gorm.Model(&models.Project{}).Where("id = ?", projectID).Updates(updatedData).Error
	if err != nil {
		return nil, err
	}
	return r.GetProject(projectID)
}