package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// StimulusAnakV2 merepresentasikan konten parenting (stimulus & pola asuh) per rentang usia.
type StimulusAnakV2 struct {
	ID          string         `json:"id" gorm:"primaryKey;type:varchar(36)"`
	AdminID     string         `json:"admin_id" gorm:"column:admin_id;type:varchar(36);index"`
	Judul       string         `json:"judul" gorm:"not null"`
	Slug        string         `json:"slug" gorm:"not null;uniqueIndex"`
	Ringkasan   string         `json:"ringkasan" gorm:"type:text"`
	Isi         string         `json:"isi" gorm:"type:text"`
	Kategori    string         `json:"kategori"` // parenting | pola_asuh
	Phase       string         `json:"phase"`    // usia_label: 0-3bln | 3-6bln | dll
	Tags        string         `json:"tags"`
	GambarURL   string         `json:"gambar_url"`
	ReadMinutes int            `json:"read_minutes" gorm:"default:5"`
	IsPublished bool           `json:"is_published" gorm:"default:true"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `json:"-" gorm:"index"`
}

func (StimulusAnakV2) TableName() string { return "stimulus_anak" }

func (s *StimulusAnakV2) BeforeCreate(tx *gorm.DB) error {
	if s.ID == "" {
		s.ID = uuid.New().String()
	}
	return nil
}
