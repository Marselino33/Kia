package repositories

import (
	"sejiwa-backend/app/models"

	"gorm.io/gorm"
)

// VaksinRepository menangani operasi database untuk entitas MasterVaksin.
type VaksinRepository struct {
	db *gorm.DB
}

func NewVaksinRepository(db *gorm.DB) *VaksinRepository {
	return &VaksinRepository{db: db}
}

func (r *VaksinRepository) FindAll() ([]models.MasterVaksin, error) {
	var list []models.MasterVaksin
	err := r.db.Order("usia_bulan ASC, id ASC").Find(&list).Error
	return list, err
}

func (r *VaksinRepository) FindByID(id int) (*models.MasterVaksin, error) {
	var v models.MasterVaksin
	err := r.db.Where("id = ?", id).First(&v).Error
	if err != nil {
		return nil, err
	}
	return &v, nil
}

func (r *VaksinRepository) FindByNama(nama string) (*models.MasterVaksin, error) {
	var v models.MasterVaksin
	err := r.db.Where("nama_vaksin = ?", nama).First(&v).Error
	if err != nil {
		return nil, err
	}
	return &v, nil
}

func (r *VaksinRepository) Count() (int64, error) {
	var count int64
	err := r.db.Model(&models.MasterVaksin{}).Count(&count).Error
	return count, err
}

func (r *VaksinRepository) BulkCreate(list []models.MasterVaksin) error {
	return r.db.Create(&list).Error
}
