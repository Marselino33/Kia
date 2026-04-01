package repositories

import (
	"sejiwa-backend/app/models"

	"gorm.io/gorm"
)

// RiwayatRepository menangani operasi database untuk entitas RiwayatImunisasi.
type RiwayatRepository struct {
	db *gorm.DB
}

func NewRiwayatRepository(db *gorm.DB) *RiwayatRepository {
	return &RiwayatRepository{db: db}
}

func (r *RiwayatRepository) Create(riwayat *models.RiwayatImunisasi) error {
	return r.db.Create(riwayat).Error
}

// FindByAnakID mengembalikan seluruh riwayat imunisasi anak, diurutkan terbaru dulu.
func (r *RiwayatRepository) FindByAnakID(anakID string) ([]models.RiwayatImunisasi, error) {
	var list []models.RiwayatImunisasi
	err := r.db.Where("anak_id = ?", anakID).Order("tanggal_done DESC").Find(&list).Error
	return list, err
}

// FindDoneVaksinNames mengembalikan kumpulan nama vaksin yang sudah selesai untuk anak tertentu.
func (r *RiwayatRepository) FindDoneVaksinNames(anakID string) ([]string, error) {
	var names []string
	err := r.db.Model(&models.RiwayatImunisasi{}).
		Where("anak_id = ?", anakID).
		Pluck("nama_vaksin", &names).Error
	return names, err
}

// FindByAnakIDAndVaksinName digunakan untuk mencek apakah vaksin sudah dicatat sebelumnya.
func (r *RiwayatRepository) FindByAnakIDAndVaksinName(anakID, namaVaksin string) (*models.RiwayatImunisasi, error) {
	var riwayat models.RiwayatImunisasi
	err := r.db.Where("anak_id = ? AND nama_vaksin = ?", anakID, namaVaksin).First(&riwayat).Error
	if err != nil {
		return nil, err
	}
	return &riwayat, nil
}

// FindDoneVaksinMap mengembalikan map[namaVaksin]tanggalDone untuk keperluan kalkulasi jadwal.
func (r *RiwayatRepository) FindDoneVaksinMap(anakID string) (map[string]models.RiwayatImunisasi, error) {
	list, err := r.FindByAnakID(anakID)
	if err != nil {
		return nil, err
	}
	result := make(map[string]models.RiwayatImunisasi, len(list))
	for _, rw := range list {
		result[rw.NamaVaksin] = rw
	}
	return result, nil
}
