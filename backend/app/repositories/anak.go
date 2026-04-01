package repositories

import (
	"sejiwa-backend/app/models"

	"gorm.io/gorm"
)

// AnakRepository menangani operasi database untuk entitas Anak.
type AnakRepository struct {
	db *gorm.DB
}

func NewAnakRepository(db *gorm.DB) *AnakRepository {
	return &AnakRepository{db: db}
}

func (r *AnakRepository) Create(anak *models.Anak) error {
	return r.db.Create(anak).Error
}

func (r *AnakRepository) FindByPenggunaID(penggunaID string) ([]models.Anak, error) {
	var list []models.Anak
	err := r.db.Where("pengguna_id = ?", penggunaID).Order("created_at ASC").Find(&list).Error
	return list, err
}

func (r *AnakRepository) FindByID(id string) (*models.Anak, error) {
	var anak models.Anak
	err := r.db.Where("id = ?", id).First(&anak).Error
	if err != nil {
		return nil, err
	}
	return &anak, nil
}

func (r *AnakRepository) FindByIDAndPenggunaID(id, penggunaID string) (*models.Anak, error) {
	var anak models.Anak
	err := r.db.Where("id = ? AND pengguna_id = ?", id, penggunaID).First(&anak).Error
	if err != nil {
		return nil, err
	}
	return &anak, nil
}

func (r *AnakRepository) Update(anak *models.Anak) error {
	return r.db.Save(anak).Error
}

func (r *AnakRepository) Delete(id, penggunaID string) error {
	return r.db.Where("id = ? AND pengguna_id = ?", id, penggunaID).Delete(&models.Anak{}).Error
}
