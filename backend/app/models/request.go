package models

// ==============================
// Auth Requests
// ==============================

// LoginRequest adalah body request untuk endpoint POST /auth/login.
type LoginRequest struct {
	Email string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
}

// RegisterRequest adalah body request untuk endpoint POST /auth/register.
type RegisterRequest struct {
	Nama  string `json:"nama" validate:"required"`
	Email string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
	Role  string `json:"role" validate:"required,oneof=ibu ayah kader"`
	Desa  string `json:"desa"`
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
// Admin Requests
// ==============================

// AdminCreatePenggunaRequest adalah body request admin untuk POST /admin/pengguna.
type AdminCreatePenggunaRequest struct {
	Nama  string `json:"nama" validate:"required"`
	Email string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
	Role  string `json:"role" validate:"required"` // ibu | ayah | kader | admin
	Desa  string `json:"desa"`
}

// AdminUpdatePenggunaRequest adalah body request admin untuk PUT /admin/pengguna/:id.
type AdminUpdatePenggunaRequest struct {
	Nama  string `json:"nama"`
	Email string `json:"email"`
	Password string `json:"password"`
	Role  string `json:"role"`
	Desa  string `json:"desa"`
}

// ==============================
// Mental Health Requests
// ==============================

// MentalHealthPredictRequest adalah body request untuk POST /mental-health/predict.
type MentalHealthPredictRequest struct {
	Q1  int `json:"q1" validate:"min=0,max=3"`
	Q2  int `json:"q2" validate:"min=0,max=3"`
	Q3  int `json:"q3" validate:"min=0,max=3"`
	Q4  int `json:"q4" validate:"min=0,max=3"`
	Q5  int `json:"q5" validate:"min=0,max=3"`
	Q6  int `json:"q6" validate:"min=0,max=3"`
	Q7  int `json:"q7" validate:"min=0,max=3"`
	Q8  int `json:"q8" validate:"min=0,max=3"`
	Q9  int `json:"q9" validate:"min=0,max=3"`
	Q10 int `json:"q10" validate:"min=0,max=3"`
}

// MentalHealthPredictResult adalah respons dari service ML.
type MentalHealthPredictResult struct {
	Label  string  `json:"label"`
	Score  float64 `json:"score"`
	Advice string  `json:"advice"`
}

// ==============================
// Quiz Requests
// ==============================

// QuizAttemptRecordRequest adalah body request untuk menyimpan attempt kuis user.
type QuizAttemptRecordRequest struct {
	QuizID   string `json:"quiz_id" validate:"required"`
	Score    int    `json:"score"`
	Total    int    `json:"total"`
	Title    string `json:"title"`
	Category string `json:"category"`
	Phase    string `json:"phase"`
}
