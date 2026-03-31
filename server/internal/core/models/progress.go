package models

import "time"

type Task struct {
	ID         string `gorm:"primaryKey" json:"id"`
	Title      string `gorm:"not null" json:"title"`
	Desc       string `json:"desc"`
	Week       string `gorm:"not null" json:"week"`
	Status     string `gorm:"not null" json:"status"`
	Created_At time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"created_at"`
	Updated_At time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"updated_at"`
}