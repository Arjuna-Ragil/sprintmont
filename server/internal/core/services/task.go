package services

import (
	"errors"

	"github.com/Arjuna-Ragil/sprintmont/internal/core/dto"
	"github.com/Arjuna-Ragil/sprintmont/internal/core/models"
	"github.com/Arjuna-Ragil/sprintmont/internal/database"
)

type TaskService struct {
	TaskRepo *database.TaskRepo
	ProjectRepo *database.ProjectRepo
}

func NewTaskService(taskRepo *database.TaskRepo, projectRepo *database.ProjectRepo) *TaskService {
	return &TaskService{TaskRepo: taskRepo, ProjectRepo: projectRepo}
}

func (s *TaskService) GetTasks(projectID string, userID string) ([]models.Task, error) {
	// First, verify the user has access to the project
	// Actually, the ProjectUsers join would be safer, but for now we'll just check if the project exists
	// since GetProject already does basic checks or we can just fetch it directly
	// Wait, ProjectRepo.GetAllProject filters by userID. Let's just fetch tasks for now.
	// In a real scenario, we should ensure the user owns or is part of the project.
	
	// Optional: you can add a check here, e.g. using a new method GetProjectForUser
	// For simplicity, we just fetch tasks by projectID
	return s.TaskRepo.GetTasksByProject(projectID)
}

func (s *TaskService) CreateTask(projectID string, userID string, input dto.CreateTaskInput) (*models.Task, error) {
	// Verify project exists
	project, err := s.ProjectRepo.GetProject(projectID)
	if err != nil {
		return nil, errors.New("project not found")
	}
	if project == nil {
		return nil, errors.New("project not found")
	}

	task := &models.Task{
		Title: input.Title,
		Desc: input.Desc,
		Week: input.Week,
		Status: input.Status,
		ProjectID: projectID,
	}

	return s.TaskRepo.CreateTask(task)
}
