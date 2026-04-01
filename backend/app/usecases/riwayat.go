package usecases

import (
	"errors"
	"time"

	"sejiwa-backend/app/models"
	"sejiwa-backend/app/repositories"
)

// RiwayatUseCase menangani pencatatan dan pengambilan riwayat imunisasi anak.
type RiwayatUseCase struct {
	riwayatRepo *repositories.RiwayatRepository
	vaksinRepo  *repositories.VaksinRepository
	anakRepo    *repositories.AnakRepository
}

func NewRiwayatUseCase(
	riwayatRepo *repositories.RiwayatRepository,
	vaksinRepo *repositories.VaksinRepository,
	anakRepo *repositories.AnakRepository,
) *RiwayatUseCase {
	return &RiwayatUseCase{
		riwayatRepo: riwayatRepo,
		vaksinRepo:  vaksinRepo,
		anakRepo:    anakRepo,
	}
}

// CatatRiwayat menandai satu vaksin sebagai sudah selesai untuk anak tertentu.
func (u *RiwayatUseCase) CatatRiwayat(anakID, penggunaID string, req models.CatatRiwayatRequest) (*models.RiwayatImunisasi, error) {
	// Verifikasi anak milik pengguna ini
	_, err := u.anakRepo.FindByIDAndPenggunaID(anakID, penggunaID)
	if err != nil {
		return nil, errors.New("data anak tidak ditemukan")
	}

	// Cari master vaksin berdasarkan nama (validasi nama vaksin konsisten)
	masterVaksin, err := u.vaksinRepo.FindByNama(req.NamaVaksin)
	if err != nil {
		return nil, errors.New("nama vaksin tidak dikenali, pastikan nama sesuai daftar KIA 2024")
	}

	// Cek apakah sudah dicatat sebelumnya
	existing, _ := u.riwayatRepo.FindByAnakIDAndVaksinName(anakID, req.NamaVaksin)
	if existing != nil {
		return nil, errors.New("vaksin ini sudah tercatat sebelumnya untuk anak ini")
	}

	// Parse tanggal
	tanggalDone, err := time.Parse("2006-01-02", req.TanggalDone)
	if err != nil {
		return nil, errors.New("format tanggal_done tidak valid, gunakan YYYY-MM-DD")
	}

	riwayat := &models.RiwayatImunisasi{
		AnakID:         anakID,
		MasterVaksinID: masterVaksin.ID,
		NamaVaksin:     masterVaksin.NamaVaksin, // gunakan nama canonical dari master
		TanggalDone:    tanggalDone,
		DicatatOleh:    req.DicatatOleh,
		Catatan:        req.Catatan,
	}

	if err := u.riwayatRepo.Create(riwayat); err != nil {
		return nil, err
	}

	return riwayat, nil
}

// ListRiwayat mengembalikan seluruh riwayat imunisasi anak.
func (u *RiwayatUseCase) ListRiwayat(anakID, penggunaID string) ([]models.RiwayatImunisasi, error) {
	// Verifikasi anak milik pengguna ini
	_, err := u.anakRepo.FindByIDAndPenggunaID(anakID, penggunaID)
	if err != nil {
		return nil, errors.New("data anak tidak ditemukan")
	}

	return u.riwayatRepo.FindByAnakID(anakID)
}
