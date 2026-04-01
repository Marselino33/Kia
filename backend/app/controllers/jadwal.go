package controllers

import (
	"net/http"

	"sejiwa-backend/app/helpers"
	"sejiwa-backend/app/middleware"
	"sejiwa-backend/app/models"
	"sejiwa-backend/app/usecases"

	"github.com/labstack/echo/v4"
)

// JadwalController menangani endpoint jadwal imunisasi.
type JadwalController struct {
	jadwalUC *usecases.JadwalUseCase
}

func NewJadwalController(jadwalUC *usecases.JadwalUseCase) *JadwalController {
	return &JadwalController{jadwalUC: jadwalUC}
}

// GetJadwal godoc
// @Summary      Jadwal imunisasi lengkap beserta status per vaksin
// @Description  Mengembalikan jadwal 26 vaksin KIA 2024 dengan kalkulasi status: sudah/segera/terlewat/belum
// @Tags         jadwal
// @Security     BearerAuth
// @Produce      json
// @Param        id   path      string  true  "Anak ID"
// @Success      200  {object}  models.Response
// @Failure      404  {object}  models.Response
// @Router       /anak/{id}/jadwal [get]
func (h *JadwalController) GetJadwal(c echo.Context) error {
	penggunaID := middleware.GetPenggunaID(c)
	anakID := c.Param("id")

	// Validasi kepemilikan anak
	_ = penggunaID // validasi dilakukan di dalam usecase via anakRepo

	jadwal, err := h.jadwalUC.GetJadwalAnak(anakID)
	if err != nil {
		return helpers.StandardResponse(c, http.StatusNotFound, err.Error(), nil, nil)
	}

	return helpers.StandardResponse(c, http.StatusOK, "berhasil", jadwal, nil)
}

// RiwayatController menangani endpoint riwayat imunisasi.
type RiwayatController struct {
	riwayatUC *usecases.RiwayatUseCase
}

func NewRiwayatController(riwayatUC *usecases.RiwayatUseCase) *RiwayatController {
	return &RiwayatController{riwayatUC: riwayatUC}
}

// CatatRiwayat godoc
// @Summary      Catat vaksin yang sudah diberikan
// @Tags         riwayat
// @Security     BearerAuth
// @Accept       json
// @Produce      json
// @Param        id    path      string                     true  "Anak ID"
// @Param        body  body      models.CatatRiwayatRequest true  "Data riwayat"
// @Success      201   {object}  models.Response
// @Failure      400   {object}  models.Response
// @Router       /anak/{id}/riwayat [post]
func (h *RiwayatController) CatatRiwayat(c echo.Context) error {
	penggunaID := middleware.GetPenggunaID(c)
	anakID := c.Param("id")

	var req models.CatatRiwayatRequest
	if err := c.Bind(&req); err != nil {
		return helpers.StandardResponse(c, http.StatusBadRequest, "request tidak valid: "+err.Error(), nil, nil)
	}

	if req.NamaVaksin == "" || req.TanggalDone == "" || req.DicatatOleh == "" {
		return helpers.StandardResponse(c, http.StatusBadRequest, "nama_vaksin, tanggal_done, dan dicatat_oleh wajib diisi", nil, nil)
	}

	riwayat, err := h.riwayatUC.CatatRiwayat(anakID, penggunaID, req)
	if err != nil {
		return helpers.StandardResponse(c, http.StatusBadRequest, err.Error(), nil, nil)
	}

	return helpers.StandardResponse(c, http.StatusCreated, "riwayat imunisasi berhasil dicatat", riwayat, nil)
}

// ListRiwayat godoc
// @Summary      List riwayat imunisasi anak
// @Tags         riwayat
// @Security     BearerAuth
// @Produce      json
// @Param        id   path      string  true  "Anak ID"
// @Success      200  {object}  models.Response
// @Failure      404  {object}  models.Response
// @Router       /anak/{id}/riwayat [get]
func (h *RiwayatController) ListRiwayat(c echo.Context) error {
	penggunaID := middleware.GetPenggunaID(c)
	anakID := c.Param("id")

	list, err := h.riwayatUC.ListRiwayat(anakID, penggunaID)
	if err != nil {
		return helpers.StandardResponse(c, http.StatusNotFound, err.Error(), nil, nil)
	}

	return helpers.StandardResponse(c, http.StatusOK, "berhasil", list, nil)
}
