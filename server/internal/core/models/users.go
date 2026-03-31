package models

type User struct{
	ID string `gorm:"primaryKey" json:"id"`
	Username string `gorm:"not null" json:"username"`
	Email string `gorm:"not null" json:"email"`
	ProfileURL string `json:"profile_url"`
	ProjectUsers []ProjectUser `gorm:"foreignKey:UserID" json:"project_users"`
}