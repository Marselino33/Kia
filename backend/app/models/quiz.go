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
	Pertanyaan  []QuizQuestion `json:"pertanyaan,omitempty" gorm:"foreignKey:QuizID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
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
	Options      []QuizOption   `json:"options,omitempty" gorm:"foreignKey:QuestionID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
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

// QuizOption merepresentasikan opsi jawaban yang dinormalisasi.
type QuizOption struct {
	ID         int64          `json:"id" gorm:"primaryKey;autoIncrement"`
	QuestionID string         `json:"question_id" gorm:"type:varchar(36);index;not null"`
	OptionKey  string         `json:"option_key" gorm:"not null"`
	OptionText string         `json:"option_text" gorm:"not null"`
	IsCorrect  bool           `json:"is_correct" gorm:"default:false"`
	Urutan     int            `json:"urutan" gorm:"default:0"`
	CreatedAt  time.Time      `json:"created_at"`
	DeletedAt  gorm.DeletedAt `json:"-" gorm:"index"`
}

func (QuizOption) TableName() string { return "quiz_options" }

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

// QuizAttemptAnswer menyimpan jawaban per pertanyaan untuk attempt yang lebih detail.
type QuizAttemptAnswer struct {
	ID                 int64          `json:"id" gorm:"primaryKey;autoIncrement"`
	AttemptID          string         `json:"attempt_id" gorm:"type:varchar(36);index;not null"`
	QuestionID         string         `json:"question_id" gorm:"type:varchar(36);index;not null"`
	SelectedOptionKey  string         `json:"selected_option_key"`
	SelectedOptionText string         `json:"selected_option_text"`
	IsCorrect          *bool          `json:"is_correct,omitempty"`
	CreatedAt          time.Time      `json:"created_at"`
	DeletedAt          gorm.DeletedAt `json:"-" gorm:"index"`
}

func (QuizAttemptAnswer) TableName() string { return "quiz_attempt_answers" }

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
