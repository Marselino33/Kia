package models

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
