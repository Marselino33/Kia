package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Content merepresentasikan artikel edukasi kesehatan ibu dan anak.
type Content struct {
	ID          string         `json:"id" gorm:"primaryKey;type:varchar(36)"`
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
