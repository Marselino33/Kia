package models

// ==============================
// Auth Requests
// ==============================

// LoginRequest adalah body request untuk endpoint POST /auth/login.
type LoginRequest struct {
	NoHP string `json:"no_hp" validate:"required"`
	PIN  string `json:"pin" validate:"required"`
}

// RegisterRequest adalah body request untuk endpoint POST /auth/register.
type RegisterRequest struct {
	Nama string `json:"nama" validate:"required"`
	NoHP string `json:"no_hp" validate:"required"`
	PIN  string `json:"pin" validate:"required"`
	Role string `json:"role" validate:"required,oneof=ibu ayah kader"`
	Desa string `json:"desa"`
}

// RefreshTokenRequest adalah body request untuk endpoint POST /auth/refresh.
type RefreshTokenRequest struct {
	RefreshToken string `json:"refresh_token" validate:"required"`
}

// ==============================
// Anak Requests
// ==============================

// CreateAnakRequest adalah body request untuk POST /anak.
type CreateAnakRequest struct {
	Nama          string   `json:"nama" validate:"required"`
	TanggalLahir  string   `json:"tanggal_lahir" validate:"required"` // "YYYY-MM-DD"
	JenisKelamin  string   `json:"jenis_kelamin" validate:"required,oneof=laki-laki perempuan"`
	BeratLahirKg  *float64 `json:"berat_lahir_kg,omitempty"`
	GolonganDarah *string  `json:"golongan_darah,omitempty"`
}

// UpdateAnakRequest adalah body request untuk PUT /anak/:id.
type UpdateAnakRequest struct {
	Nama          string   `json:"nama"`
	TanggalLahir  string   `json:"tanggal_lahir"` // "YYYY-MM-DD"
	JenisKelamin  string   `json:"jenis_kelamin"`
	BeratLahirKg  *float64 `json:"berat_lahir_kg,omitempty"`
	GolonganDarah *string  `json:"golongan_darah,omitempty"`
}

// ==============================
// Riwayat Requests
// ==============================

// CatatRiwayatRequest adalah body request untuk POST /anak/:id/riwayat.
type CatatRiwayatRequest struct {
	NamaVaksin  string  `json:"nama_vaksin" validate:"required"`
	TanggalDone string  `json:"tanggal_done" validate:"required"` // "YYYY-MM-DD"
	DicatatOleh string  `json:"dicatat_oleh" validate:"required,oneof=ibu kader"`
	Catatan     *string `json:"catatan,omitempty"`
}

// ==============================
// Admin Requests
// ==============================

// AdminCreatePenggunaRequest adalah body request admin untuk POST /admin/pengguna.
type AdminCreatePenggunaRequest struct {
	Nama string `json:"nama" validate:"required"`
	NoHP string `json:"no_hp" validate:"required"`
	PIN  string `json:"pin" validate:"required"`
	Role string `json:"role" validate:"required"` // ibu | ayah | kader | admin
	Desa string `json:"desa"`
}

// AdminUpdatePenggunaRequest adalah body request admin untuk PUT /admin/pengguna/:id.
type AdminUpdatePenggunaRequest struct {
	Nama string `json:"nama"`
	NoHP string `json:"no_hp"`
	PIN  string `json:"pin"`
	Role string `json:"role"`
	Desa string `json:"desa"`
}
