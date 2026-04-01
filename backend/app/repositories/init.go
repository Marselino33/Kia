package repositories

import (
	"sejiwa-backend/pkg/config"

	"gorm.io/gorm"
)

type Main struct {
	Pengguna *PenggunaRepository
	Anak     *AnakRepository
	Vaksin   *VaksinRepository
	Riwayat  *RiwayatRepository
}

type Options struct {
	Postgres *gorm.DB
	Config   *config.Config
}

func Init(opts Options) *Main {
	return &Main{
		Pengguna: NewPenggunaRepository(opts.Postgres),
		Anak:     NewAnakRepository(opts.Postgres),
		Vaksin:   NewVaksinRepository(opts.Postgres),
		Riwayat:  NewRiwayatRepository(opts.Postgres),
	}
}
