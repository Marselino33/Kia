package usecases

import (
	"errors"
	"fmt"
	"time"

	"sejiwa-backend/app/models"
	"sejiwa-backend/app/repositories"
)

// AnakUseCase menangani CRUD data anak beserta perhitungan usia dan vaksin berikutnya.
type AnakUseCase struct {
	anakRepo *repositories.AnakRepository
}

func NewAnakUseCase(anakRepo *repositories.AnakRepository) *AnakUseCase {
	return &AnakUseCase{
		anakRepo: anakRepo,
	}
}

// ListAnak mengembalikan semua anak milik pengguna beserta info usia dan vaksin berikutnya.
func (u *AnakUseCase) ListAnak(penggunaID string) ([]models.AnakResponse, error) {
	list, err := u.anakRepo.FindByPenggunaID(penggunaID)
	if err != nil {
		return nil, err
	}

	result := make([]models.AnakResponse, 0, len(list))
	for _, a := range list {
		resp, err := u.toAnakResponse(&a)
		if err != nil {
			return nil, err
		}
		result = append(result, resp)
	}
	return result, nil
}

// GetAnak mengembalikan detail satu anak.
func (u *AnakUseCase) GetAnak(id, penggunaID string) (*models.AnakResponse, error) {
	anak, err := u.anakRepo.FindByIDAndPenggunaID(id, penggunaID)
	if err != nil {
		return nil, errors.New("data anak tidak ditemukan")
	}
	resp, err := u.toAnakResponse(anak)
	if err != nil {
		return nil, err
	}
	return &resp, nil
}

// CreateAnak menambahkan data anak baru untuk pengguna yang bersangkutan.
func (u *AnakUseCase) CreateAnak(penggunaID string, req models.CreateAnakRequest) (*models.AnakResponse, error) {
	tanggalLahir, err := time.Parse("2006-01-02", req.TanggalLahir)
	if err != nil {
		return nil, errors.New("format tanggal_lahir tidak valid, gunakan YYYY-MM-DD")
	}

	anak := &models.Anak{
		PenggunaID:    penggunaID,
		Nama:          req.Nama,
		TanggalLahir:  tanggalLahir,
		JenisKelamin:  req.JenisKelamin,
		BeratLahirKg:  req.BeratLahirKg,
		GolonganDarah: req.GolonganDarah,
	}

	if err := u.anakRepo.Create(anak); err != nil {
		return nil, err
	}

	resp, err := u.toAnakResponse(anak)
	if err != nil {
		return nil, err
	}
	return &resp, nil
}

// UpdateAnak memperbarui data anak yang sudah ada.
func (u *AnakUseCase) UpdateAnak(id, penggunaID string, req models.UpdateAnakRequest) (*models.AnakResponse, error) {
	anak, err := u.anakRepo.FindByIDAndPenggunaID(id, penggunaID)
	if err != nil {
		return nil, errors.New("data anak tidak ditemukan")
	}

	if req.Nama != "" {
		anak.Nama = req.Nama
	}
	if req.TanggalLahir != "" {
		t, err := time.Parse("2006-01-02", req.TanggalLahir)
		if err != nil {
			return nil, errors.New("format tanggal_lahir tidak valid, gunakan YYYY-MM-DD")
		}
		anak.TanggalLahir = t
	}
	if req.JenisKelamin != "" {
		anak.JenisKelamin = req.JenisKelamin
	}
	if req.BeratLahirKg != nil {
		anak.BeratLahirKg = req.BeratLahirKg
	}
	if req.GolonganDarah != nil {
		anak.GolonganDarah = req.GolonganDarah
	}

	if err := u.anakRepo.Update(anak); err != nil {
		return nil, err
	}

	resp, err := u.toAnakResponse(anak)
	if err != nil {
		return nil, err
	}
	return &resp, nil
}

// DeleteAnak menghapus data anak (soft delete).
func (u *AnakUseCase) DeleteAnak(id, penggunaID string) error {
	_, err := u.anakRepo.FindByIDAndPenggunaID(id, penggunaID)
	if err != nil {
		return errors.New("data anak tidak ditemukan")
	}
	return u.anakRepo.Delete(id, penggunaID)
}

// toAnakResponse mengkonversi entitas Anak ke response DTO lengkap dengan usia dan vaksin berikutnya.
func (u *AnakUseCase) toAnakResponse(anak *models.Anak) (models.AnakResponse, error) {
	usiaBulan := HitungUsiaBulan(anak.TanggalLahir)

	return models.AnakResponse{
		ID:               anak.ID,
		Nama:             anak.Nama,
		TanggalLahir:     anak.TanggalLahir.Format("2006-01-02"),
		JenisKelamin:     anak.JenisKelamin,
		UsiaBulan:        usiaBulan,
		UsiaTeks:         FormatUsiaTeks(usiaBulan),
		BeratLahirKg:     anak.BeratLahirKg,
		GolonganDarah:    anak.GolonganDarah,
		VaksinBerikutnya: "",
	}, nil
}

// HitungUsiaBulan menghitung usia anak dalam bulan penuh.
func HitungUsiaBulan(tanggalLahir time.Time) int {
	now := time.Now()
	years := now.Year() - tanggalLahir.Year()
	months := int(now.Month()) - int(tanggalLahir.Month())
	total := years*12 + months
	if now.Day() < tanggalLahir.Day() {
		total--
	}
	if total < 0 {
		return 0
	}
	return total
}

// FormatUsiaTeks mengubah bulan menjadi teks usia yang mudah dibaca.
func FormatUsiaTeks(bulan int) string {
	if bulan == 0 {
		return "0 bulan"
	}
	if bulan < 12 {
		return fmt.Sprintf("%d bulan", bulan)
	}
	tahun := bulan / 12
	sisa := bulan % 12
	if sisa == 0 {
		return fmt.Sprintf("%d tahun", tahun)
	}
	return fmt.Sprintf("%d tahun %d bulan", tahun, sisa)
}
