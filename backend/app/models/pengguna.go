package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Pengguna merepresentasikan pengguna aplikasi (Ibu, Ayah, atau Kader Posyandu).
type Pengguna struct {
	ID           string         `json:"id" gorm:"primaryKey;type:varchar(36)"`
	Nama         string         `json:"nama" gorm:"not null"`
	Email        string         `json:"email" gorm:"uniqueIndex;not null"`
	NoHP         *string        `json:"no_hp,omitempty" gorm:"uniqueIndex"`
	PasswordHash string         `json:"-" gorm:"column:password_hash;not null"`
	Role         string         `json:"role" gorm:"not null;default:'ibu'"` // "ibu" | "admin"
	Desa         string         `json:"desa" gorm:"default:'Hutabulu Mejan'"`
	CreatedAt    time.Time      `json:"created_at"`
	UpdatedAt    time.Time      `json:"updated_at"`
	DeletedAt    gorm.DeletedAt `json:"-" gorm:"index"`
}

func (Pengguna) TableName() string { return "pengguna" }

func (p *Pengguna) BeforeCreate(tx *gorm.DB) error {
	if p.ID == "" {
		p.ID = uuid.New().String()
	}
	return nil
}
