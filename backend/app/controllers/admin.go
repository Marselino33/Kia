package controllers

import (
	"net/http"
	"strconv"
	"time"

	"sejiwa-backend/app/helpers"
	"sejiwa-backend/app/models"

	"github.com/labstack/echo/v4"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// AdminController menangani semua endpoint CRUD untuk admin panel SEJIWA.
type AdminController struct {
	db *gorm.DB
}

func NewAdminController(db *gorm.DB) *AdminController {
	return &AdminController{db: db}
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
	h.db.Model(&models.Pengguna{}).Count(&totalPengguna)
	h.db.Model(&models.Anak{}).Count(&totalAnak)
	h.db.Model(&models.Content{}).Count(&totalContent)
	h.db.Model(&models.ResepGiziDB{}).Count(&totalResep)
	h.db.Model(&models.Quiz{}).Count(&totalQuiz)

	return helpers.StandardResponse(c, http.StatusOK, "berhasil", map[string]interface{}{
		"total_pengguna": totalPengguna,
		"total_anak":     totalAnak,
		"total_content":  totalContent,
		"total_resep":    totalResep,
		"total_quiz":     totalQuiz,
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
	if req.Nama == "" || req.NoHP == "" || req.PIN == "" || req.Role == "" {
		return helpers.StandardResponse(c, http.StatusBadRequest, "nama, no_hp, pin, dan role wajib diisi", nil, nil)
	}

	hash, err := adminBcryptHash(req.PIN)
	if err != nil {
		return helpers.StandardResponse(c, http.StatusInternalServerError, "gagal hash PIN", nil, nil)
	}

	desa := req.Desa
	if desa == "" {
		desa = "Hutabulu Mejan"
	}
	p := models.Pengguna{
		Nama:    req.Nama,
		NoHP:    req.NoHP,
		PinHash: hash,
		Role:    req.Role,
		Desa:    desa,
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
	if req.NoHP != "" {
		p.NoHP = req.NoHP
	}
	if req.Role != "" {
		p.Role = req.Role
	}
	if req.Desa != "" {
		p.Desa = req.Desa
	}
	if req.PIN != "" {
		hash, err := adminBcryptHash(req.PIN)
		if err != nil {
			return helpers.StandardResponse(c, http.StatusInternalServerError, "gagal hash PIN", nil, nil)
		}
		p.PinHash = hash
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
	var list []models.Content

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

	// Support category filtering & search
	kategori := c.QueryParam("kategori")
	search := c.QueryParam("search")

	query := h.db.Model(&models.Content{})
	if kategori != "" {
		query = query.Where("kategori = ?", kategori)
	}
	if search != "" {
		query = query.Where("judul ILIKE ?", "%"+search+"%")
	}

	var total int64
	query.Count(&total)

	if err := query.Limit(limit).Offset(offset).Find(&list).Error; err != nil {
		return helpers.StandardResponse(c, http.StatusInternalServerError, "gagal mengambil data konten", nil, nil)
	}
	pagination := &models.Pagination{
		Page:      page,
		PageSize:  limit,
		Total:     int(total),
		TotalPage: (int(total) + limit - 1) / limit,
	}

	return helpers.StandardResponse(c, http.StatusOK, "berhasil", list, pagination)
}

func (h *AdminController) GetContent(c echo.Context) error {
	id := c.Param("id")
	var ct models.Content
	if err := h.db.First(&ct, "id = ?", id).Error; err != nil {
		return helpers.StandardResponse(c, http.StatusNotFound, "konten tidak ditemukan", nil, nil)
	}
	return helpers.StandardResponse(c, http.StatusOK, "berhasil", ct, nil)
}

func (h *AdminController) CreateContent(c echo.Context) error {
	var req models.CreateContentRequest
	if err := c.Bind(&req); err != nil {
		return helpers.StandardResponse(c, http.StatusBadRequest, "request tidak valid: "+err.Error(), nil, nil)
	}
	if req.Slug == "" || req.Judul == "" {
		return helpers.StandardResponse(c, http.StatusBadRequest, "slug dan judul wajib diisi", nil, nil)
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
	if err := h.db.Create(&ct).Error; err != nil {
		return helpers.StandardResponse(c, http.StatusBadRequest, "gagal membuat konten: "+err.Error(), nil, nil)
	}
	return helpers.StandardResponse(c, http.StatusCreated, "konten berhasil dibuat", ct, nil)
}

func (h *AdminController) UpdateContent(c echo.Context) error {
	id := c.Param("id")
	var ct models.Content
	if err := h.db.First(&ct, "id = ?", id).Error; err != nil {
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
	if err := h.db.Save(&ct).Error; err != nil {
		return helpers.StandardResponse(c, http.StatusInternalServerError, "gagal memperbarui konten", nil, nil)
	}
	return helpers.StandardResponse(c, http.StatusOK, "konten diperbarui", ct, nil)
}

func (h *AdminController) DeleteContent(c echo.Context) error {
	id := c.Param("id")
	if err := h.db.Delete(&models.Content{}, "id = ?", id).Error; err != nil {
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
	var list []models.Quiz
	if err := h.db.Preload("Pertanyaan").Find(&list).Error; err != nil {
		return helpers.StandardResponse(c, http.StatusInternalServerError, "gagal mengambil data quiz", nil, nil)
	}
	return helpers.StandardResponse(c, http.StatusOK, "berhasil", list, nil)
}

func (h *AdminController) GetQuiz(c echo.Context) error {
	id := c.Param("id")
	var q models.Quiz
	if err := h.db.Preload("Pertanyaan").First(&q, "id = ?", id).Error; err != nil {
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
		h.db.Create(&pt)
	}
	h.db.Preload("Pertanyaan").First(&q, "id = ?", q.ID)
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
	return helpers.StandardResponse(c, http.StatusCreated, "pertanyaan berhasil dibuat", pt, nil)
}

func (h *AdminController) DeleteQuestion(c echo.Context) error {
	qid := c.Param("qid")
	if err := h.db.Delete(&models.QuizQuestion{}, "id = ?", qid).Error; err != nil {
		return helpers.StandardResponse(c, http.StatusInternalServerError, "gagal menghapus pertanyaan", nil, nil)
	}
	return helpers.StandardResponse(c, http.StatusOK, "pertanyaan dihapus", nil, nil)
}
