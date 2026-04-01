package models

import "time"

// ResepGizi merepresentasikan satu resep makanan bergizi.
type ResepGizi struct {
	ID           int64     `json:"id"`
	Nama         string    `json:"nama"`
	Slug         string    `json:"slug"`
	Deskripsi    string    `json:"deskripsi"`
	Kategori     string    `json:"kategori"`      // sarapan | makan_siang | makan_malam | camilan
	UsiaKategori string    `json:"usia_kategori"` // ibu_hamil | bayi_0_6 | mpasi_6_24 | ibu_menyusui | balita_2_5
	DurasiMenit  int       `json:"durasi_menit"`
	Kalori       int       `json:"kalori"`
	Nutrisi      []string  `json:"nutrisi"`
	GambarURL    string    `json:"gambar_url"`
	IsFavorit    bool      `json:"is_favorit"`
	CreatedAt    time.Time `json:"created_at"`
}

// JadwalMakan merepresentasikan rencana makan pengguna.
type JadwalMakan struct {
	ID         int64      `json:"id"`
	PenggunaID string     `json:"pengguna_id"`
	ResepID    int64      `json:"resep_id"`
	Resep      *ResepGizi `json:"resep,omitempty"`
	Tanggal    string     `json:"tanggal"`
	WaktuMakan string     `json:"waktu_makan"`
	Catatan    string     `json:"catatan,omitempty"`
	CreatedAt  time.Time  `json:"created_at"`
}

// AddJadwalMakanRequest adalah body request untuk POST /gizi/jadwal.
type AddJadwalMakanRequest struct {
	ResepID    int64  `json:"resep_id" validate:"required"`
	Tanggal    string `json:"tanggal" validate:"required"` // "YYYY-MM-DD"
	WaktuMakan string `json:"waktu_makan" validate:"required"`
	Catatan    string `json:"catatan,omitempty"`
}
