package dto

type CreateTaskInput struct {
	Title  string `json:"title" binding:"required"`
	Desc   string `json:"desc"`
	Week   string `json:"week" binding:"required"`
	Status string `json:"status" binding:"required"`
}
