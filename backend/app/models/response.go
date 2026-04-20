package models

type Response struct {
	Error      bool        `json:"error"`
	StatusCode int         `json:"status_code"`
	Message    interface{} `json:"message,omitempty"`
	Data       interface{} `json:"data,omitempty"`
	Details    interface{} `json:"details,omitempty"`
}

type BasicResponse struct {
	Error      bool        `json:"error"`
	StatusCode int         `json:"status_code"`
	Message    interface{} `json:"message,omitempty"`
	Details    interface{} `json:"details,omitempty"`
}

type ResponseWithPaginate struct {
	Error      bool        `json:"error"`
	StatusCode int         `json:"status_code"`
	Message    interface{} `json:"message,omitempty"`
	Data       interface{} `json:"data,omitempty"`
	Details    interface{} `json:"details,omitempty"`
	Pagination *Pagination `json:"pagination,omitempty"`
}

type Pagination struct {
	Page      int `json:"page,omitempty"`
	PageSize  int `json:"page_size,omitempty"`
	Total     int `json:"total,omitempty"`
	TotalPage int `json:"total_page,omitempty"`
}

// PenggunaPublic adalah representasi pengguna yang aman untuk response auth.
type PenggunaPublic struct {
	ID    string `json:"id"`
	Nama  string `json:"nama"`
	Role  string `json:"role"`
	Email string `json:"email"`
	Desa  string `json:"desa"`
}

// AuthResponse adalah payload login/register/refresh.
type AuthResponse struct {
	AccessToken  string        `json:"access_token"`
	RefreshToken string        `json:"refresh_token"`
	Pengguna     PenggunaPublic `json:"pengguna"`
}

// AnakResponse adalah representasi data anak untuk API user/admin.
type AnakResponse struct {
	ID               string   `json:"id"`
	Nama             string   `json:"nama"`
	TanggalLahir     string   `json:"tanggal_lahir"`
	JenisKelamin     string   `json:"jenis_kelamin"`
	UsiaBulan        int      `json:"usia_bulan"`
	UsiaTeks         string   `json:"usia_teks"`
	BeratLahirKg     *float64 `json:"berat_lahir_kg,omitempty"`
	GolonganDarah    *string  `json:"golongan_darah,omitempty"`
	VaksinBerikutnya string   `json:"vaksin_berikutnya,omitempty"`
}
