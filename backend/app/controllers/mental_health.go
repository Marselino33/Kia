package controllers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/url"
	"time"

	"sejiwa-backend/app/helpers"
	"sejiwa-backend/app/models"
	"sejiwa-backend/pkg/config"

	"github.com/labstack/echo/v4"
)

// MentalHealthController menjadi gateway backend ke service ML Python.
type MentalHealthController struct {
	client      *http.Client
	serviceURL  string
	predictPath string
}

func NewMentalHealthController(cfg *config.Config) *MentalHealthController {
	serviceURL := cfg.MentalHealthServiceURL
	if serviceURL == "" {
		serviceURL = "http://localhost:8000/api/v1"
	}

	return &MentalHealthController{
		client:      &http.Client{Timeout: 10 * time.Second},
		serviceURL:  serviceURL,
		predictPath: "/mental-health/predict",
	}
}

func (h *MentalHealthController) Predict(c echo.Context) error {
	var req models.MentalHealthPredictRequest
	if err := c.Bind(&req); err != nil {
		return helpers.StandardResponse(c, http.StatusBadRequest, "request tidak valid", nil, nil)
	}

	body, err := json.Marshal(req)
	if err != nil {
		return helpers.StandardResponse(c, http.StatusInternalServerError, "gagal menyiapkan request ML", nil, nil)
	}

	mlURL, err := url.JoinPath(h.serviceURL, h.predictPath)
	if err != nil {
		return helpers.StandardResponse(c, http.StatusInternalServerError, "konfigurasi URL service ML tidak valid", nil, nil)
	}

	httpReq, err := http.NewRequestWithContext(c.Request().Context(), http.MethodPost, mlURL, bytes.NewReader(body))
	if err != nil {
		return helpers.StandardResponse(c, http.StatusInternalServerError, "gagal membuat request ML", nil, nil)
	}
	httpReq.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)

	resp, err := h.client.Do(httpReq)
	if err != nil {
		return helpers.StandardResponse(c, http.StatusBadGateway, "service ML tidak dapat diakses", nil, nil)
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		return helpers.StandardResponse(c, http.StatusBadGateway, "service ML mengembalikan error", nil, nil)
	}

	var result models.MentalHealthPredictResult
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return helpers.StandardResponse(c, http.StatusBadGateway, "respons service ML tidak valid", nil, nil)
	}

	return helpers.StandardResponse(c, http.StatusOK, "berhasil", result, nil)
}
