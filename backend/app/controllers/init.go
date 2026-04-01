package controllers

import (
	"sejiwa-backend/app/usecases"
	"sejiwa-backend/pkg/config"

	"gorm.io/gorm"
)

// Main mengumpulkan semua controller SEJIWA dalam satu struct.
type Main struct {
	Auth    *AuthController
	Anak    *AnakController
	Jadwal  *JadwalController
	Riwayat *RiwayatController
	Master  *MasterController
	Gizi    *GiziController
	Admin   *AdminController
}

type Options struct {
	Config   *config.Config
	UseCases *usecases.Main
	DB       *gorm.DB
}

func Init(opts Options) *Main {
	return &Main{
		Auth:    NewAuthController(opts.UseCases.Auth),
		Anak:    NewAnakController(opts.UseCases.Anak),
		Jadwal:  NewJadwalController(opts.UseCases.Jadwal),
		Riwayat: NewRiwayatController(opts.UseCases.Riwayat),
		Master:  NewMasterController(opts.UseCases.Master, opts.DB),
		Gizi:    NewGiziController(),
		Admin:   NewAdminController(opts.DB),
	}
}
