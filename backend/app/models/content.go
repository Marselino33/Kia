package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Content merepresentasikan artikel edukasi kesehatan ibu dan anak.
type Content struct {
	ID          string         `json:"id" gorm:"primaryKey;type:varchar(36)"`
	AdminID     string         `json:"admin_id" gorm:"column:admin_id;type:varchar(36);index"`
	Admin       *Pengguna      `json:"admin,omitempty" gorm:"foreignKey:AdminID;references:ID"`
	Slug        string         `json:"slug" gorm:"uniqueIndex;not null"`
	Judul       string         `json:"judul" gorm:"not null"`
	Ringkasan   string         `json:"ringkasan"`
	Isi         string         `json:"isi" gorm:"type:text"`
	Kategori    string         `json:"kategori"` // Gizi | Imunisasi | Kesehatan | PHBS | dll
	Phase       string         `json:"phase"`    // kehamilan_1 | kehamilan_2 | kehamilan_3 | bayi | balita | dll
	Tags        string         `json:"tags"`     // CSV: "gizi,kehamilan"
	GambarURL   string         `json:"gambar_url"`
	ReadMinutes int            `json:"read_minutes" gorm:"default:5"`
	IsPublished bool           `json:"is_published" gorm:"default:true"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `json:"-" gorm:"index"`
}

func (Content) TableName() string { return "contents" }

func (c *Content) BeforeCreate(tx *gorm.DB) error {
	if c.ID == "" {
		c.ID = uuid.New().String()
	}
	return nil
}

// CreateContentRequest adalah body request admin untuk POST /admin/content.
type CreateContentRequest struct {
	Slug        string `json:"slug" validate:"required"`
	Judul       string `json:"judul" validate:"required"`
	Ringkasan   string `json:"ringkasan"`
	Isi         string `json:"isi"`
	Kategori    string `json:"kategori"`
	Phase       string `json:"phase"`
	Tags        string `json:"tags"`
	GambarURL   string `json:"gambar_url"`
	ReadMinutes int    `json:"read_minutes"`
	IsPublished *bool  `json:"is_published"`
}

// UpdateContentRequest adalah body request admin untuk PUT /admin/content/:id.
type UpdateContentRequest struct {
	Slug        string `json:"slug"`
	Judul       string `json:"judul"`
	Ringkasan   string `json:"ringkasan"`
	Isi         string `json:"isi"`
	Kategori    string `json:"kategori"`
	Phase       string `json:"phase"`
	Tags        string `json:"tags"`
	GambarURL   string `json:"gambar_url"`
	ReadMinutes int    `json:"read_minutes"`
	IsPublished *bool  `json:"is_published"`
}

// CreateParentingContentRequest merepresentasikan form admin parenting.
type CreateParentingContentRequest struct {
	Slug        string `json:"slug" validate:"required"`
	Judul       string `json:"judul" validate:"required"`
	Kategori    string `json:"kategori"` // stimulus_anak | pola_asuh
	UsiaLabel   string `json:"usia_label"`
	Ringkasan   string `json:"ringkasan"`
	Isi         string `json:"isi"`
	GambarURL   string `json:"gambar_url"`
	ReadMinutes int    `json:"read_minutes"`
	IsPublished *bool  `json:"is_published"`
}

// CreateGiziIbuContentRequest merepresentasikan form admin gizi ibu.
type CreateGiziIbuContentRequest struct {
	Slug      string `json:"slug" validate:"required"`
	Judul     string `json:"judul" validate:"required"`
	Kategori  string `json:"kategori"` // trimester_1 | trimester_2 | trimester_3 | menyusui
	Ringkasan string `json:"ringkasan"`
	Isi       string `json:"isi"`
	GambarURL string `json:"gambar_url"`
}

// CreateGiziAnakContentRequest merepresentasikan form admin gizi anak.
type CreateGiziAnakContentRequest struct {
	Slug        string `json:"slug" validate:"required"`
	Judul       string `json:"judul" validate:"required"`
	RentangUsia string `json:"rentang_usia"`
	Ringkasan   string `json:"ringkasan"`
	Isi         string `json:"isi"`
	GambarURL   string `json:"gambar_url"`
}

// CreateMentalOrangTuaContentRequest merepresentasikan form admin mental.
type CreateMentalOrangTuaContentRequest struct {
	Slug        string `json:"slug" validate:"required"`
	Judul       string `json:"judul" validate:"required"`
	Kategori    string `json:"kategori"` // baby-blues | ppd | kecemasan | burnout
	Ringkasan   string `json:"ringkasan"`
	Isi         string `json:"isi"`
	GambarURL   string `json:"gambar_url"`
	ReadMinutes int    `json:"read_minutes"`
	IsPublished *bool  `json:"is_published"`
}

// CreateInformasiUmumContentRequest merepresentasikan form admin informasi umum.
type CreateInformasiUmumContentRequest struct {
	Slug      string `json:"slug" validate:"required"`
	Judul     string `json:"judul" validate:"required"`
	Kategori  string `json:"kategori"` // phbs | gigi | perawatan-anak | keamanan | bencana | dll
	Ringkasan string `json:"ringkasan"`
	Isi       string `json:"isi"`
	GambarURL string `json:"gambar_url"`
}

// PolaAsuh merepresentasikan artikel pola asuh anak.
type PolaAsuh struct {
	ID             string         `json:"id" gorm:"primaryKey;type:varchar(36)"`
	AdminID        string         `json:"admin_id" gorm:"column:admin_id;type:varchar(36);index"`
	Admin          *Pengguna      `json:"admin,omitempty" gorm:"foreignKey:AdminID;references:ID"`
	Slug           string         `json:"slug" gorm:"uniqueIndex;not null"`
	Judul          string         `json:"judul" gorm:"not null"`
	Ringkasan      string         `json:"ringkasan"`
	Isi            string         `json:"isi" gorm:"type:text"`
	Kategori       string         `json:"kategori"`                         // tahap-bayi | tahap-salita | tahap-pra-sekolah | tahap-sekolah
	Phase          string         `json:"phase"`                            // rentang usia: 0-3 Bulan, 3-6 Bulan, dll
	LangkahPraktis string         `json:"langkah_praktis" gorm:"type:text"` // JSON array
	GambarURL      string         `json:"gambar_url"`
	ReadMinutes    int            `json:"read_minutes" gorm:"default:5"`
	IsPublished    bool           `json:"is_published" gorm:"default:true"`
	CreatedAt      time.Time      `json:"created_at"`
	UpdatedAt      time.Time      `json:"updated_at"`
	DeletedAt      gorm.DeletedAt `json:"-" gorm:"index"`
}

func (PolaAsuh) TableName() string { return "pola_asuh" }

func (p *PolaAsuh) BeforeCreate(tx *gorm.DB) error {
	if p.ID == "" {
		p.ID = uuid.New().String()
	}
	return nil
}

func (p *PolaAsuh) BeforeSave(tx *gorm.DB) error {
	if p.ID == "" {
		p.ID = uuid.New().String()
	}
	return nil
}
