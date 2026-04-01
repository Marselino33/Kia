package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Anak merepresentasikan data anak yang terdaftar oleh pengguna.
type Anak struct {
	ID            string         `json:"id" gorm:"primaryKey;type:varchar(36)"`
	PenggunaID    string         `json:"pengguna_id" gorm:"type:varchar(36);not null;index"`
	Pengguna      *Pengguna      `json:"pengguna,omitempty" gorm:"foreignKey:PenggunaID"`
	Nama          string         `json:"nama" gorm:"not null"`
	TanggalLahir  time.Time      `json:"tanggal_lahir" gorm:"not null"`
	JenisKelamin  string         `json:"jenis_kelamin" gorm:"not null"` // "laki-laki" | "perempuan"
	BeratLahirKg  *float64       `json:"berat_lahir_kg,omitempty"`
	GolonganDarah *string        `json:"golongan_darah,omitempty"`
	CreatedAt     time.Time      `json:"created_at"`
	UpdatedAt     time.Time      `json:"updated_at"`
	DeletedAt     gorm.DeletedAt `json:"-" gorm:"index"`
}

func (Anak) TableName() string { return "anak" }

func (a *Anak) BeforeCreate(tx *gorm.DB) error {
	if a.ID == "" {
		a.ID = uuid.New().String()
	}
	return nil
}
