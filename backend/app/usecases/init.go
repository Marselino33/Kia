package usecases

import (
	"sejiwa-backend/app/repositories"
	"sejiwa-backend/pkg/config"
)

type Main struct {
	Auth   *AuthUseCase
	Anak   *AnakUseCase
	Master *MasterContentUseCase
}

type Options struct {
	Repository *repositories.Main
	Config     *config.Config
}

func Init(opts Options) *Main {
	return &Main{
		Auth:   NewAuthUseCase(opts.Repository.Pengguna, opts.Config.JWTSecret),
		Anak:   NewAnakUseCase(opts.Repository.Anak),
		Master: NewMasterContentUseCase(),
	}
}
