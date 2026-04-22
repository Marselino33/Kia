package controllers

import (
	"net/http"
	"sort"
	"strconv"
	"strings"
	"time"

	"sejiwa-backend/app/helpers"
	"sejiwa-backend/app/middleware"
	"sejiwa-backend/app/models"
	"sejiwa-backend/app/repositories"

	"github.com/labstack/echo/v4"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// AdminController menangani semua endpoint CRUD untuk admin panel SEJIWA.
type AdminController struct {
	db       *gorm.DB
	quizRepo *repositories.QuizRepository
	kontenV2 *repositories.KontenV2Repository
}

func NewAdminController(db *gorm.DB, quizRepo *repositories.QuizRepository, kontenV2 *repositories.KontenV2Repository) *AdminController {
	return &AdminController{db: db, quizRepo: quizRepo, kontenV2: kontenV2}
}

// adminBcryptHash menghasilkan bcrypt hash dari string plain.
func adminBcryptHash(plain string) (string, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(plain), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hash), nil
}

// ============================================================
// DASHBOARD STATS
// ============================================================

// AdminDashboard godoc
// @Summary      [Admin] Statistik ringkasan data
// @Tags         admin
// @Produce      json
// @Security     BearerAuth
// @Success      200  {object}  models.Response
// @Router       /admin/dashboard [get]
func (h *AdminController) Dashboard(c echo.Context) error {
	var totalPengguna, totalAnak, totalContent, totalResep, totalQuiz int64
	var quizAttempts int64
	h.db.Model(&models.Pengguna{}).Count(&totalPengguna)
	h.db.Model(&models.Anak{}).Count(&totalAnak)
	h.db.Model(&models.ResepGiziDB{}).Count(&totalResep)
	h.db.Model(&models.Quiz{}).Count(&totalQuiz)
	h.db.Model(&models.QuizAttempt{}).Count(&quizAttempts)

	startOfDay := time.Now().Truncate(24 * time.Hour)
	var penggunaBaruHariIni int64
	h.db.Model(&models.Pengguna{}).Where("created_at >= ?", startOfDay).Count(&penggunaBaruHariIni)

	type dashboardDistribution struct {
		Label   string `json:"label"`
		Value   int    `json:"value"`
		Percent int    `json:"percent"`
		Color   string `json:"color"`
	}
	type dashboardActivity struct {
		Waktu        time.Time `json:"waktu"`
		Admin        string    `json:"admin"`
		Aksi         string    `json:"aksi"`
		TargetKonten string    `json:"target_konten"`
		Modul        string    `json:"modul"`
		Status       string    `json:"status"`
	}

	groupDefinitions := []struct {
		Label  string
		Color  string
		Tables []string
	}{
		{Label: "Gizi & Nutrisi", Color: "#2563eb", Tables: []string{"gizi_ibu", "gizi_anak", "mpasi"}},
		{Label: "Parenting", Color: "#0f766e", Tables: []string{"stimulus_anak", "pola_asuh"}},
		{Label: "Kesehatan Mental", Color: "#ea580c", Tables: []string{"mental_orang_tua"}},
		{Label: "Informasi Umum", Color: "#8b5cf6", Tables: []string{"informasi_umum"}},
	}

	collectCount := func(tableName string) int64 {
		var count int64
		if err := h.db.Table(tableName).Count(&count).Error; err != nil {
			if isMissingTableError(err) {
				return 0
			}
			return 0
		}
		return count
	}

	type activityCandidate struct {
		Waktu        time.Time
		Admin        string
		Aksi         string
		TargetKonten string
		Modul        string
		Status       string
	}

	collectContentActivities := func(tableName, modul string, limit int) []activityCandidate {
		var items []models.Content
		query := h.db.Table(tableName).Preload("Admin").Order("updated_at DESC")
		if err := query.Limit(limit).Find(&items).Error; err != nil {
			if isMissingTableError(err) {
				return nil
			}
			return nil
		}
		activities := make([]activityCandidate, 0, len(items))
		for _, item := range items {
			action := "UPDATE"
			if item.UpdatedAt.Sub(item.CreatedAt) < time.Second {
				if item.IsPublished {
					action = "PUBLISH"
				} else {
					action = "DRAFT"
				}
			}
			adminName := "System"
			if item.Admin != nil && strings.TrimSpace(item.Admin.Nama) != "" {
				adminName = item.Admin.Nama
			}
			status := "Draft"
			if item.IsPublished {
				status = "Terbit"
			}
			activities = append(activities, activityCandidate{
				Waktu:        item.UpdatedAt,
				Admin:        adminName,
				Aksi:         action,
				TargetKonten: item.Judul,
				Modul:        modul,
				Status:       status,
			})
		}
		return activities
	}

	collectPolaAsuhActivities := func(limit int) []activityCandidate {
		var items []models.PolaAsuh
		query := h.db.Preload("Admin").Order("updated_at DESC")
		if err := query.Limit(limit).Find(&items).Error; err != nil {
			if isMissingTableError(err) {
				return nil
			}
			return nil
		}
		activities := make([]activityCandidate, 0, len(items))
		for _, item := range items {
			action := "UPDATE"
			if item.UpdatedAt.Sub(item.CreatedAt) < time.Second {
				if item.IsPublished {
					action = "PUBLISH"
				} else {
					action = "DRAFT"
				}
			}
			adminName := "System"
			if item.Admin != nil && strings.TrimSpace(item.Admin.Nama) != "" {
				adminName = item.Admin.Nama
			}
			status := "Draft"
			if item.IsPublished {
				status = "Terbit"
			}
			activities = append(activities, activityCandidate{
				Waktu:        item.UpdatedAt,
				Admin:        adminName,
				Aksi:         action,
				TargetKonten: item.Judul,
				Modul:        "Pola Asuh",
				Status:       status,
			})
		}
		return activities
	}

	recentCandidates := make([]activityCandidate, 0, 12)
	for _, group := range groupDefinitions {
		groupCount := 0
		for _, tableName := range group.Tables {
			count := collectCount(tableName)
			totalContent += count
			groupCount += int(count)

			if tableName == "pola_asuh" {
				recentCandidates = append(recentCandidates, collectPolaAsuhActivities(2)...)
				continue
			}

			modulLabel := group.Label
			if tableName == "stimulus_anak" {
				modulLabel = "Parenting"
			}
			recentCandidates = append(recentCandidates, collectContentActivities(tableName, modulLabel, 2)...)
		}
		_ = groupCount
	}

	distribution := make([]dashboardDistribution, 0, len(groupDefinitions))
	for _, group := range groupDefinitions {
		count := 0
		for _, tableName := range group.Tables {
			count += int(collectCount(tableName))
		}
		percent := 0
		if totalContent > 0 {
			percent = int((float64(count) / float64(totalContent)) * 100)
		}
		distribution = append(distribution, dashboardDistribution{
			Label:   group.Label,
			Value:   count,
			Percent: percent,
			Color:   group.Color,
		})
	}

	sort.SliceStable(recentCandidates, func(i, j int) bool {
		return recentCandidates[i].Waktu.After(recentCandidates[j].Waktu)
	})
	if len(recentCandidates) > 5 {
		recentCandidates = recentCandidates[:5]
	}

	recentActivities := make([]dashboardActivity, 0, len(recentCandidates))
	for _, item := range recentCandidates {
		recentActivities = append(recentActivities, dashboardActivity{
			Waktu:        item.Waktu,
			Admin:        item.Admin,
			Aksi:         item.Aksi,
			TargetKonten: item.TargetKonten,
			Modul:        item.Modul,
			Status:       item.Status,
		})
	}

	engagementKuis := 0
	if totalQuiz > 0 {
		engagementKuis = int((quizAttempts * 100) / totalQuiz)
		if engagementKuis > 100 {
			engagementKuis = 100
		}
	}

	return helpers.StandardResponse(c, http.StatusOK, "berhasil", map[string]interface{}{
		"total_pengguna":       totalPengguna,
		"total_anak":           totalAnak,
		"total_content":        totalContent,
		"total_resep":          totalResep,
		"total_quiz":           totalQuiz,
		"quiz_attempts":        quizAttempts,
		"pengguna_baru_hari_ini": penggunaBaruHariIni,
		"engagement_kuis":      engagementKuis,
		"content_distribution":  distribution,
		"recent_activities":    recentActivities,
	}, nil)
}

// ============================================================
// PENGGUNA (Users)
// ============================================================

func (h *AdminController) ListPengguna(c echo.Context) error {
	var list []models.Pengguna
	if err := h.db.Find(&list).Error; err != nil {
		return helpers.StandardResponse(c, http.StatusInternalServerError, "gagal mengambil data pengguna", nil, nil)
	}
	return helpers.StandardResponse(c, http.StatusOK, "berhasil", list, nil)
}

func (h *AdminController) GetPengguna(c echo.Context) error {
	id := c.Param("id")
	var p models.Pengguna
	if err := h.db.First(&p, "id = ?", id).Error; err != nil {
		return helpers.StandardResponse(c, http.StatusNotFound, "pengguna tidak ditemukan", nil, nil)
	}
	return helpers.StandardResponse(c, http.StatusOK, "berhasil", p, nil)
}

func (h *AdminController) CreatePengguna(c echo.Context) error {
	var req models.AdminCreatePenggunaRequest
	if err := c.Bind(&req); err != nil {
		return helpers.StandardResponse(c, http.StatusBadRequest, "request tidak valid: "+err.Error(), nil, nil)
	}
	if req.Nama == "" || req.Email == "" || req.Password == "" || req.Role == "" {
		return helpers.StandardResponse(c, http.StatusBadRequest, "nama, email, password, dan role wajib diisi", nil, nil)
	}

	hash, err := adminBcryptHash(req.Password)
	if err != nil {
		return helpers.StandardResponse(c, http.StatusInternalServerError, "gagal hash password", nil, nil)
	}

	desa := req.Desa
	if desa == "" {
		desa = "Hutabulu Mejan"
	}
	p := models.Pengguna{
		Nama:         req.Nama,
		Email:        req.Email,
		PasswordHash: hash,
		Role:         req.Role,
		Desa:         desa,
	}
	if err := h.db.Create(&p).Error; err != nil {
		return helpers.StandardResponse(c, http.StatusBadRequest, "gagal membuat pengguna: "+err.Error(), nil, nil)
	}
	return helpers.StandardResponse(c, http.StatusCreated, "pengguna berhasil dibuat", p, nil)
}

func (h *AdminController) UpdatePengguna(c echo.Context) error {
	id := c.Param("id")
	var p models.Pengguna
	if err := h.db.First(&p, "id = ?", id).Error; err != nil {
		return helpers.StandardResponse(c, http.StatusNotFound, "pengguna tidak ditemukan", nil, nil)
	}

	var req models.AdminUpdatePenggunaRequest
	if err := c.Bind(&req); err != nil {
		return helpers.StandardResponse(c, http.StatusBadRequest, "request tidak valid: "+err.Error(), nil, nil)
	}

	if req.Nama != "" {
		p.Nama = req.Nama
	}
	if req.Email != "" {
		p.Email = req.Email
	}
	if req.Role != "" {
		p.Role = req.Role
	}
	if req.Desa != "" {
		p.Desa = req.Desa
	}
	if req.Password != "" {
		hash, err := adminBcryptHash(req.Password)
		if err != nil {
			return helpers.StandardResponse(c, http.StatusInternalServerError, "gagal hash password", nil, nil)
		}
		p.PasswordHash = hash
	}

	if err := h.db.Save(&p).Error; err != nil {
		return helpers.StandardResponse(c, http.StatusInternalServerError, "gagal memperbarui pengguna", nil, nil)
	}
	return helpers.StandardResponse(c, http.StatusOK, "pengguna diperbarui", p, nil)
}

func (h *AdminController) DeletePengguna(c echo.Context) error {
	id := c.Param("id")
	if err := h.db.Delete(&models.Pengguna{}, "id = ?", id).Error; err != nil {
		return helpers.StandardResponse(c, http.StatusInternalServerError, "gagal menghapus pengguna", nil, nil)
	}
	return helpers.StandardResponse(c, http.StatusOK, "pengguna dihapus", nil, nil)
}

// ============================================================
// ANAK
// ============================================================

func (h *AdminController) ListAnak(c echo.Context) error {
	var list []models.Anak
	if err := h.db.Find(&list).Error; err != nil {
		return helpers.StandardResponse(c, http.StatusInternalServerError, "gagal mengambil data anak", nil, nil)
	}
	return helpers.StandardResponse(c, http.StatusOK, "berhasil", list, nil)
}

func (h *AdminController) GetAnak(c echo.Context) error {
	id := c.Param("id")
	var a models.Anak
	if err := h.db.First(&a, "id = ?", id).Error; err != nil {
		return helpers.StandardResponse(c, http.StatusNotFound, "anak tidak ditemukan", nil, nil)
	}
	return helpers.StandardResponse(c, http.StatusOK, "berhasil", a, nil)
}

func (h *AdminController) CreateAnak(c echo.Context) error {
	var req models.CreateAnakRequest
	if err := c.Bind(&req); err != nil {
		return helpers.StandardResponse(c, http.StatusBadRequest, "request tidak valid: "+err.Error(), nil, nil)
	}
	if req.Nama == "" || req.TanggalLahir == "" || req.JenisKelamin == "" {
		return helpers.StandardResponse(c, http.StatusBadRequest, "nama, tanggal_lahir, jenis_kelamin wajib diisi", nil, nil)
	}
	tgl, err := time.Parse("2006-01-02", req.TanggalLahir)
	if err != nil {
		return helpers.StandardResponse(c, http.StatusBadRequest, "format tanggal_lahir tidak valid, gunakan YYYY-MM-DD", nil, nil)
	}
	penggunaID := c.QueryParam("pengguna_id")
	a := models.Anak{
		PenggunaID:    penggunaID,
		Nama:          req.Nama,
		TanggalLahir:  tgl,
		JenisKelamin:  req.JenisKelamin,
		BeratLahirKg:  req.BeratLahirKg,
		GolonganDarah: req.GolonganDarah,
	}
	if err := h.db.Create(&a).Error; err != nil {
		return helpers.StandardResponse(c, http.StatusBadRequest, "gagal membuat data anak: "+err.Error(), nil, nil)
	}
	return helpers.StandardResponse(c, http.StatusCreated, "data anak berhasil dibuat", a, nil)
}

func (h *AdminController) UpdateAnak(c echo.Context) error {
	id := c.Param("id")
	var a models.Anak
	if err := h.db.First(&a, "id = ?", id).Error; err != nil {
		return helpers.StandardResponse(c, http.StatusNotFound, "anak tidak ditemukan", nil, nil)
	}
	var req models.UpdateAnakRequest
	if err := c.Bind(&req); err != nil {
		return helpers.StandardResponse(c, http.StatusBadRequest, "request tidak valid: "+err.Error(), nil, nil)
	}
	if req.Nama != "" {
		a.Nama = req.Nama
	}
	if req.TanggalLahir != "" {
		tgl, err := time.Parse("2006-01-02", req.TanggalLahir)
		if err != nil {
			return helpers.StandardResponse(c, http.StatusBadRequest, "format tanggal_lahir tidak valid, gunakan YYYY-MM-DD", nil, nil)
		}
		a.TanggalLahir = tgl
	}
	if req.JenisKelamin != "" {
		a.JenisKelamin = req.JenisKelamin
	}
	if req.BeratLahirKg != nil {
		a.BeratLahirKg = req.BeratLahirKg
	}
	if req.GolonganDarah != nil {
		a.GolonganDarah = req.GolonganDarah
	}
	if err := h.db.Save(&a).Error; err != nil {
		return helpers.StandardResponse(c, http.StatusInternalServerError, "gagal memperbarui data anak", nil, nil)
	}
	return helpers.StandardResponse(c, http.StatusOK, "data anak diperbarui", a, nil)
}

func (h *AdminController) DeleteAnak(c echo.Context) error {
	id := c.Param("id")
	if err := h.db.Delete(&models.Anak{}, "id = ?", id).Error; err != nil {
		return helpers.StandardResponse(c, http.StatusInternalServerError, "gagal menghapus data anak", nil, nil)
	}
	return helpers.StandardResponse(c, http.StatusOK, "data anak dihapus", nil, nil)
}

// ============================================================
// CONTENT (Articles)
// ============================================================

func (h *AdminController) ListContent(c echo.Context) error {
	// Parsing Pagination Params
	page, _ := strconv.Atoi(c.QueryParam("page"))
	if page < 1 {
		page = 1
	}
	limit, _ := strconv.Atoi(c.QueryParam("limit"))
	if limit < 1 {
		limit = 10
	}
	offset := (page - 1) * limit

	feature := c.QueryParam("feature")
	tableName := tableNameForFeature(feature)
	kategori := c.QueryParam("kategori")
	search := c.QueryParam("search")

	if tableName == "" {
		all, err := queryAllContents(h.db, false)
		if err != nil {
			return helpers.StandardResponse(c, http.StatusInternalServerError, "gagal mengambil data konten", nil, nil)
		}
		filtered := all
		if kategori != "" {
			filtered = make([]models.Content, 0)
			for _, item := range all {
				if strings.EqualFold(item.Kategori, kategori) {
					filtered = append(filtered, item)
				}
			}
		}
		if search != "" {
			term := strings.ToLower(search)
			searched := make([]models.Content, 0)
			for _, item := range filtered {
				if strings.Contains(strings.ToLower(item.Judul), term) {
					searched = append(searched, item)
				}
			}
			filtered = searched
		}
		total := len(filtered)
		start := offset
		if start > total {
			start = total
		}
		end := start + limit
		if end > total {
			end = total
		}
		list := filtered[start:end]
		pagination := &models.Pagination{
			Page:      page,
			PageSize:  limit,
			Total:     total,
			TotalPage: (total + limit - 1) / limit,
		}
		return helpers.StandardResponse(c, http.StatusOK, "berhasil", list, pagination)
	}

	var list []models.Content
	query := h.db.Table(tableName).Model(&models.Content{})
	if kategori != "" {
		query = query.Where("LOWER(kategori) = LOWER(?)", kategori)
	}
	if search != "" {
		query = query.Where("judul ILIKE ?", "%"+search+"%")
	}

	var total int64
	query.Count(&total)

	if err := query.Order("created_at DESC").Limit(limit).Offset(offset).Find(&list).Error; err != nil {
		return helpers.StandardResponse(c, http.StatusInternalServerError, "gagal mengambil data konten", nil, nil)
	}
	pagination := &models.Pagination{Page: page, PageSize: limit, Total: int(total), TotalPage: (int(total) + limit - 1) / limit}

	return helpers.StandardResponse(c, http.StatusOK, "berhasil", list, pagination)
}

func (h *AdminController) GetContent(c echo.Context) error {
	id := c.Param("id")
	feature := c.QueryParam("feature")
	tableName := tableNameForFeature(feature)

	var ct models.Content
	query := h.db.Model(&models.Content{})
	if tableName != "" {
		query = h.db.Table(tableName).Model(&models.Content{})
	}
	if err := query.First(&ct, "id = ?", id).Error; err != nil {
		return helpers.StandardResponse(c, http.StatusNotFound, "konten tidak ditemukan", nil, nil)
	}
	return helpers.StandardResponse(c, http.StatusOK, "berhasil", ct, nil)
}

func (h *AdminController) CreateContent(c echo.Context) error {
	feature := c.QueryParam("feature")
	tableName := tableNameForFeature(feature)
	if tableName == "" {
		return helpers.StandardResponse(c, http.StatusBadRequest, "feature konten tidak valid", nil, nil)
	}

	var req models.CreateContentRequest
	if err := c.Bind(&req); err != nil {
		return helpers.StandardResponse(c, http.StatusBadRequest, "request tidak valid: "+err.Error(), nil, nil)
	}
	if req.Slug == "" || req.Judul == "" {
		return helpers.StandardResponse(c, http.StatusBadRequest, "slug dan judul wajib diisi", nil, nil)
	}
	adminID := middleware.GetPenggunaID(c)
	if adminID == "" {
		adminID = c.Request().Header.Get("X-Admin-ID")
	}

	isPublished := true
	if req.IsPublished != nil {
		isPublished = *req.IsPublished
	}
	readMinutes := req.ReadMinutes
	if readMinutes == 0 {
		readMinutes = 5
	}

	ct := models.Content{
		AdminID:     adminID,
		Slug:        req.Slug,
		Judul:       req.Judul,
		Ringkasan:   req.Ringkasan,
		Isi:         req.Isi,
		Kategori:    req.Kategori,
		Phase:       req.Phase,
		Tags:        req.Tags,
		GambarURL:   req.GambarURL,
		ReadMinutes: readMinutes,
		IsPublished: isPublished,
	}

	if err := h.db.Table(tableName).Create(&ct).Error; err != nil {
		return helpers.StandardResponse(c, http.StatusBadRequest, "gagal membuat konten: "+err.Error(), nil, nil)
	}
	return helpers.StandardResponse(c, http.StatusCreated, "konten berhasil dibuat", ct, nil)
}

func (h *AdminController) UpdateContent(c echo.Context) error {
	id := c.Param("id")
	feature := c.QueryParam("feature")
	tableName := tableNameForFeature(feature)
	if tableName == "" {
		return helpers.StandardResponse(c, http.StatusBadRequest, "feature konten tidak valid", nil, nil)
	}

	var ct models.Content
	if err := h.db.Table(tableName).First(&ct, "id = ?", id).Error; err != nil {
		return helpers.StandardResponse(c, http.StatusNotFound, "konten tidak ditemukan", nil, nil)
	}
	var req models.UpdateContentRequest
	if err := c.Bind(&req); err != nil {
		return helpers.StandardResponse(c, http.StatusBadRequest, "request tidak valid: "+err.Error(), nil, nil)
	}
	if req.Slug != "" {
		ct.Slug = req.Slug
	}
	if req.Judul != "" {
		ct.Judul = req.Judul
	}
	if req.Ringkasan != "" {
		ct.Ringkasan = req.Ringkasan
	}
	if req.Isi != "" {
		ct.Isi = req.Isi
	}
	if req.Kategori != "" {
		ct.Kategori = req.Kategori
	}
	if req.Phase != "" {
		ct.Phase = req.Phase
	}
	if req.Tags != "" {
		ct.Tags = req.Tags
	}
	if req.GambarURL != "" {
		ct.GambarURL = req.GambarURL
	}
	if req.ReadMinutes != 0 {
		ct.ReadMinutes = req.ReadMinutes
	}
	if req.IsPublished != nil {
		ct.IsPublished = *req.IsPublished
	}

	err := h.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Table(tableName).Save(&ct).Error; err != nil {
			return err
		}
		if h.kontenV2 != nil {
			if err := h.kontenV2.UpsertFromLegacy(tx, feature, ct); err != nil {
				return err
			}
		}
		return nil
	})

	if err != nil {
		return helpers.StandardResponse(c, http.StatusInternalServerError, "gagal memperbarui konten", nil, nil)
	}
	return helpers.StandardResponse(c, http.StatusOK, "konten diperbarui", ct, nil)
}

func (h *AdminController) DeleteContent(c echo.Context) error {
	id := c.Param("id")
	feature := c.QueryParam("feature")
	tableName := tableNameForFeature(feature)
	if tableName == "" {
		return helpers.StandardResponse(c, http.StatusBadRequest, "feature konten tidak valid", nil, nil)
	}

	err := h.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Table(tableName).Delete(&models.Content{}, "id = ?", id).Error; err != nil {
			return err
		}
		if h.kontenV2 != nil {
			if err := h.kontenV2.DeleteByID(tx, id); err != nil {
				return err
			}
		}
		return nil
	})

	if err != nil {
		return helpers.StandardResponse(c, http.StatusInternalServerError, "gagal menghapus konten", nil, nil)
	}
	return helpers.StandardResponse(c, http.StatusOK, "konten dihapus", nil, nil)
}

// ============================================================
// RESEP GIZI
// ============================================================

func (h *AdminController) ListResepAdmin(c echo.Context) error {
	var list []models.ResepGiziDB
	if err := h.db.Find(&list).Error; err != nil {
		return helpers.StandardResponse(c, http.StatusInternalServerError, "gagal mengambil data resep", nil, nil)
	}
	return helpers.StandardResponse(c, http.StatusOK, "berhasil", list, nil)
}

func (h *AdminController) GetResepAdmin(c echo.Context) error {
	idStr := c.Param("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		return helpers.StandardResponse(c, http.StatusBadRequest, "id tidak valid", nil, nil)
	}
	var r models.ResepGiziDB
	if err := h.db.First(&r, id).Error; err != nil {
		return helpers.StandardResponse(c, http.StatusNotFound, "resep tidak ditemukan", nil, nil)
	}
	return helpers.StandardResponse(c, http.StatusOK, "berhasil", r, nil)
}

func (h *AdminController) CreateResep(c echo.Context) error {
	var req models.CreateResepRequest
	if err := c.Bind(&req); err != nil {
		return helpers.StandardResponse(c, http.StatusBadRequest, "request tidak valid: "+err.Error(), nil, nil)
	}
	if req.Nama == "" || req.Slug == "" {
		return helpers.StandardResponse(c, http.StatusBadRequest, "nama dan slug wajib diisi", nil, nil)
	}
	isPublished := true
	if req.IsPublished != nil {
		isPublished = *req.IsPublished
	}
	r := models.ResepGiziDB{
		Nama:         req.Nama,
		Slug:         req.Slug,
		Deskripsi:    req.Deskripsi,
		Kategori:     req.Kategori,
		UsiaKategori: req.UsiaKategori,
		DurasiMenit:  req.DurasiMenit,
		Kalori:       req.Kalori,
		Nutrisi:      req.Nutrisi,
		GambarURL:    req.GambarURL,
		IsPublished:  isPublished,
	}
	if err := h.db.Create(&r).Error; err != nil {
		return helpers.StandardResponse(c, http.StatusBadRequest, "gagal membuat resep: "+err.Error(), nil, nil)
	}
	return helpers.StandardResponse(c, http.StatusCreated, "resep berhasil dibuat", r, nil)
}

func (h *AdminController) UpdateResep(c echo.Context) error {
	idStr := c.Param("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		return helpers.StandardResponse(c, http.StatusBadRequest, "id tidak valid", nil, nil)
	}
	var r models.ResepGiziDB
	if err := h.db.First(&r, id).Error; err != nil {
		return helpers.StandardResponse(c, http.StatusNotFound, "resep tidak ditemukan", nil, nil)
	}
	var req models.UpdateResepRequest
	if err := c.Bind(&req); err != nil {
		return helpers.StandardResponse(c, http.StatusBadRequest, "request tidak valid: "+err.Error(), nil, nil)
	}
	if req.Nama != "" {
		r.Nama = req.Nama
	}
	if req.Slug != "" {
		r.Slug = req.Slug
	}
	if req.Deskripsi != "" {
		r.Deskripsi = req.Deskripsi
	}
	if req.Kategori != "" {
		r.Kategori = req.Kategori
	}
	if req.UsiaKategori != "" {
		r.UsiaKategori = req.UsiaKategori
	}
	if req.DurasiMenit != 0 {
		r.DurasiMenit = req.DurasiMenit
	}
	if req.Kalori != 0 {
		r.Kalori = req.Kalori
	}
	if req.Nutrisi != "" {
		r.Nutrisi = req.Nutrisi
	}
	if req.GambarURL != "" {
		r.GambarURL = req.GambarURL
	}
	if req.IsPublished != nil {
		r.IsPublished = *req.IsPublished
	}
	if err := h.db.Save(&r).Error; err != nil {
		return helpers.StandardResponse(c, http.StatusInternalServerError, "gagal memperbarui resep", nil, nil)
	}
	return helpers.StandardResponse(c, http.StatusOK, "resep diperbarui", r, nil)
}

func (h *AdminController) DeleteResep(c echo.Context) error {
	idStr := c.Param("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		return helpers.StandardResponse(c, http.StatusBadRequest, "id tidak valid", nil, nil)
	}
	if err := h.db.Delete(&models.ResepGiziDB{}, id).Error; err != nil {
		return helpers.StandardResponse(c, http.StatusInternalServerError, "gagal menghapus resep", nil, nil)
	}
	return helpers.StandardResponse(c, http.StatusOK, "resep dihapus", nil, nil)
}

// ============================================================
// QUIZ
// ============================================================

func (h *AdminController) ListQuiz(c echo.Context) error {
	if h.quizRepo != nil {
		list, err := h.quizRepo.ListWithQuestions()
		if err != nil {
			return helpers.StandardResponse(c, http.StatusInternalServerError, "gagal mengambil data quiz", nil, nil)
		}
		return helpers.StandardResponse(c, http.StatusOK, "berhasil", list, nil)
	}

	var list []models.Quiz
	if err := h.db.Preload("Pertanyaan.Options").Find(&list).Error; err != nil {
		return helpers.StandardResponse(c, http.StatusInternalServerError, "gagal mengambil data quiz", nil, nil)
	}
	return helpers.StandardResponse(c, http.StatusOK, "berhasil", list, nil)
}

func (h *AdminController) GetQuiz(c echo.Context) error {
	id := c.Param("id")
	if h.quizRepo != nil {
		q, err := h.quizRepo.FindWithQuestions(id)
		if err != nil {
			return helpers.StandardResponse(c, http.StatusNotFound, "quiz tidak ditemukan", nil, nil)
		}
		return helpers.StandardResponse(c, http.StatusOK, "berhasil", q, nil)
	}

	var q models.Quiz
	if err := h.db.Preload("Pertanyaan.Options").First(&q, "id = ?", id).Error; err != nil {
		return helpers.StandardResponse(c, http.StatusNotFound, "quiz tidak ditemukan", nil, nil)
	}
	return helpers.StandardResponse(c, http.StatusOK, "berhasil", q, nil)
}

func (h *AdminController) CreateQuiz(c echo.Context) error {
	var req models.CreateQuizRequest
	if err := c.Bind(&req); err != nil {
		return helpers.StandardResponse(c, http.StatusBadRequest, "request tidak valid: "+err.Error(), nil, nil)
	}
	if req.Judul == "" {
		return helpers.StandardResponse(c, http.StatusBadRequest, "judul wajib diisi", nil, nil)
	}
	isPublished := true
	if req.IsPublished != nil {
		isPublished = *req.IsPublished
	}
	q := models.Quiz{
		Judul:       req.Judul,
		Deskripsi:   req.Deskripsi,
		Kategori:    req.Kategori,
		Phase:       req.Phase,
		IsPublished: isPublished,
	}
	if err := h.db.Create(&q).Error; err != nil {
		return helpers.StandardResponse(c, http.StatusBadRequest, "gagal membuat quiz: "+err.Error(), nil, nil)
	}
	for _, pReq := range req.Pertanyaan {
		pt := models.QuizQuestion{
			QuizID:       q.ID,
			Teks:         pReq.Teks,
			Pilihan:      pReq.Pilihan,
			JawabanBenar: pReq.JawabanBenar,
			Penjelasan:   pReq.Penjelasan,
			Urutan:       pReq.Urutan,
		}
		if err := h.db.Create(&pt).Error; err != nil {
			return helpers.StandardResponse(c, http.StatusBadRequest, "gagal membuat pertanyaan: "+err.Error(), nil, nil)
		}
		if h.quizRepo != nil {
			_ = h.quizRepo.SaveQuestionOptions(pt.ID, pReq.Pilihan, pReq.JawabanBenar, pReq.Urutan)
		}
	}
	h.db.Preload("Pertanyaan.Options").First(&q, "id = ?", q.ID)
	return helpers.StandardResponse(c, http.StatusCreated, "quiz berhasil dibuat", q, nil)
}

func (h *AdminController) UpdateQuiz(c echo.Context) error {
	id := c.Param("id")
	var q models.Quiz
	if err := h.db.First(&q, "id = ?", id).Error; err != nil {
		return helpers.StandardResponse(c, http.StatusNotFound, "quiz tidak ditemukan", nil, nil)
	}
	var req models.UpdateQuizRequest
	if err := c.Bind(&req); err != nil {
		return helpers.StandardResponse(c, http.StatusBadRequest, "request tidak valid: "+err.Error(), nil, nil)
	}
	if req.Judul != "" {
		q.Judul = req.Judul
	}
	if req.Deskripsi != "" {
		q.Deskripsi = req.Deskripsi
	}
	if req.Kategori != "" {
		q.Kategori = req.Kategori
	}
	if req.Phase != "" {
		q.Phase = req.Phase
	}
	if req.IsPublished != nil {
		q.IsPublished = *req.IsPublished
	}
	if err := h.db.Save(&q).Error; err != nil {
		return helpers.StandardResponse(c, http.StatusInternalServerError, "gagal memperbarui quiz", nil, nil)
	}
	return helpers.StandardResponse(c, http.StatusOK, "quiz diperbarui", q, nil)
}

func (h *AdminController) DeleteQuiz(c echo.Context) error {
	id := c.Param("id")
	h.db.Where("quiz_id = ?", id).Delete(&models.QuizQuestion{})
	if err := h.db.Delete(&models.Quiz{}, "id = ?", id).Error; err != nil {
		return helpers.StandardResponse(c, http.StatusInternalServerError, "gagal menghapus quiz", nil, nil)
	}
	return helpers.StandardResponse(c, http.StatusOK, "quiz dihapus", nil, nil)
}

// QUIZ QUESTIONS – sub-resource

func (h *AdminController) CreateQuestion(c echo.Context) error {
	quizID := c.Param("id")
	var req models.CreateQuestionRequest
	if err := c.Bind(&req); err != nil {
		return helpers.StandardResponse(c, http.StatusBadRequest, "request tidak valid: "+err.Error(), nil, nil)
	}
	pt := models.QuizQuestion{
		QuizID:       quizID,
		Teks:         req.Teks,
		Pilihan:      req.Pilihan,
		JawabanBenar: req.JawabanBenar,
		Penjelasan:   req.Penjelasan,
		Urutan:       req.Urutan,
	}
	if err := h.db.Create(&pt).Error; err != nil {
		return helpers.StandardResponse(c, http.StatusBadRequest, "gagal membuat pertanyaan: "+err.Error(), nil, nil)
	}
	if h.quizRepo != nil {
		_ = h.quizRepo.SaveQuestionOptions(pt.ID, req.Pilihan, req.JawabanBenar, req.Urutan)
	}
	return helpers.StandardResponse(c, http.StatusCreated, "pertanyaan berhasil dibuat", pt, nil)
}

func (h *AdminController) DeleteQuestion(c echo.Context) error {
	qid := c.Param("qid")
	if err := h.db.Delete(&models.QuizQuestion{}, "id = ?", qid).Error; err != nil {
		return helpers.StandardResponse(c, http.StatusInternalServerError, "gagal menghapus pertanyaan", nil, nil)
	}
	return helpers.StandardResponse(c, http.StatusOK, "pertanyaan dihapus", nil, nil)
}

// ============================================================
// POLA ASUH (tabel khusus pola_asuh)
// ============================================================

func (h *AdminController) ListPolaAsuh(c echo.Context) error {
	page, _ := strconv.Atoi(c.QueryParam("page"))
	if page < 1 {
		page = 1
	}
	limit, _ := strconv.Atoi(c.QueryParam("limit"))
	if limit < 1 {
		limit = 10
	}
	offset := (page - 1) * limit
	search := c.QueryParam("search")
	phase := c.QueryParam("phase")
	status := c.QueryParam("status")

	var list []models.PolaAsuh
	query := h.db.Model(&models.PolaAsuh{})
	if search != "" {
		query = query.Where("judul ILIKE ?", "%"+search+"%")
	}
	if phase != "" && phase != "all" {
		query = query.Where("phase = ?", phase)
	}
	if status != "" && status != "all" {
		isPublished := status == "published"
		query = query.Where("is_published = ?", isPublished)
	}

	var total int64
	query.Count(&total)

	if err := query.Order("created_at DESC").Limit(limit).Offset(offset).Find(&list).Error; err != nil {
		return helpers.StandardResponse(c, http.StatusInternalServerError, "gagal mengambil data", nil, nil)
	}

	pagination := &models.Pagination{
		Page:      page,
		PageSize:  limit,
		Total:     int(total),
		TotalPage: (int(total) + limit - 1) / limit,
	}
	return helpers.StandardResponse(c, http.StatusOK, "berhasil", list, pagination)
}

func (h *AdminController) CreatePolaAsuh(c echo.Context) error {
	var req struct {
		Slug           string `json:"slug"`
		Judul          string `json:"judul"`
		Ringkasan      string `json:"ringkasan"`
		Isi            string `json:"isi"`
		Kategori       string `json:"kategori"`
		Phase          string `json:"phase"`
		LangkahPraktis string `json:"langkah_praktis"`
		GambarURL      string `json:"gambar_url"`
		ReadMinutes    int    `json:"read_minutes"`
		IsPublished    *bool  `json:"is_published"`
	}
	if err := c.Bind(&req); err != nil {
		return helpers.StandardResponse(c, http.StatusBadRequest, "request tidak valid", nil, nil)
	}
	if req.Judul == "" {
		return helpers.StandardResponse(c, http.StatusBadRequest, "judul wajib diisi", nil, nil)
	}
	if req.Slug == "" {
		req.Slug = strings.ToLower(strings.ReplaceAll(req.Judul, " ", "-"))
	}

	adminID := middleware.GetPenggunaID(c)
	if adminID == "" {
		adminID = c.Request().Header.Get("X-Admin-ID")
	}

	isPublished := true
	if req.IsPublished != nil {
		isPublished = *req.IsPublished
	}
	readMinutes := req.ReadMinutes
	if readMinutes == 0 {
		readMinutes = 5
	}

	p := models.PolaAsuh{
		AdminID:        adminID,
		Slug:           req.Slug,
		Judul:          req.Judul,
		Ringkasan:      req.Ringkasan,
		Isi:            req.Isi,
		Kategori:       req.Kategori,
		Phase:          req.Phase,
		LangkahPraktis: req.LangkahPraktis,
		GambarURL:      req.GambarURL,
		ReadMinutes:    readMinutes,
		IsPublished:    isPublished,
	}

	if err := h.db.Create(&p).Error; err != nil {
		return helpers.StandardResponse(c, http.StatusBadRequest, "gagal membuat konten: "+err.Error(), nil, nil)
	}
	return helpers.StandardResponse(c, http.StatusCreated, "konten berhasil dibuat", p, nil)
}

func (h *AdminController) GetPolaAsuh(c echo.Context) error {
	id := c.Param("id")
	var p models.PolaAsuh
	if err := h.db.First(&p, "id = ?", id).Error; err != nil {
		return helpers.StandardResponse(c, http.StatusNotFound, "konten tidak ditemukan", nil, nil)
	}
	return helpers.StandardResponse(c, http.StatusOK, "berhasil", p, nil)
}

func (h *AdminController) UpdatePolaAsuh(c echo.Context) error {
	id := c.Param("id")
	var p models.PolaAsuh
	if err := h.db.First(&p, "id = ?", id).Error; err != nil {
		return helpers.StandardResponse(c, http.StatusNotFound, "konten tidak ditemukan", nil, nil)
	}

	var req struct {
		Slug           string `json:"slug"`
		Judul          string `json:"judul"`
		Ringkasan      string `json:"ringkasan"`
		Isi            string `json:"isi"`
		Kategori       string `json:"kategori"`
		Phase          string `json:"phase"`
		LangkahPraktis string `json:"langkah_praktis"`
		GambarURL      string `json:"gambar_url"`
		ReadMinutes    int    `json:"read_minutes"`
		IsPublished    *bool  `json:"is_published"`
	}
	if err := c.Bind(&req); err != nil {
		return helpers.StandardResponse(c, http.StatusBadRequest, "request tidak valid", nil, nil)
	}

	if req.Slug != "" {
		p.Slug = req.Slug
	}
	if req.Judul != "" {
		p.Judul = req.Judul
	}
	if req.Ringkasan != "" {
		p.Ringkasan = req.Ringkasan
	}
	if req.Isi != "" {
		p.Isi = req.Isi
	}
	if req.Kategori != "" {
		p.Kategori = req.Kategori
	}
	if req.Phase != "" {
		p.Phase = req.Phase
	}
	if req.LangkahPraktis != "" {
		p.LangkahPraktis = req.LangkahPraktis
	}
	if req.GambarURL != "" {
		p.GambarURL = req.GambarURL
	}
	if req.ReadMinutes > 0 {
		p.ReadMinutes = req.ReadMinutes
	}
	if req.IsPublished != nil {
		p.IsPublished = *req.IsPublished
	}

	if err := h.db.Save(&p).Error; err != nil {
		return helpers.StandardResponse(c, http.StatusInternalServerError, "gagal memperbarui konten", nil, nil)
	}
	return helpers.StandardResponse(c, http.StatusOK, "konten berhasil diperbarui", p, nil)
}

func (h *AdminController) DeletePolaAsuh(c echo.Context) error {
	id := c.Param("id")
	if err := h.db.Delete(&models.PolaAsuh{}, "id = ?", id).Error; err != nil {
		return helpers.StandardResponse(c, http.StatusInternalServerError, "gagal menghapus konten", nil, nil)
	}
	return helpers.StandardResponse(c, http.StatusOK, "konten dihapus", nil, nil)
}
