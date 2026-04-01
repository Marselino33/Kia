package usecases

import (
	"sejiwa-backend/app/models"
	"sejiwa-backend/app/repositories"
)

// MasterUseCase menangani data master vaksin KIA 2024.
type MasterUseCase struct {
	vaksinRepo *repositories.VaksinRepository
}

func NewMasterUseCase(vaksinRepo *repositories.VaksinRepository) *MasterUseCase {
	return &MasterUseCase{vaksinRepo: vaksinRepo}
}

// ListVaksin mengembalikan seluruh 26 vaksin standar KIA 2024.
func (u *MasterUseCase) ListVaksin() ([]models.MasterVaksin, error) {
	return u.vaksinRepo.FindAll()
}

// GetVaksinByID mengembalikan detail satu vaksin berdasarkan ID.
func (u *MasterUseCase) GetVaksinByID(id int) (*models.MasterVaksin, error) {
	return u.vaksinRepo.FindByID(id)
}
