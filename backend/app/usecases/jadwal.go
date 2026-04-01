package usecases

import (
	"fmt"
	"time"

	"sejiwa-backend/app/models"
	"sejiwa-backend/app/repositories"
)

// JadwalUseCase menangani kalkulasi jadwal imunisasi berdasarkan usia anak dan riwayat.
type JadwalUseCase struct {
	vaksinRepo  *repositories.VaksinRepository
	riwayatRepo *repositories.RiwayatRepository
	anakRepo    *repositories.AnakRepository
}

func NewJadwalUseCase(
	vaksinRepo *repositories.VaksinRepository,
	riwayatRepo *repositories.RiwayatRepository,
	anakRepo *repositories.AnakRepository,
) *JadwalUseCase {
	return &JadwalUseCase{
		vaksinRepo:  vaksinRepo,
		riwayatRepo: riwayatRepo,
		anakRepo:    anakRepo,
	}
}

// GetJadwalAnak menghitung dan mengembalikan jadwal imunisasi lengkap untuk satu anak.
func (u *JadwalUseCase) GetJadwalAnak(anakID string) (*models.JadwalResponse, error) {
	anak, err := u.anakRepo.FindByID(anakID)
	if err != nil {
		return nil, err
	}

	// Ambil semua master vaksin
	allVaksin, err := u.vaksinRepo.FindAll()
	if err != nil {
		return nil, err
	}

	// Ambil riwayat yang sudah selesai (sebagai map)
	doneMap, err := u.riwayatRepo.FindDoneVaksinMap(anakID)
	if err != nil {
		return nil, err
	}

	usiaBulan := HitungUsiaBulan(anak.TanggalLahir)

	// Kelompokkan vaksin berdasarkan usia_bulan
	groupMap := make(map[int][]models.VaksinStatusItem)
	groupOrder := []int{}
	seen := make(map[int]bool)

	ringkasan := models.RingkasanJadwal{}

	for _, v := range allVaksin {
		status := hitungStatusVaksinWithName(v.NamaVaksin, v.UsiaBulan, usiaBulan, doneMap)

		var tanggalDone *time.Time
		if rw, ok := doneMap[v.NamaVaksin]; ok {
			t := rw.TanggalDone
			tanggalDone = &t
		}

		item := models.VaksinStatusItem{
			NamaVaksin:    v.NamaVaksin,
			UsiaPemberian: v.UsiaTeks,
			Deskripsi:     v.Deskripsi,
			Status:        status,
			TanggalDone:   tanggalDone,
		}

		switch status {
		case models.StatusVaksinSudah:
			ringkasan.Sudah++
		case models.StatusVaksinSegera:
			ringkasan.Segera++
		case models.StatusVaksinTerlewat:
			ringkasan.Terlewat++
		case models.StatusVaksinBelum:
			ringkasan.Belum++
		}
		ringkasan.Total++

		if !seen[v.UsiaBulan] {
			groupOrder = append(groupOrder, v.UsiaBulan)
			seen[v.UsiaBulan] = true
		}
		groupMap[v.UsiaBulan] = append(groupMap[v.UsiaBulan], item)
	}

	// Bangun slice JadwalBulan terurut
	jadwal := make([]models.JadwalBulan, 0, len(groupOrder))
	for _, bulan := range groupOrder {
		jadwal = append(jadwal, models.JadwalBulan{
			UsiaBulan:  bulan,
			LabelUsia:  FormatLabelUsia(bulan),
			Keterangan: KeteranganLokasi(bulan),
			VaksinList: groupMap[bulan],
		})
	}

	return &models.JadwalResponse{
		AnakID:    anakID,
		UsiaBulan: usiaBulan,
		UsiaTeks:  FormatUsiaTeks(usiaBulan),
		Jadwal:    jadwal,
		Ringkasan: ringkasan,
	}, nil
}

// CariVaksinBerikutnya mencari vaksin yang paling perlu segera diberikan.
// Prioritas: segera → terlewat → belum (urutan pertama)
func (u *JadwalUseCase) CariVaksinBerikutnya(anakID string) (string, error) {
	jadwalResp, err := u.GetJadwalAnak(anakID)
	if err != nil {
		return "", err
	}
	return cariVaksinBerikutnyadarJadwal(jadwalResp), nil
}

// ==============================
// Pure functions (helper)
// ==============================

// HitungUsiaBulan menghitung usia anak dalam bulan penuh dari tanggal lahir hingga hari ini.
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

// FormatUsiaTeks mengubah bulan menjadi teks yang mudah dibaca: "2 bulan", "1 tahun 3 bulan".
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

// FormatLabelUsia menghasilkan label usia seperti "0 Bulan", "2 Tahun", "5 Tahun".
func FormatLabelUsia(bulan int) string {
	if bulan == 0 {
		return "Baru Lahir (0 Bulan)"
	}
	if bulan < 12 {
		return fmt.Sprintf("%d Bulan", bulan)
	}
	tahun := bulan / 12
	sisa := bulan % 12
	if sisa == 0 {
		return fmt.Sprintf("%d Tahun", tahun)
	}
	return fmt.Sprintf("%d Tahun %d Bulan", tahun, sisa)
}

// KeteranganLokasi mengembalikan info lokasi pemberian vaksin berdasarkan usia.
func KeteranganLokasi(usiaBulan int) string {
	if usiaBulan == 0 {
		return "Diberikan saat lahir di fasilitas kesehatan"
	}
	if usiaBulan >= 24 {
		return "Puskesmas Balige"
	}
	return "Posyandu Mejan atau Puskesmas Balige"
}

// HitungStatusVaksin menghitung status satu vaksin berdasarkan usia anak dan riwayat.
func HitungStatusVaksin(usiaBulanVaksin, usiaBulanAnak int, doneMap map[string]models.RiwayatImunisasi) string {
	// Cek dari nama di parameter — pamanggil harus periksa nama di doneMap
	// Fungsi ini dipakai dengan pemanggil yang sudah punya nama vaksin untuk dicek.
	// Karena kita tidak punya nama di sini, fungsi ini digunakan dalam loop di GetJadwalAnak.
	// (versi dengan nama dipindah ke dalam loop)
	if usiaBulanVaksin < usiaBulanAnak {
		return models.StatusVaksinTerlewat
	}
	if usiaBulanVaksin <= usiaBulanAnak+1 {
		return models.StatusVaksinSegera
	}
	return models.StatusVaksinBelum
}

// hitungStatusVaksinWithName menghitung status satu vaksin dengan mempertimbangkan riwayat.
func hitungStatusVaksinWithName(namaVaksin string, usiaBulanVaksin, usiaBulanAnak int, doneMap map[string]models.RiwayatImunisasi) string {
	if _, sudah := doneMap[namaVaksin]; sudah {
		return models.StatusVaksinSudah
	}
	if usiaBulanVaksin < usiaBulanAnak {
		return models.StatusVaksinTerlewat
	}
	if usiaBulanVaksin <= usiaBulanAnak+1 {
		return models.StatusVaksinSegera
	}
	return models.StatusVaksinBelum
}

func cariVaksinBerikutnyadarJadwal(resp *models.JadwalResponse) string {
	// Prioritas: segera
	for _, bulan := range resp.Jadwal {
		for _, v := range bulan.VaksinList {
			if v.Status == models.StatusVaksinSegera {
				return v.NamaVaksin
			}
		}
	}
	// Fallback: terlewat
	for _, bulan := range resp.Jadwal {
		for _, v := range bulan.VaksinList {
			if v.Status == models.StatusVaksinTerlewat {
				return v.NamaVaksin
			}
		}
	}
	// Fallback: belum (yang pertama)
	for _, bulan := range resp.Jadwal {
		for _, v := range bulan.VaksinList {
			if v.Status == models.StatusVaksinBelum {
				return v.NamaVaksin
			}
		}
	}
	return "Semua vaksin sudah selesai"
}
