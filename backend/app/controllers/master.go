package controllers

import (
	"net/http"
	"strconv"
	"strings"

	"sejiwa-backend/app/helpers"
	"sejiwa-backend/app/models"
	"sejiwa-backend/app/usecases"

	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

// MasterController menangani endpoint master data (vaksin KIA 2024).
type MasterController struct {
	masterUC *usecases.MasterUseCase
	db       *gorm.DB
}

func NewMasterController(masterUC *usecases.MasterUseCase, db *gorm.DB) *MasterController {
	return &MasterController{masterUC: masterUC, db: db}
}

// ListVaksin godoc
// @Summary      List semua vaksin KIA 2024
// @Description  Mengembalikan 26 vaksin standar imunisasi anak dari Buku KIA 2024
// @Tags         master
// @Produce      json
// @Success      200  {object}  models.Response
// @Router       /master/vaksin [get]
func (h *MasterController) ListVaksin(c echo.Context) error {
	list, err := h.masterUC.ListVaksin()
	if err != nil {
		return helpers.StandardResponse(c, http.StatusInternalServerError, "gagal mengambil data vaksin", nil, nil)
	}
	return helpers.StandardResponse(c, http.StatusOK, "berhasil", list, nil)
}

// GetVaksinByID godoc
// @Summary      Detail vaksin berdasarkan ID
// @Tags         master
// @Produce      json
// @Param        id   path      int  true  "Vaksin ID"
// @Success      200  {object}  models.Response
// @Failure      404  {object}  models.Response
// @Router       /master/vaksin/{id} [get]
func (h *MasterController) GetVaksinByID(c echo.Context) error {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		return helpers.StandardResponse(c, http.StatusBadRequest, "id vaksin tidak valid", nil, nil)
	}

	vaksin, err := h.masterUC.GetVaksinByID(id)
	if err != nil {
		return helpers.StandardResponse(c, http.StatusNotFound, "vaksin tidak ditemukan", nil, nil)
	}

	return helpers.StandardResponse(c, http.StatusOK, "berhasil", vaksin, nil)
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

// Quiz attempt stub
func (h *MasterController) RecordQuizAttempt(c echo.Context) error {
	var body map[string]interface{}
	if err := c.Bind(&body); err != nil {
		return helpers.StandardResponse(c, http.StatusBadRequest, "request tidak valid", nil, nil)
	}
	return helpers.StandardResponse(c, http.StatusOK, "quiz attempt recorded", nil, nil)
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
