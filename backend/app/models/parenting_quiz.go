package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// ParentingQuizQuestion represents a question for parenting quiz.
type ParentingQuizQuestion struct {
	ID       string    `json:"id" gorm:"primaryKey;type:varchar(36)"`
	AdminID  string    `json:"admin_id" gorm:"column:admin_id;type:varchar(36);index"`
	Admin    *Pengguna `json:"admin,omitempty" gorm:"foreignKey:AdminID;references:ID"`
	Text     string    `json:"text" gorm:"not null"`
	Order    int       `json:"order" gorm:"default:0"`
	IsActive bool      `json:"is_active" gorm:"default:true"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`
}

func (ParentingQuizQuestion) TableName() string { return "parenting_quiz_questions" }

func (q *ParentingQuizQuestion) BeforeCreate(tx *gorm.DB) error {
	if q.ID == "" {
		q.ID = uuid.New().String()
	}
	return nil
}

// CreateParentingQuizQuestionRequest is the body request for creating a question.
type CreateParentingQuizQuestionRequest struct {
	Text     string `json:"text" validate:"required"`
	Order    int    `json:"order"`
	IsActive *bool  `json:"is_active"`
}

// UpdateParentingQuizQuestionRequest is the body request for updating a question.
type UpdateParentingQuizQuestionRequest struct {
	Text     string `json:"text"`
	Order    int    `json:"order"`
	IsActive *bool  `json:"is_active"`
}
