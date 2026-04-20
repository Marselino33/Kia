package controllers

import (
	"net/http"

	"sejiwa-backend/app/helpers"
	"sejiwa-backend/app/models"
	"sejiwa-backend/app/usecases"

	"github.com/labstack/echo/v4"
)

// AuthController menangani endpoint autentikasi.
type AuthController struct {
	authUC *usecases.AuthUseCase
}

func NewAuthController(authUC *usecases.AuthUseCase) *AuthController {
	return &AuthController{authUC: authUC}
}

// Register godoc
// @Summary      Daftar pengguna baru
// @Description  Mendaftarkan ibu/ayah/kader baru dengan email dan password
// @Tags         auth
// @Accept       json
// @Produce      json
// @Param        body  body      models.RegisterRequest  true  "Data registrasi"
// @Success      201   {object}  models.Response
// @Failure      400   {object}  models.Response
// @Router       /auth/register [post]
func (h *AuthController) Register(c echo.Context) error {
	var req models.RegisterRequest
	if err := c.Bind(&req); err != nil {
		return helpers.StandardResponse(c, http.StatusBadRequest, "request tidak valid: "+err.Error(), nil, nil)
	}

	if req.Email == "" || req.Password == "" || req.Nama == "" || req.Role == "" {
		return helpers.StandardResponse(c, http.StatusBadRequest, "nama, email, password, dan role wajib diisi", nil, nil)
	}

	resp, err := h.authUC.Register(req)
	if err != nil {
		return helpers.StandardResponse(c, http.StatusBadRequest, err.Error(), nil, nil)
	}

	return helpers.StandardResponse(c, http.StatusCreated, "registrasi berhasil", resp, nil)
}

// Login godoc
// @Summary      Login dengan email dan password
// @Description  Mengembalikan access token dan refresh token
// @Tags         auth
// @Accept       json
// @Produce      json
// @Param        body  body      models.LoginRequest  true  "Data login"
// @Success      200   {object}  models.Response
// @Failure      401   {object}  models.Response
// @Router       /auth/login [post]
func (h *AuthController) Login(c echo.Context) error {
	var req models.LoginRequest
	if err := c.Bind(&req); err != nil {
		return helpers.StandardResponse(c, http.StatusBadRequest, "request tidak valid: "+err.Error(), nil, nil)
	}

	if req.Email == "" || req.Password == "" {
		return helpers.StandardResponse(c, http.StatusBadRequest, "email dan password wajib diisi", nil, nil)
	}

	resp, err := h.authUC.Login(req)
	if err != nil {
		return helpers.StandardResponse(c, http.StatusUnauthorized, err.Error(), nil, nil)
	}

	return helpers.StandardResponse(c, http.StatusOK, "login berhasil", resp, nil)
}

// RefreshToken godoc
// @Summary      Refresh access token
// @Tags         auth
// @Accept       json
// @Produce      json
// @Param        body  body      models.RefreshTokenRequest  true  "Refresh token"
// @Success      200   {object}  models.Response
// @Failure      401   {object}  models.Response
// @Router       /auth/refresh [post]
func (h *AuthController) RefreshToken(c echo.Context) error {
	var req models.RefreshTokenRequest
	if err := c.Bind(&req); err != nil {
		return helpers.StandardResponse(c, http.StatusBadRequest, "request tidak valid", nil, nil)
	}

	if req.RefreshToken == "" {
		return helpers.StandardResponse(c, http.StatusBadRequest, "refresh_token wajib diisi", nil, nil)
	}

	resp, err := h.authUC.RefreshToken(req.RefreshToken)
	if err != nil {
		return helpers.StandardResponse(c, http.StatusUnauthorized, err.Error(), nil, nil)
	}

	return helpers.StandardResponse(c, http.StatusOK, "token diperbarui", resp, nil)
}
