package models

import "time"

// ==============================
// Jadwal Response types
// ==============================

const (
	StatusVaksinSudah    = "sudah"
	StatusVaksinTerlewat = "terlewat"
	StatusVaksinSegera   = "segera"
	StatusVaksinBelum    = "belum"
)

// VaksinStatusItem mendeskripsikan status satu vaksin untuk seorang anak.
type VaksinStatusItem struct {
	NamaVaksin    string     `json:"nama_vaksin"`
	UsiaPemberian string     `json:"usia_pemberian"` // ex: "2 bulan"
	Deskripsi     string     `json:"deskripsi"`
	Status        string     `json:"status"` // sudah | segera | terlewat | belum
	TanggalDone   *time.Time `json:"tanggal_done"`
}

// JadwalBulan mengelompokkan vaksin berdasarkan usia bulan.
type JadwalBulan struct {
	UsiaBulan  int                `json:"usia_bulan"`
	LabelUsia  string             `json:"label_usia"`
	Keterangan string             `json:"keterangan"`
	VaksinList []VaksinStatusItem `json:"vaksin_list"`
}

// RingkasanJadwal adalah summary hitungan status vaksin anak.
type RingkasanJadwal struct {
	Sudah    int `json:"sudah"`
	Segera   int `json:"segera"`
	Terlewat int `json:"terlewat"`
	Belum    int `json:"belum"`
	Total    int `json:"total"`
}

// JadwalResponse adalah response lengkap GET /anak/:id/jadwal.
type JadwalResponse struct {
	AnakID    string          `json:"anak_id"`
	UsiaBulan int             `json:"usia_bulan"`
	UsiaTeks  string          `json:"usia_teks"`
	Jadwal    []JadwalBulan   `json:"jadwal"`
	Ringkasan RingkasanJadwal `json:"ringkasan"`
}

// ==============================
// Anak Response types
// ==============================

// AnakResponse adalah response untuk GET /anak dan GET /anak/:id.
type AnakResponse struct {
	ID               string   `json:"id"`
	Nama             string   `json:"nama"`
	TanggalLahir     string   `json:"tanggal_lahir"` // "YYYY-MM-DD"
	JenisKelamin     string   `json:"jenis_kelamin"`
	UsiaBulan        int      `json:"usia_bulan"`
	UsiaTeks         string   `json:"usia_teks"`
	BeratLahirKg     *float64 `json:"berat_lahir_kg,omitempty"`
	GolonganDarah    *string  `json:"golongan_darah,omitempty"`
	VaksinBerikutnya string   `json:"vaksin_berikutnya"`
}

// ==============================
// Auth Response types
// ==============================

// PenggunaPublic adalah data pengguna tanpa pin_hash yang dikembalikan ke client.
type PenggunaPublic struct {
	ID   string `json:"id"`
	Nama string `json:"nama"`
	Role string `json:"role"`
	NoHP string `json:"no_hp"`
	Desa string `json:"desa"`
}

// AuthResponse adalah response untuk login dan register.
type AuthResponse struct {
	AccessToken  string         `json:"access_token"`
	RefreshToken string         `json:"refresh_token"`
	Pengguna     PenggunaPublic `json:"pengguna"`
}
