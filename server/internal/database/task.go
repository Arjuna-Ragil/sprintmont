package database

import (
	"github.com/Arjuna-Ragil/sprintmont/internal/config"
	"github.com/Arjuna-Ragil/sprintmont/internal/core/models"
)

type TaskRepo struct {
	DB *config.DB
}

func NewTaskRepo(db *config.DB) *TaskRepo {
	return &TaskRepo{DB: db}
}

func (r *TaskRepo) GetTasksByProject(projectID string) ([]models.Task, error) {
	var tasks []models.Task
	err := r.DB.Gorm.Where("project_id = ?", projectID).Find(&tasks).Error
	if err != nil {
		return nil, err
	}
	return tasks, nil
}

func (r *TaskRepo) CreateTask(task *models.Task) (*models.Task, error) {
	err := r.DB.Gorm.Create(task).Error
	if err != nil {
		return nil, err
	}
	return task, nil
}
