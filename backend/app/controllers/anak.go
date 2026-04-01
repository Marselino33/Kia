package controllers

import (
	"net/http"

	"sejiwa-backend/app/helpers"
	"sejiwa-backend/app/middleware"
	"sejiwa-backend/app/models"
	"sejiwa-backend/app/usecases"

	"github.com/labstack/echo/v4"
)

// AnakController menangani endpoint CRUD data anak.
type AnakController struct {
	anakUC *usecases.AnakUseCase
}

func NewAnakController(anakUC *usecases.AnakUseCase) *AnakController {
	return &AnakController{anakUC: anakUC}
}

// List godoc
// @Summary      List anak milik pengguna yang login
// @Tags         anak
// @Security     BearerAuth
// @Produce      json
// @Success      200  {object}  models.Response
// @Router       /anak [get]
func (h *AnakController) List(c echo.Context) error {
	penggunaID := middleware.GetPenggunaID(c)

	list, err := h.anakUC.ListAnak(penggunaID)
	if err != nil {
		return helpers.StandardResponse(c, http.StatusInternalServerError, err.Error(), nil, nil)
	}

	return helpers.StandardResponse(c, http.StatusOK, "berhasil", list, nil)
}

// Create godoc
// @Summary      Tambah anak baru
// @Tags         anak
// @Security     BearerAuth
// @Accept       json
// @Produce      json
// @Param        body  body      models.CreateAnakRequest  true  "Data anak"
// @Success      201   {object}  models.Response
// @Failure      400   {object}  models.Response
// @Router       /anak [post]
func (h *AnakController) Create(c echo.Context) error {
	penggunaID := middleware.GetPenggunaID(c)

	var req models.CreateAnakRequest
	if err := c.Bind(&req); err != nil {
		return helpers.StandardResponse(c, http.StatusBadRequest, "request tidak valid: "+err.Error(), nil, nil)
	}

	if req.Nama == "" || req.TanggalLahir == "" || req.JenisKelamin == "" {
		return helpers.StandardResponse(c, http.StatusBadRequest, "nama, tanggal_lahir, dan jenis_kelamin wajib diisi", nil, nil)
	}

	anak, err := h.anakUC.CreateAnak(penggunaID, req)
	if err != nil {
		return helpers.StandardResponse(c, http.StatusBadRequest, err.Error(), nil, nil)
	}

	return helpers.StandardResponse(c, http.StatusCreated, "data anak berhasil ditambahkan", anak, nil)
}

// Detail godoc
// @Summary      Detail anak berdasarkan ID
// @Tags         anak
// @Security     BearerAuth
// @Produce      json
// @Param        id   path      string  true  "Anak ID"
// @Success      200  {object}  models.Response
// @Failure      404  {object}  models.Response
// @Router       /anak/{id} [get]
func (h *AnakController) Detail(c echo.Context) error {
	penggunaID := middleware.GetPenggunaID(c)
	id := c.Param("id")

	anak, err := h.anakUC.GetAnak(id, penggunaID)
	if err != nil {
		return helpers.StandardResponse(c, http.StatusNotFound, err.Error(), nil, nil)
	}

	return helpers.StandardResponse(c, http.StatusOK, "berhasil", anak, nil)
}

// Update godoc
// @Summary      Update data anak
// @Tags         anak
// @Security     BearerAuth
// @Accept       json
// @Produce      json
// @Param        id    path      string                   true  "Anak ID"
// @Param        body  body      models.UpdateAnakRequest true  "Data anak yang diperbarui"
// @Success      200   {object}  models.Response
// @Failure      404   {object}  models.Response
// @Router       /anak/{id} [put]
func (h *AnakController) Update(c echo.Context) error {
	penggunaID := middleware.GetPenggunaID(c)
	id := c.Param("id")

	var req models.UpdateAnakRequest
	if err := c.Bind(&req); err != nil {
		return helpers.StandardResponse(c, http.StatusBadRequest, "request tidak valid: "+err.Error(), nil, nil)
	}

	anak, err := h.anakUC.UpdateAnak(id, penggunaID, req)
	if err != nil {
		return helpers.StandardResponse(c, http.StatusBadRequest, err.Error(), nil, nil)
	}

	return helpers.StandardResponse(c, http.StatusOK, "data anak berhasil diperbarui", anak, nil)
}

// Delete godoc
// @Summary      Hapus data anak
// @Tags         anak
// @Security     BearerAuth
// @Produce      json
// @Param        id   path      string  true  "Anak ID"
// @Success      200  {object}  models.Response
// @Failure      404  {object}  models.Response
// @Router       /anak/{id} [delete]
func (h *AnakController) Delete(c echo.Context) error {
	penggunaID := middleware.GetPenggunaID(c)
	id := c.Param("id")

	if err := h.anakUC.DeleteAnak(id, penggunaID); err != nil {
		return helpers.StandardResponse(c, http.StatusNotFound, err.Error(), nil, nil)
	}

	return helpers.StandardResponse(c, http.StatusOK, "data anak berhasil dihapus", nil, nil)
}
