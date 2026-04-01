package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Quiz merepresentasikan sebuah kuis edukasi kesehatan.
type Quiz struct {
	ID          string         `json:"id" gorm:"primaryKey;type:varchar(36)"`
	Judul       string         `json:"judul" gorm:"not null"`
	Deskripsi   string         `json:"deskripsi"`
	Kategori    string         `json:"kategori"` // Gizi | Imunisasi | PHBS | dll
	Phase       string         `json:"phase"`    // opsional filter fase
	IsPublished bool           `json:"is_published" gorm:"default:true"`
	Pertanyaan  []QuizQuestion `json:"pertanyaan,omitempty" gorm:"foreignKey:QuizID"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `json:"-" gorm:"index"`
}

func (Quiz) TableName() string { return "quizzes" }

func (q *Quiz) BeforeCreate(tx *gorm.DB) error {
	if q.ID == "" {
		q.ID = uuid.New().String()
	}
	return nil
}

// QuizQuestion merepresentasikan satu pertanyaan dalam kuis.
type QuizQuestion struct {
	ID           string         `json:"id" gorm:"primaryKey;type:varchar(36)"`
	QuizID       string         `json:"quiz_id" gorm:"type:varchar(36);index"`
	Teks         string         `json:"teks" gorm:"not null"`
	Pilihan      string         `json:"pilihan" gorm:"type:text"` // JSON string: ["A","B","C","D"]
	JawabanBenar string         `json:"jawaban_benar"`
	Penjelasan   string         `json:"penjelasan" gorm:"type:text"`
	Urutan       int            `json:"urutan" gorm:"default:0"`
	CreatedAt    time.Time      `json:"created_at"`
	DeletedAt    gorm.DeletedAt `json:"-" gorm:"index"`
}

func (QuizQuestion) TableName() string { return "quiz_questions" }

func (q *QuizQuestion) BeforeCreate(tx *gorm.DB) error {
	if q.ID == "" {
		q.ID = uuid.New().String()
	}
	return nil
}

// QuizAttempt merepresentasikan riwayat pengguna mengerjakan kuis.
type QuizAttempt struct {
	ID         string    `json:"id" gorm:"primaryKey;type:varchar(36)"`
	PenggunaID string    `json:"pengguna_id" gorm:"type:varchar(36);index"`
	QuizID     string    `json:"quiz_id" gorm:"type:varchar(36);index"`
	Skor       int       `json:"skor"`
	Total      int       `json:"total"`
	CreatedAt  time.Time `json:"created_at"`
}

func (QuizAttempt) TableName() string { return "quiz_attempts" }

func (q *QuizAttempt) BeforeCreate(tx *gorm.DB) error {
	if q.ID == "" {
		q.ID = uuid.New().String()
	}
	return nil
}

// ============================
// Request structs
// ============================

type CreateQuizRequest struct {
	Judul       string                  `json:"judul" validate:"required"`
	Deskripsi   string                  `json:"deskripsi"`
	Kategori    string                  `json:"kategori"`
	Phase       string                  `json:"phase"`
	IsPublished *bool                   `json:"is_published"`
	Pertanyaan  []CreateQuestionRequest `json:"pertanyaan"`
}

type UpdateQuizRequest struct {
	Judul       string `json:"judul"`
	Deskripsi   string `json:"deskripsi"`
	Kategori    string `json:"kategori"`
	Phase       string `json:"phase"`
	IsPublished *bool  `json:"is_published"`
}

type CreateQuestionRequest struct {
	Teks         string `json:"teks" validate:"required"`
	Pilihan      string `json:"pilihan"` // JSON array string
	JawabanBenar string `json:"jawaban_benar"`
	Penjelasan   string `json:"penjelasan"`
	Urutan       int    `json:"urutan"`
}
