package repositories

import (
	"sejiwa-backend/pkg/config"

	"gorm.io/gorm"
)

type Main struct {
	Pengguna *PenggunaRepository
	Anak     *AnakRepository
}

type Options struct {
	Postgres *gorm.DB
	Config   *config.Config
}

func Init(opts Options) *Main {
	return &Main{
		Pengguna: NewPenggunaRepository(opts.Postgres),
		Anak:     NewAnakRepository(opts.Postgres),
	}
}
