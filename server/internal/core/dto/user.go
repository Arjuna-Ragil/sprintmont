package dto

type UpdateUserInput struct {
	Username   string `form:"username" json:"username" binding:"required"`
	ProfileURL string `form:"profile_url" json:"profile_url"`
}
