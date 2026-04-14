package controllers

import (
	"errors"
	"net/http"
	"strconv"
	"strings"
	"time"

	"sejiwa-backend/app/helpers"
	"sejiwa-backend/app/middleware"
	"sejiwa-backend/app/models"
	"sejiwa-backend/app/usecases"

	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

// MasterController menangani endpoint master data (vaksin KIA 2024).
type MasterController struct {
	masterUC *usecases.MasterContentUseCase
	db       *gorm.DB
}

func NewMasterController(masterUC *usecases.MasterContentUseCase, db *gorm.DB) *MasterController {
	return &MasterController{masterUC: masterUC, db: db}
}

// GetContentBySlug returns a single article detail from database
func (h *MasterController) GetContentBySlug(c echo.Context) error {
	slug := c.Param("slug")
	var content models.Content
	if err := h.db.Where("slug = ? AND is_published = ?", slug, true).First(&content).Error; err != nil {
		return helpers.StandardResponse(c, http.StatusNotFound, "artikel tidak ditemukan", nil, nil)
	}
	return helpers.StandardResponse(c, http.StatusOK, "berhasil", content, nil)
}

// Profile and bookmark handlers (stubbed)

// GetProfile returns basic profile info
func (h *MasterController) GetProfile(c echo.Context) error {
	penggunaID := c.Get("pengguna_id")
	_ = penggunaID
	return helpers.StandardResponse(c, http.StatusOK, "berhasil", map[string]interface{}{"fullName": "Pengguna KIA", "phone": "081234567890"}, nil)
}

// UpdateProfile accepts profile updates
func (h *MasterController) UpdateProfile(c echo.Context) error {
	return helpers.StandardResponse(c, http.StatusOK, "profil diperbarui", nil, nil)
}

// Bookmarks
func (h *MasterController) ListBookmarks(c echo.Context) error {
	return helpers.StandardResponse(c, http.StatusOK, "berhasil", []interface{}{}, nil)
}

func (h *MasterController) AddBookmark(c echo.Context) error {
	return helpers.StandardResponse(c, http.StatusOK, "bookmark ditambahkan", nil, nil)
}

func (h *MasterController) RemoveBookmark(c echo.Context) error {
	return helpers.StandardResponse(c, http.StatusOK, "bookmark dihapus", nil, nil)
}

func (h *MasterController) CheckBookmark(c echo.Context) error {
	// always false for now
	return helpers.StandardResponse(c, http.StatusOK, "berhasil", map[string]bool{"bookmarked": false}, nil)
}

type quizHistoryItem struct {
	ID           string `json:"id"`
	QuizID       string `json:"quiz_id"`
	QuizTitle    string `json:"quiz_title"`
	QuizCategory string `json:"quiz_category"`
	Skor         int    `json:"score"`
	Total        int    `json:"total"`
	CreatedAt    string `json:"created_at"`
}

// RecordQuizAttempt menyimpan skor attempt kuis user.
func (h *MasterController) RecordQuizAttempt(c echo.Context) error {
	penggunaID := middleware.GetPenggunaID(c)
	if penggunaID == "" {
		return helpers.StandardResponse(c, http.StatusUnauthorized, "pengguna tidak terautentikasi", nil, nil)
	}

	var payload map[string]interface{}
	if err := c.Bind(&payload); err != nil {
		return helpers.StandardResponse(c, http.StatusBadRequest, "request tidak valid", nil, nil)
	}

	quizID := strings.TrimSpace(toString(payload["quiz_id"]))
	if quizID == "" {
		return helpers.StandardResponse(c, http.StatusBadRequest, "quiz_id wajib diisi", nil, nil)
	}

	score := toInt(payload["score"])
	total := toInt(payload["total"])
	title := strings.TrimSpace(toString(payload["title"]))
	category := strings.TrimSpace(toString(payload["category"]))
	phase := strings.TrimSpace(toString(payload["phase"]))

	if total <= 0 {
		total = 100
	}
	if score < 0 {
		score = 0
	}
	if score > total {
		score = total
	}

	var quiz models.Quiz
	err := h.db.First(&quiz, "id = ?", quizID).Error
	if err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return helpers.StandardResponse(c, http.StatusInternalServerError, "gagal validasi quiz", nil, nil)
		}

		if title == "" {
			title = "Kuis Parenting"
		}

		quiz = models.Quiz{
			ID:          quizID,
			Judul:       title,
			Deskripsi:   "Kuis parenting dari aplikasi KIA",
			Kategori:    category,
			Phase:       phase,
			IsPublished: true,
		}

		if errCreate := h.db.Create(&quiz).Error; errCreate != nil {
			return helpers.StandardResponse(c, http.StatusInternalServerError, "gagal membuat referensi quiz", nil, nil)
		}
	}

	attempt := models.QuizAttempt{
		PenggunaID: penggunaID,
		QuizID:     quizID,
		Skor:       score,
		Total:      total,
	}

	if err := h.db.Create(&attempt).Error; err != nil {
		return helpers.StandardResponse(c, http.StatusInternalServerError, "gagal menyimpan skor kuis", nil, nil)
	}

	return helpers.StandardResponse(c, http.StatusOK, "attempt kuis berhasil disimpan", attempt, nil)
}

func toString(v interface{}) string {
	switch val := v.(type) {
	case string:
		return val
	case float64:
		return strconv.Itoa(int(val))
	case int:
		return strconv.Itoa(val)
	case int64:
		return strconv.FormatInt(val, 10)
	default:
		return ""
	}
}

func toInt(v interface{}) int {
	switch val := v.(type) {
	case float64:
		return int(val)
	case int:
		return val
	case int64:
		return int(val)
	case string:
		parsed, err := strconv.Atoi(strings.TrimSpace(val))
		if err != nil {
			return 0
		}
		return parsed
	default:
		return 0
	}
}

// ListQuizAttemptHistory menampilkan riwayat skor kuis user yang sedang login.
func (h *MasterController) ListQuizAttemptHistory(c echo.Context) error {
	penggunaID := middleware.GetPenggunaID(c)
	if penggunaID == "" {
		return helpers.StandardResponse(c, http.StatusUnauthorized, "pengguna tidak terautentikasi", nil, nil)
	}

	limit := 10
	if qLimit := c.QueryParam("limit"); qLimit != "" {
		parsed, err := strconv.Atoi(qLimit)
		if err == nil && parsed > 0 && parsed <= 100 {
			limit = parsed
		}
	}

	quizID := strings.TrimSpace(c.QueryParam("quiz_id"))

	query := h.db.Table("quiz_attempts qa").
		Select("qa.id, qa.quiz_id, qa.skor, qa.total, qa.created_at, q.judul as quiz_title, q.kategori as quiz_category").
		Joins("LEFT JOIN quizzes q ON q.id = qa.quiz_id").
		Where("qa.pengguna_id = ?", penggunaID)

	if quizID != "" {
		query = query.Where("qa.quiz_id = ?", quizID)
	}

	type rawHistory struct {
		ID           string
		QuizID       string
		QuizTitle    string
		QuizCategory string
		Skor         int
		Total        int
		CreatedAt    time.Time
	}

	var rows []rawHistory
	if err := query.Order("qa.created_at DESC").Limit(limit).Scan(&rows).Error; err != nil {
		return helpers.StandardResponse(c, http.StatusInternalServerError, "gagal mengambil riwayat kuis", nil, nil)
	}

	items := make([]quizHistoryItem, 0, len(rows))
	for _, row := range rows {
		items = append(items, quizHistoryItem{
			ID:           row.ID,
			QuizID:       row.QuizID,
			QuizTitle:    row.QuizTitle,
			QuizCategory: row.QuizCategory,
			Skor:         row.Skor,
			Total:        row.Total,
			CreatedAt:    row.CreatedAt.Format(time.RFC3339),
		})
	}

	return helpers.StandardResponse(c, http.StatusOK, "berhasil", items, nil)
}

// ListContent godoc
// @Summary      List artikel edukasi
// @Tags         master
// @Produce      json
// @Param        phase query string false "Filter by phase"
// @Param        kategori query string false "Filter by kategori"
// @Param        q query string false "Search query"
// @Param        limit query int false "Limit results"
// @Success      200  {object}  models.Response
// @Router       /content [get]
func (h *MasterController) ListContent(c echo.Context) error {
	phase := c.QueryParam("phase")
	kategori := c.QueryParam("kategori")
	q := c.QueryParam("q")
	limitStr := c.QueryParam("limit")

	query := h.db.Model(&models.Content{}).Where("is_published = ?", true)

	if phase != "" {
		query = query.Where("phase = ?", phase)
	}
	if kategori != "" {
		query = query.Where("LOWER(kategori) = LOWER(?)", kategori)
	}
	if q != "" {
		query = query.Where("judul ILIKE ?", "%"+strings.ToLower(q)+"%")
	}

	if limitStr != "" {
		if limit, err := strconv.Atoi(limitStr); err == nil && limit > 0 {
			query = query.Limit(limit)
		}
	}

	var list []models.Content
	if err := query.Order("created_at DESC").Find(&list).Error; err != nil {
		return helpers.StandardResponse(c, http.StatusInternalServerError, "gagal mengambil data konten", nil, nil)
	}

	return helpers.StandardResponse(c, http.StatusOK, "berhasil", list, nil)
}
