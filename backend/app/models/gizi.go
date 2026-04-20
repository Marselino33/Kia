package models

import (
	"time"

	"gorm.io/gorm"
)

// ResepGiziDB adalah versi database-backed dari Resep MPASI.
type ResepGiziDB struct {
	ID           int64          `json:"id" gorm:"primaryKey;autoIncrement"`
	Nama         string         `json:"nama" gorm:"not null"`
	Slug         string         `json:"slug" gorm:"uniqueIndex;not null"`
	Deskripsi    string         `json:"deskripsi" gorm:"type:text"`
	Kategori     string         `json:"kategori"`      // sarapan | makan_siang | makan_malam | camilan
	UsiaKategori string         `json:"usia_kategori"` // ibu_hamil | bayi_0_6 | mpasi_6_24 | ibu_menyusui | balita_2_5
	DurasiMenit  int            `json:"durasi_menit"`
	Kalori       int            `json:"kalori"`
	Nutrisi      string         `json:"nutrisi" gorm:"type:text"` // JSON array string
	GambarURL    string         `json:"gambar_url"`
	IsPublished  bool           `json:"is_published" gorm:"default:true"`
	AdminID      string         `json:"admin_id" gorm:"column:admin_id;type:varchar(36);index"`
	CreatedAt    time.Time      `json:"created_at"`
	UpdatedAt    time.Time      `json:"updated_at"`
	DeletedAt    gorm.DeletedAt `json:"-" gorm:"index"`
}

func (ResepGiziDB) TableName() string { return "resep_gizi" }

// CreateResepRequest adalah body request admin untuk POST /admin/resep-gizi.
type CreateResepRequest struct {
	Nama         string `json:"nama" validate:"required"`
	Slug         string `json:"slug" validate:"required"`
	Deskripsi    string `json:"deskripsi"`
	Kategori     string `json:"kategori"`
	UsiaKategori string `json:"usia_kategori"`
	DurasiMenit  int    `json:"durasi_menit"`
	Kalori       int    `json:"kalori"`
	Nutrisi      string `json:"nutrisi"` // JSON array string
	GambarURL    string `json:"gambar_url"`
	IsPublished  *bool  `json:"is_published"`
}

// UpdateResepRequest adalah body request admin untuk PUT /admin/resep-gizi/:id.
type UpdateResepRequest struct {
	Nama         string `json:"nama"`
	Slug         string `json:"slug"`
	Deskripsi    string `json:"deskripsi"`
	Kategori     string `json:"kategori"`
	UsiaKategori string `json:"usia_kategori"`
	DurasiMenit  int    `json:"durasi_menit"`
	Kalori       int    `json:"kalori"`
	Nutrisi      string `json:"nutrisi"`
	GambarURL    string `json:"gambar_url"`
	IsPublished  *bool  `json:"is_published"`
}
