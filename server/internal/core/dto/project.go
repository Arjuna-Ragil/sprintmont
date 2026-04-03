package dto

type ProjectInput struct{
	Title      string `gorm:"not null" json:"title"`
	Desc       string `json:"desc"`
	Active     bool   `gorm:"not null;default:false" json:"active"`
	BannerURL  string `json:"banner_url"`
	Github     string `json:"github"`
	Demo       string `json:"demo"`
	PitchDeck  string `json:"pitch_deck"`
}