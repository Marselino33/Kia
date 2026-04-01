package usecases

import (
	"sejiwa-backend/app/repositories"
	"sejiwa-backend/pkg/config"
)

type Main struct {
	Auth    *AuthUseCase
	Anak    *AnakUseCase
	Jadwal  *JadwalUseCase
	Riwayat *RiwayatUseCase
	Master  *MasterUseCase
}

type Options struct {
	Repository *repositories.Main
	Config     *config.Config
}

func Init(opts Options) *Main {
	jadwal := NewJadwalUseCase(
		opts.Repository.Vaksin,
		opts.Repository.Riwayat,
		opts.Repository.Anak,
	)

	return &Main{
		Auth:    NewAuthUseCase(opts.Repository.Pengguna, opts.Config.JWTSecret),
		Anak:    NewAnakUseCase(opts.Repository.Anak, jadwal),
		Jadwal:  jadwal,
		Riwayat: NewRiwayatUseCase(opts.Repository.Riwayat, opts.Repository.Vaksin, opts.Repository.Anak),
		Master:  NewMasterUseCase(opts.Repository.Vaksin),
	}
}
