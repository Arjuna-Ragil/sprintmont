package dto

type ProjectInput struct{
	Title      string `form:"title" json:"title"`
	Desc       string `form:"desc" json:"desc"`
	Active     bool   `form:"active" json:"active"`
	BannerURL  string `form:"banner_url" json:"banner_url"`
	Github     string `form:"github" json:"github"`
	Demo       string `form:"demo" json:"demo"`
	PitchDeck  string `form:"pitch_deck" json:"pitch_deck"`
}