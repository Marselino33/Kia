package repositories

import (
	"encoding/json"
	"fmt"
	"strings"

	"sejiwa-backend/app/models"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

// QuizRepository menangani baca/tulis data kuis dengan fallback kompatibilitas legacy.
type QuizRepository struct {
	db *gorm.DB
}

func NewQuizRepository(db *gorm.DB) *QuizRepository {
	return &QuizRepository{db: db}
}

func (r *QuizRepository) ListWithQuestions() ([]models.Quiz, error) {
	var quizzes []models.Quiz
	if err := r.db.Preload("Pertanyaan.Options", func(tx *gorm.DB) *gorm.DB {
		return tx.Order("urutan ASC, id ASC")
	}).Order("created_at DESC").Find(&quizzes).Error; err != nil {
		return nil, err
	}

	for i := range quizzes {
		r.hydrateLegacyQuiz(&quizzes[i])
	}
	return quizzes, nil
}

func (r *QuizRepository) FindWithQuestions(id string) (*models.Quiz, error) {
	var quiz models.Quiz
	if err := r.db.Preload("Pertanyaan.Options", func(tx *gorm.DB) *gorm.DB {
		return tx.Order("urutan ASC, id ASC")
	}).First(&quiz, "id = ?", id).Error; err != nil {
		return nil, err
	}

	r.hydrateLegacyQuiz(&quiz)
	return &quiz, nil
}

func (r *QuizRepository) SaveQuestionOptions(questionID string, pilihan string, jawabanBenar string, urutan int) error {
	choices := parseLegacyChoices(pilihan)
	if len(choices) == 0 {
		return nil
	}

	options := make([]models.QuizOption, 0, len(choices))
	for idx, choice := range choices {
		key := optionKeyAt(idx)
		isCorrect := false
		if matchesChoice(choice, jawabanBenar) {
			isCorrect = true
		}
		options = append(options, models.QuizOption{
			QuestionID: questionID,
			OptionKey:  key,
			OptionText: choice,
			IsCorrect:  isCorrect,
			Urutan:     urutan*10 + idx,
		})
	}

	return r.db.Clauses(clause.OnConflict{DoNothing: true}).Create(&options).Error
}

func (r *QuizRepository) hydrateLegacyQuiz(quiz *models.Quiz) {
	if quiz == nil {
		return
	}
	for i := range quiz.Pertanyaan {
		q := &quiz.Pertanyaan[i]
		if len(q.Options) == 0 {
			q.Options = legacyOptionsFromQuestion(*q)
		}
	}
}

func legacyOptionsFromQuestion(question models.QuizQuestion) []models.QuizOption {
	choices := parseLegacyChoices(question.Pilihan)
	if len(choices) == 0 {
		return nil
	}

	options := make([]models.QuizOption, 0, len(choices))
	for idx, choice := range choices {
		options = append(options, models.QuizOption{
			OptionKey:  optionKeyAt(idx),
			OptionText: choice,
			IsCorrect:  matchesChoice(choice, question.JawabanBenar),
			Urutan:     question.Urutan*10 + idx,
		})
	}
	return options
}

func parseLegacyChoices(raw string) []string {
	raw = strings.TrimSpace(raw)
	if raw == "" {
		return nil
	}

	var choices []string
	if err := json.Unmarshal([]byte(raw), &choices); err == nil {
		return choices
	}
	return nil
}

func optionKeyAt(index int) string {
	if index < 0 {
		return fmt.Sprintf("%d", index+1)
	}
	if index < 26 {
		return string(rune('A' + index))
	}
	return fmt.Sprintf("%d", index+1)
}

func matchesChoice(choice string, answer string) bool {
	choice = strings.TrimSpace(strings.ToLower(choice))
	answer = strings.TrimSpace(strings.ToLower(answer))
	if choice == "" || answer == "" {
		return false
	}
	return choice == answer
}
