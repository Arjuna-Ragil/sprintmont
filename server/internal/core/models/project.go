package models

import "time"

type Project struct {
	ID         string `gorm:"primaryKey" json:"id"`
	Title      string `gorm:"not null" json:"title"`
	Desc       string `json:"desc"`
	Active     bool   `gorm:"not null;default:false" json:"active"`
	BannerURL  string `json:"banner_url"`
	Github     string `json:"github"`
	Demo       string `json:"demo"`
	PitchDeck  string `json:"pitch_deck"`
	Created_At time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"created_at"`
	Updated_At time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"updated_at"`
	ProjectUsers []ProjectUser `gorm:"foreignKey:ProjectID" json:"project_users"`
	Canvas *Canvas `gorm:"foreignKey:ProjectID" json:"canvas,omitempty"`
}

type ProjectUser struct {
	UserID string `gorm:"primaryKey"`
	ProjectID string `gorm:"primaryKey"`
	User User `gorm:"foreignKey:UserID"`
	Project Project `gorm:"foreignKey:ProjectID"`
}