package controllers

import (
	"kia/app/repositories"
	"kia/app/usecases"
	"kia/pkg/config"

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
	Repo     *repositories.Main
	DB       *gorm.DB
}

func Init(opts Options) *Main {
	return &Main{
		Auth:   NewAuthController(opts.UseCases.Auth),
		Anak:   NewAnakController(opts.UseCases.Anak),
		Master: NewMasterController(opts.UseCases.Master, opts.DB, opts.Repo.Quiz),
		Gizi:   NewGiziController(opts.DB),
		Admin:  NewAdminController(opts.DB, opts.Repo.Quiz, opts.Repo.KontenV2),
		Mental: NewMentalHealthController(opts.Config),
	}
}

