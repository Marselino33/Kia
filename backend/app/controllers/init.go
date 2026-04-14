package controllers

import (
	"sejiwa-backend/app/usecases"
	"sejiwa-backend/pkg/config"

	"gorm.io/gorm"
)

// Main mengumpulkan semua controller SEJIWA dalam satu struct.
type Main struct {
	Auth   *AuthController
	Anak   *AnakController
	Master *MasterController
	Gizi   *GiziController
	Admin  *AdminController
	Mental *MentalHealthController
}

type Options struct {
	Config   *config.Config
	UseCases *usecases.Main
	DB       *gorm.DB
}

func Init(opts Options) *Main {
	return &Main{
		Auth:   NewAuthController(opts.UseCases.Auth),
		Anak:   NewAnakController(opts.UseCases.Anak),
		Master: NewMasterController(opts.UseCases.Master, opts.DB),
		Gizi:   NewGiziController(),
		Admin:  NewAdminController(opts.DB),
		Mental: NewMentalHealthController(opts.Config),
	}
}
