package repositories

import (
	"sejiwa-backend/app/models"

	"gorm.io/gorm"
)

// PenggunaRepository menangani operasi database untuk entitas Pengguna.
type PenggunaRepository struct {
	db *gorm.DB
}

func NewPenggunaRepository(db *gorm.DB) *PenggunaRepository {
	return &PenggunaRepository{db: db}
}

func (r *PenggunaRepository) Create(pengguna *models.Pengguna) error {
	return r.db.Create(pengguna).Error
}

func (r *PenggunaRepository) FindByEmail(email string) (*models.Pengguna, error) {
	var pengguna models.Pengguna
	err := r.db.Where("email = ?", email).First(&pengguna).Error
	if err != nil {
		return nil, err
	}
	return &pengguna, nil
}

func (r *PenggunaRepository) FindByID(id string) (*models.Pengguna, error) {
	var pengguna models.Pengguna
	err := r.db.Where("id = ?", id).First(&pengguna).Error
	if err != nil {
		return nil, err
	}
	return &pengguna, nil
}

func (r *PenggunaRepository) Update(pengguna *models.Pengguna) error {
	return r.db.Save(pengguna).Error
}
