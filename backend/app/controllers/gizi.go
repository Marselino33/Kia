package controllers

import (
	"net/http"
	"strconv"

	"sejiwa-backend/app/helpers"
	"sejiwa-backend/app/models"

	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

// GiziController menangani endpoint resep gizi (dari database).
type GiziController struct {
	db *gorm.DB
}

func NewGiziController(db *gorm.DB) *GiziController {
	return &GiziController{db: db}
}

// ListResep godoc
// @Summary      List resep gizi / MPASI dari database
// @Tags         gizi
// @Produce      json
// @Param        kategori     query  string  false  "Filter kategori"
// @Param        usia         query  string  false  "Filter usia_kategori"
// @Param        q            query  string  false  "Cari nama resep"
// @Success      200          {object}  models.Response
// @Router       /gizi/resep [get]
func (h *GiziController) ListResep(c echo.Context) error {
	kategori := c.QueryParam("kategori")
	usia := c.QueryParam("usia")
	q := c.QueryParam("q")

	var list []models.ResepGiziDB
	query := h.db.Model(&models.ResepGiziDB{}).Where("is_published = ?", true)
	if kategori != "" {
		query = query.Where("LOWER(kategori) = LOWER(?)", kategori)
	}
	if usia != "" {
		query = query.Where("LOWER(usia_kategori) = LOWER(?)", usia)
	}
	if q != "" {
		query = query.Where("nama ILIKE ?", "%"+q+"%")
	}
	if err := query.Order("created_at DESC").Find(&list).Error; err != nil {
		return helpers.StandardResponse(c, http.StatusInternalServerError, "gagal mengambil data resep", nil, nil)
	}
	return helpers.StandardResponse(c, http.StatusOK, "berhasil", list, nil)
}

// GetResepBySlug godoc
// @Summary      Detail resep berdasarkan slug
// @Tags         gizi
// @Produce      json
// @Param        slug  path  string  true  "Slug resep"
// @Success      200   {object}  models.Response
// @Failure      404   {object}  models.Response
// @Router       /gizi/resep/{slug} [get]
func (h *GiziController) GetResepBySlug(c echo.Context) error {
	slug := c.Param("slug")
	var r models.ResepGiziDB
	if err := h.db.Where("slug = ? AND is_published = ?", slug, true).First(&r).Error; err != nil {
		return helpers.StandardResponse(c, http.StatusNotFound, "resep tidak ditemukan", nil, nil)
	}
	return helpers.StandardResponse(c, http.StatusOK, "berhasil", r, nil)
}

// in-memory favorit per pengguna (simple toggle, no DB persistence needed)
var favoritData = map[string]map[int64]bool{}

// ToggleFavorit godoc
// @Summary      Toggle favorit resep
// @Tags         gizi
// @Produce      json
// @Param        id   path  int  true  "Resep ID"
// @Success      200  {object}  models.Response
// @Router       /gizi/resep/{id}/favorit [post]
func (h *GiziController) ToggleFavorit(c echo.Context) error {
	penggunaID, ok := c.Get("pengguna_id").(string)
	if !ok || penggunaID == "" {
		penggunaID = "demo"
	}

	idStr := c.Param("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		return helpers.StandardResponse(c, http.StatusBadRequest, "id tidak valid", nil, nil)
	}

	if favoritData[penggunaID] == nil {
		favoritData[penggunaID] = map[int64]bool{}
	}

	isFavorit := !favoritData[penggunaID][id]
	favoritData[penggunaID][id] = isFavorit

	return helpers.StandardResponse(c, http.StatusOK, "berhasil", map[string]bool{"is_favorit": isFavorit}, nil)
}

// AddJadwal - stub untuk kompatibilitas (tidak menyimpan ke DB)
func (h *GiziController) AddJadwal(c echo.Context) error {
	return helpers.StandardResponse(c, http.StatusCreated, "berhasil", map[string]string{"message": "fitur jadwal makan akan segera hadir"}, nil)
}

// ListJadwal - stub untuk kompatibilitas
func (h *GiziController) ListJadwal(c echo.Context) error {
	return helpers.StandardResponse(c, http.StatusOK, "berhasil", []interface{}{}, nil)
}
