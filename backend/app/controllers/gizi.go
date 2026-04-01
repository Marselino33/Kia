package controllers

import (
	"net/http"
	"strconv"
	"strings"
	"time"

	"sejiwa-backend/app/helpers"
	"sejiwa-backend/app/models"

	"github.com/labstack/echo/v4"
)

// GiziController menangani endpoint resep & jadwal makan.
type GiziController struct{}

func NewGiziController() *GiziController {
	return &GiziController{}
}

// resepData adalah data seed in-memory sebagai fallback sebelum DB dikonfigurasi.
var resepData = []models.ResepGizi{
	{
		ID: 1, Nama: "Bubur Bayi Bergizi (Bayam & Alpukat)", Slug: "bubur-bayi-bayam-alpukat",
		Deskripsi: "Bubur lembut kaya zat besi dan vitamin dari bayam segar dan alpukat matang.",
		Kategori:  "sarapan", UsiaKategori: "mpasi_6_24",
		DurasiMenit: 15, Kalori: 120,
		Nutrisi:   []string{"Zat Besi", "Vitamin C", "Lemak Sehat"},
		GambarURL: "https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=600",
		CreatedAt: time.Now(),
	},
	{
		ID: 2, Nama: "Menu Seimbang Ibu Hamil (Salad Protein)", Slug: "salad-protein-ibu-hamil",
		Deskripsi: "Salad segar dengan asam folat tinggi dari sayuran hijau dan protein dari telur.",
		Kategori:  "makan_siang", UsiaKategori: "ibu_hamil",
		DurasiMenit: 20, Kalori: 280,
		Nutrisi:   []string{"Asam Folat", "Tinggi Serat", "Protein"},
		GambarURL: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600",
		CreatedAt: time.Now(),
	},
	{
		ID: 3, Nama: "Salmon Panggang DHA (Booster ASI)", Slug: "salmon-panggang-dha",
		Deskripsi: "Salmon panggang kaya DHA dan Omega-3 yang mendukung kualitas ASI.",
		Kategori:  "makan_malam", UsiaKategori: "ibu_menyusui",
		DurasiMenit: 30, Kalori: 400,
		Nutrisi:   []string{"DHA", "Omega-3", "Protein Tinggi"},
		GambarURL: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600",
		CreatedAt: time.Now(),
	},
	{
		ID: 4, Nama: "Smoothie Pisang & Oat Ibu Hamil", Slug: "smoothie-pisang-oat",
		Deskripsi: "Minuman sehat kaya energi dengan pisang dan oat untuk pencernaan ibu hamil.",
		Kategori:  "sarapan", UsiaKategori: "ibu_hamil",
		DurasiMenit: 10, Kalori: 220,
		Nutrisi:   []string{"Kalium", "Serat", "Energi"},
		GambarURL: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=600",
		CreatedAt: time.Now(),
	},
	{
		ID: 5, Nama: "Nasi Tim Hati Ayam (MPASI)", Slug: "nasi-tim-hati-ayam",
		Deskripsi: "Nasi tim lembut dengan hati ayam kaya zat besi untuk bayi 8 bulan ke atas.",
		Kategori:  "makan_siang", UsiaKategori: "mpasi_6_24",
		DurasiMenit: 25, Kalori: 180,
		Nutrisi:   []string{"Zat Besi", "Vitamin A", "Protein"},
		GambarURL: "https://images.unsplash.com/photo-1605522561233-768ad7a8fabf?w=600",
		CreatedAt: time.Now(),
	},
	{
		ID: 6, Nama: "Sup Ayam Sayuran Balita", Slug: "sup-ayam-sayuran-balita",
		Deskripsi: "Sup hangat dengan ayam suwir dan aneka sayuran warna-warni untuk balita.",
		Kategori:  "makan_siang", UsiaKategori: "balita_2_5",
		DurasiMenit: 35, Kalori: 250,
		Nutrisi:   []string{"Protein", "Vitamin", "Zinc"},
		GambarURL: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600",
		CreatedAt: time.Now(),
	},
	{
		ID: 7, Nama: "Piscok Pisang & Coklat Camilan", Slug: "piscok-pisang-coklat",
		Deskripsi: "Camilan sehat dari pisang dan dark coklat kaya antioksidan untuk balita aktif.",
		Kategori:  "camilan", UsiaKategori: "balita_2_5",
		DurasiMenit: 20, Kalori: 150,
		Nutrisi:   []string{"Kalium", "Antioksidan", "Energi"},
		GambarURL: "https://images.unsplash.com/photo-1519676867240-f03562e64548?w=600",
		CreatedAt: time.Now(),
	},
	{
		ID: 8, Nama: "Puding Susu Alpukat (MPASI 10 bln)", Slug: "puding-susu-alpukat",
		Deskripsi: "Puding lembut dari susu dan alpukat untuk bayi 10 bulan ke atas.",
		Kategori:  "camilan", UsiaKategori: "mpasi_6_24",
		DurasiMenit: 15, Kalori: 130,
		Nutrisi:   []string{"Lemak Sehat", "Kalsium", "DHA"},
		GambarURL: "https://images.unsplash.com/photo-1571748982800-fa51082c2224?w=600",
		CreatedAt: time.Now(),
	},
}

// ListResep godoc
// @Summary      List resep gizi
// @Tags         gizi
// @Produce      json
// @Param        kategori     query  string  false  "Filter kategori (sarapan|makan_siang|makan_malam|camilan)"
// @Param        usia         query  string  false  "Filter usia_kategori"
// @Param        nutrisi      query  string  false  "Filter nutrisi (koma-separated)"
// @Param        sort         query  string  false  "Urutkan: terpopuler|terbaru|kalori_rendah"
// @Param        q            query  string  false  "Cari nama resep"
// @Success      200          {object}  models.Response
// @Router       /gizi/resep [get]
func (h *GiziController) ListResep(c echo.Context) error {
	kategori := c.QueryParam("kategori")
	usia := c.QueryParam("usia")
	nutrisi := c.QueryParam("nutrisi")
	sort := c.QueryParam("sort")
	q := c.QueryParam("q")

	result := make([]models.ResepGizi, 0)

	for _, r := range resepData {
		if kategori != "" && r.Kategori != kategori {
			continue
		}
		if usia != "" && r.UsiaKategori != usia {
			continue
		}
		if q != "" && !strings.Contains(strings.ToLower(r.Nama), strings.ToLower(q)) {
			continue
		}
		if nutrisi != "" {
			tags := strings.Split(nutrisi, ",")
			match := false
			for _, tag := range tags {
				for _, n := range r.Nutrisi {
					if strings.EqualFold(strings.TrimSpace(tag), n) {
						match = true
						break
					}
				}
				if match {
					break
				}
			}
			if !match {
				continue
			}
		}
		result = append(result, r)
	}

	// Sort: kalori_rendah sort by kalori asc
	if sort == "kalori_rendah" {
		for i := 0; i < len(result)-1; i++ {
			for j := i + 1; j < len(result); j++ {
				if result[i].Kalori > result[j].Kalori {
					result[i], result[j] = result[j], result[i]
				}
			}
		}
	}

	return helpers.StandardResponse(c, http.StatusOK, "berhasil", result, nil)
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
	for _, r := range resepData {
		if r.Slug == slug {
			return helpers.StandardResponse(c, http.StatusOK, "berhasil", r, nil)
		}
	}
	return helpers.StandardResponse(c, http.StatusNotFound, "resep tidak ditemukan", nil, nil)
}

// in-memory jadwal per pengguna (fallback)
var jadwalData = map[string][]models.JadwalMakan{}

// AddJadwal godoc
// @Summary      Tambah resep ke jadwal makan
// @Tags         gizi
// @Accept       json
// @Produce      json
// @Param        body  body  models.AddJadwalMakanRequest  true  "Jadwal request"
// @Success      201   {object}  models.Response
// @Router       /gizi/jadwal [post]
func (h *GiziController) AddJadwal(c echo.Context) error {
	penggunaID, ok := c.Get("pengguna_id").(string)
	if !ok || penggunaID == "" {
		penggunaID = "demo"
	}

	var req models.AddJadwalMakanRequest
	if err := c.Bind(&req); err != nil {
		return helpers.StandardResponse(c, http.StatusBadRequest, "request tidak valid", nil, nil)
	}

	// Cari resep
	var resep *models.ResepGizi
	for i := range resepData {
		if resepData[i].ID == req.ResepID {
			resep = &resepData[i]
			break
		}
	}
	if resep == nil {
		return helpers.StandardResponse(c, http.StatusNotFound, "resep tidak ditemukan", nil, nil)
	}

	newID := int64(len(jadwalData[penggunaID]) + 1)
	jadwal := models.JadwalMakan{
		ID:         newID,
		PenggunaID: penggunaID,
		ResepID:    req.ResepID,
		Resep:      resep,
		Tanggal:    req.Tanggal,
		WaktuMakan: req.WaktuMakan,
		Catatan:    req.Catatan,
		CreatedAt:  time.Now(),
	}
	jadwalData[penggunaID] = append(jadwalData[penggunaID], jadwal)

	return helpers.StandardResponse(c, http.StatusCreated, "resep berhasil ditambahkan ke jadwal", jadwal, nil)
}

// ListJadwal godoc
// @Summary      List jadwal makan pengguna
// @Tags         gizi
// @Produce      json
// @Success      200  {object}  models.Response
// @Router       /gizi/jadwal [get]
func (h *GiziController) ListJadwal(c echo.Context) error {
	penggunaID, ok := c.Get("pengguna_id").(string)
	if !ok || penggunaID == "" {
		penggunaID = "demo"
	}
	list := jadwalData[penggunaID]
	if list == nil {
		list = []models.JadwalMakan{}
	}
	return helpers.StandardResponse(c, http.StatusOK, "berhasil", list, nil)
}

// in-memory favorit per pengguna
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
