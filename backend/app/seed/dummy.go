package seed

import (
	"encoding/json"
	"fmt"
	"log"
	"strings"

	"kia/app/models"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type contentSeedItem struct {
	Slug      string
	Judul     string
	Ringkasan string
	Isi       string
	Kategori  string
	Phase     string
	Tags      string
	ImageURL  string
	ReadMin   int
}

type polaAsuhSeedItem struct {
	Slug           string
	Judul          string
	Ringkasan      string
	Isi            string
	Kategori       string
	Phase          string
	LangkahPraktis []string
	ImageURL       string
	ReadMin        int
}

type quizSeed struct {
	Judul      string
	Deskripsi  string
	Kategori   string
	Phase      string
	Pertanyaan []quizQuestionSeed
}

type quizQuestionSeed struct {
	Teks       string
	Pilihan    []string
	CorrectIdx int
	Penjelasan string
}

// SeedFeatureContentDummies mengisi data dummy untuk semua fitur konten.
// Menghasilkan 5 data per fitur utama: stimulus_anak, gizi_ibu, gizi_anak, mpasi, informasi_umum, mental_orang_tua, contents, pola_asuh.
func SeedFeatureContentDummies(db *gorm.DB, adminID string) {
	if strings.TrimSpace(adminID) == "" {
		log.Println("âš ï¸ Seed dummy konten dilewati: adminID kosong")
		return
	}

	tableItems := map[string][]contentSeedItem{
		"stimulus_anak": {
			{Slug: "stimulus-tummy-time-0-3", Judul: "Stimulus Tummy Time 0-3 Bulan", Ringkasan: "Aktivitas sederhana untuk memperkuat otot leher bayi.", Isi: "Lakukan tummy time 3-5 menit beberapa kali sehari di alas datar yang aman.", Kategori: "Motorik", Phase: "0-3 Bulan", Tags: "motorik,bayi,stimulasi", ImageURL: "https://images.unsplash.com/photo-1503454537688-e7b99cede977?w=1200&h=680&fit=crop", ReadMin: 5},
			{Slug: "stimulus-sensorik-3-6", Judul: "Stimulus Sensorik 3-6 Bulan", Ringkasan: "Melatih fokus visual dan sentuhan lewat permainan lembut.", Isi: "Gunakan mainan berwarna kontras, ajak bayi meraih, sentuh tekstur berbeda.", Kategori: "Sensorik", Phase: "3-6 Bulan", Tags: "sensorik,bayi", ImageURL: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=1200&h=680&fit=crop", ReadMin: 5},
			{Slug: "stimulus-bahasa-6-9", Judul: "Stimulus Bahasa 6-9 Bulan", Ringkasan: "Mendorong bayi meniru suara dan ekspresi wajah.", Isi: "Ajak bayi bercermin, tirukan bunyi sederhana, sebut nama benda berulang.", Kategori: "Kognitif", Phase: "6-9 Bulan", Tags: "bahasa,kognitif", ImageURL: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=1200&h=680&fit=crop", ReadMin: 6},
			{Slug: "stimulus-motorik-halus-9-12", Judul: "Stimulus Motorik Halus 9-12 Bulan", Ringkasan: "Latihan koordinasi tangan lewat permainan sederhana.", Isi: "Gunakan balok lunak, ajak memindahkan benda, dan menyusun benda besar.", Kategori: "Motorik", Phase: "9-12 Bulan", Tags: "motorik-halus,balita", ImageURL: "https://images.unsplash.com/photo-1607457561901-e6ec3a6d16cf?w=1200&h=680&fit=crop", ReadMin: 6},
			{Slug: "stimulus-sosial-emosi-12-24", Judul: "Stimulus Sosial Emosi 12-24 Bulan", Ringkasan: "Mengenalkan empati dan komunikasi dasar pada anak.", Isi: "Bermain peran, membaca buku emosi, dan validasi perasaan anak setiap hari.", Kategori: "Sosial Emosional", Phase: "12-24 Bulan", Tags: "emosi,sosial", ImageURL: "https://images.unsplash.com/photo-1484662020986-75935d2ebc66?w=1200&h=680&fit=crop", ReadMin: 7},
		},
		"gizi_ibu": {
			{Slug: "gizi-ibu-trimester1-zat-besi", Judul: "Trimester 1: Fokus Zat Besi", Ringkasan: "Nutrisi penting untuk mencegah anemia pada awal kehamilan.", Isi: "Perbanyak sumber zat besi seperti hati, daging merah, dan sayuran hijau.", Kategori: "Trimester 1", Phase: "trimester_1", Tags: "gizi-ibu,trimester1", ImageURL: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&h=680&fit=crop", ReadMin: 5},
			{Slug: "gizi-ibu-trimester2-kalsium", Judul: "Trimester 2: Cukupi Kalsium", Ringkasan: "Mendukung pertumbuhan tulang janin.", Isi: "Konsumsi susu, ikan, dan kacang-kacangan sesuai porsi harian.", Kategori: "Trimester 2", Phase: "trimester_2", Tags: "gizi-ibu,trimester2", ImageURL: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=1200&h=680&fit=crop", ReadMin: 5},
			{Slug: "gizi-ibu-trimester3-protein", Judul: "Trimester 3: Protein Berkualitas", Ringkasan: "Membantu kenaikan berat janin yang optimal.", Isi: "Pilih protein hewani dan nabati seimbang serta cukup cairan.", Kategori: "Trimester 3", Phase: "trimester_3", Tags: "gizi-ibu,trimester3", ImageURL: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=1200&h=680&fit=crop", ReadMin: 6},
			{Slug: "gizi-ibu-menyusui-hidrasi", Judul: "Menyusui: Prioritas Hidrasi", Ringkasan: "Asupan cairan memengaruhi kenyamanan ibu menyusui.", Isi: "Minum air putih teratur dan konsumsi makanan tinggi air.", Kategori: "Menyusui", Phase: "menyusui", Tags: "gizi-ibu,menyusui", ImageURL: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1200&h=680&fit=crop", ReadMin: 4},
			{Slug: "gizi-ibu-menyusui-energi", Judul: "Menyusui: Tambahan Energi Harian", Ringkasan: "Ibu menyusui membutuhkan energi tambahan setiap hari.", Isi: "Tambahkan camilan sehat kaya protein dan serat untuk menjaga stamina.", Kategori: "Menyusui", Phase: "menyusui", Tags: "gizi-ibu,energi", ImageURL: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=1200&h=680&fit=crop", ReadMin: 5},
		},
		"gizi_anak": {
			{Slug: "gizi-anak-6-8-bulan-tekstur", Judul: "Gizi Anak 6-8 Bulan: Pengenalan Tekstur", Ringkasan: "Transisi dari puree ke tekstur lumat.", Isi: "Kenalkan tekstur bertahap untuk melatih kemampuan oral motorik.", Kategori: "6-8 Bulan", Phase: "6-8 Bulan", Tags: "gizi-anak,mpasi", ImageURL: "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=1200&h=680&fit=crop", ReadMin: 5},
			{Slug: "gizi-anak-9-11-bulan-protein", Judul: "Gizi Anak 9-11 Bulan: Protein Harian", Ringkasan: "Tambahkan sumber protein hewani dan nabati.", Isi: "Sajikan telur, ayam, tahu, tempe, dan ikan dalam porsi sesuai usia.", Kategori: "9-11 Bulan", Phase: "9-11 Bulan", Tags: "protein,balita", ImageURL: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=1200&h=680&fit=crop", ReadMin: 6},
			{Slug: "gizi-anak-12-24-bulan-variasi", Judul: "Gizi Anak 12-24 Bulan: Variasi Menu", Ringkasan: "Mencegah picky eater dengan menu beragam.", Isi: "Rotasi menu 3-4 hari dan libatkan anak saat memilih makanan.", Kategori: "12-24 Bulan", Phase: "12-24 Bulan", Tags: "variasi-menu,picky-eater", ImageURL: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=1200&h=680&fit=crop", ReadMin: 6},
			{Slug: "gizi-anak-2-3-tahun-serat", Judul: "Gizi Anak 2-3 Tahun: Serat & Pencernaan", Ringkasan: "Cegah konstipasi dengan pola makan tinggi serat.", Isi: "Perbanyak buah, sayur, dan air putih untuk pencernaan sehat.", Kategori: "2-3 Tahun", Phase: "2-3 Tahun", Tags: "serat,pencernaan", ImageURL: "https://images.unsplash.com/photo-1495195134817-aeb325a55b65?w=1200&h=680&fit=crop", ReadMin: 5},
			{Slug: "gizi-anak-3-5-tahun-lunchbox", Judul: "Gizi Anak 3-5 Tahun: Lunchbox Seimbang", Ringkasan: "Komposisi bekal sekolah yang praktis dan bergizi.", Isi: "Isi lunchbox dengan karbohidrat, protein, sayur, buah, dan air minum.", Kategori: "3-5 Tahun", Phase: "3-5 Tahun", Tags: "lunchbox,anak", ImageURL: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=1200&h=680&fit=crop", ReadMin: 6},
		},
		"mpasi": {
			{Slug: "mpasi-bubur-ayam-wortel", Judul: "Bubur Ayam Wortel", Ringkasan: "Resep MPASI praktis kaya protein dan vitamin A.", Isi: "Campur nasi tim, ayam cincang, dan wortel kukus hingga lembut.", Kategori: "MPASI 6+", Phase: "6-8 Bulan", Tags: "resep,ayam,wortel", ImageURL: "https://images.unsplash.com/photo-1547592180-85f173990554?w=1200&h=680&fit=crop", ReadMin: 4},
			{Slug: "mpasi-puree-alpukat-pisang", Judul: "Puree Alpukat Pisang", Ringkasan: "Menu tinggi lemak baik untuk pertumbuhan otak.", Isi: "Haluskan alpukat matang dan pisang, sajikan segera.", Kategori: "MPASI 6+", Phase: "6-8 Bulan", Tags: "alpukat,pisang", ImageURL: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=1200&h=680&fit=crop", ReadMin: 3},
			{Slug: "mpasi-tim-ikan-bayam", Judul: "Tim Ikan Bayam", Ringkasan: "Sumber omega-3 dan zat besi untuk bayi.", Isi: "Kukus ikan, campur bayam dan nasi tim, haluskan sesuai tekstur usia.", Kategori: "MPASI 8+", Phase: "9-11 Bulan", Tags: "ikan,bayam", ImageURL: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=1200&h=680&fit=crop", ReadMin: 5},
			{Slug: "mpasi-finger-food-ubi", Judul: "Finger Food Ubi Kukus", Ringkasan: "Camilan sehat untuk latihan menggenggam.", Isi: "Potong ubi kukus berbentuk stick agar mudah dipegang bayi.", Kategori: "MPASI 9+", Phase: "9-11 Bulan", Tags: "finger-food,ubi", ImageURL: "https://images.unsplash.com/photo-1543353071-087092ec393a?w=1200&h=680&fit=crop", ReadMin: 4},
			{Slug: "mpasi-sup-krim-labu", Judul: "Sup Krim Labu", Ringkasan: "Resep lembut kaya beta karoten.", Isi: "Rebus labu, blender dengan kaldu ayam rumahan hingga lembut.", Kategori: "MPASI 10+", Phase: "12-24 Bulan", Tags: "labu,sup", ImageURL: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=1200&h=680&fit=crop", ReadMin: 4},
		},
		"informasi_umum": {
			{Slug: "info-umum-cuci-tangan-6-langkah", Judul: "Cuci Tangan 6 Langkah", Ringkasan: "Panduan PHBS dasar untuk keluarga.", Isi: "Biasakan cuci tangan sebelum makan, setelah toilet, dan setelah beraktivitas luar rumah.", Kategori: "PHBS", Phase: "umum", Tags: "phbs,kebersihan", ImageURL: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=1200&h=680&fit=crop", ReadMin: 4},
			{Slug: "info-umum-jadwal-imunisasi", Judul: "Ringkasan Jadwal Imunisasi Anak", Ringkasan: "Catatan singkat jadwal imunisasi dasar.", Isi: "Simpan jadwal imunisasi di rumah agar kunjungan ke fasilitas kesehatan teratur.", Kategori: "Imunisasi", Phase: "bayi", Tags: "imunisasi,bayi", ImageURL: "https://images.unsplash.com/photo-1576765607924-3f5aa9f95d21?w=1200&h=680&fit=crop", ReadMin: 5},
			{Slug: "info-umum-gigi-anak-pertama", Judul: "Perawatan Gigi Anak Pertama", Ringkasan: "Mulai kebiasaan menyikat gigi sejak dini.", Isi: "Gunakan sikat gigi anak dan pasta gigi sesuai rekomendasi usia.", Kategori: "Perawatan Anak", Phase: "balita", Tags: "gigi,perawatan", ImageURL: "https://images.unsplash.com/photo-1588776814546-ec7e5f0f6d03?w=1200&h=680&fit=crop", ReadMin: 4},
			{Slug: "info-umum-keamanan-rumah-anak", Judul: "Checklist Keamanan Rumah Ramah Anak", Ringkasan: "Cegah cedera anak dengan pengamanan sederhana.", Isi: "Pasang pengaman sudut meja, kunci lemari obat, dan tutup stop kontak.", Kategori: "Keamanan", Phase: "umum", Tags: "keamanan,rumah", ImageURL: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=1200&h=680&fit=crop", ReadMin: 5},
			{Slug: "info-umum-bencana-keluarga", Judul: "Persiapan Darurat Bencana Keluarga", Ringkasan: "Rencana keluarga untuk situasi darurat.", Isi: "Siapkan tas siaga, daftar kontak penting, dan titik kumpul keluarga.", Kategori: "Kesiapsiagaan", Phase: "umum", Tags: "bencana,kesiapsiagaan", ImageURL: "https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?w=1200&h=680&fit=crop", ReadMin: 6},
		},
		"mental_orang_tua": {
			{Slug: "mental-orang-tua-kelola-baby-blues", Judul: "Mengelola Baby Blues dengan Dukungan Rumah", Ringkasan: "Langkah awal menjaga kesehatan mental ibu pasca melahirkan.", Isi: "Validasi emosi, minta dukungan pasangan, dan istirahat cukup setiap hari.", Kategori: "Baby Blues", Phase: "setelah_melahirkan", Tags: "baby-blues,mental", ImageURL: "https://images.unsplash.com/photo-1492724441997-5dc865305da7?w=1200&h=680&fit=crop", ReadMin: 6},
			{Slug: "mental-orang-tua-cegah-burnout", Judul: "Mencegah Burnout Pengasuhan", Ringkasan: "Strategi praktis agar energi emosional tetap stabil.", Isi: "Atur jeda harian, bagi peran dengan pasangan, dan batasi ekspektasi berlebihan.", Kategori: "Burnout", Phase: "menyusui", Tags: "burnout,parenting", ImageURL: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&h=680&fit=crop", ReadMin: 6},
			{Slug: "mental-orang-tua-red-flag-ppd", Judul: "Mengenali Red Flag PPD", Ringkasan: "Kapan gejala perlu konsultasi profesional.", Isi: "Jika gejala bertahan >2 minggu dan mengganggu fungsi harian, konsultasikan segera.", Kategori: "PPD (Postpartum Depression)", Phase: "setelah_melahirkan", Tags: "ppd,depresi", ImageURL: "https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?w=1200&h=680&fit=crop", ReadMin: 7},
			{Slug: "mental-orang-tua-latihan-nafas", Judul: "Latihan Napas 4-6 untuk Redakan Cemas", Ringkasan: "Teknik pernapasan singkat saat stres meningkat.", Isi: "Tarik napas 4 hitungan, hembuskan 6 hitungan selama 3-5 menit.", Kategori: "Kecemasan", Phase: "kehamilan", Tags: "cemas,relaksasi", ImageURL: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=1200&h=680&fit=crop", ReadMin: 4},
			{Slug: "mental-orang-tua-support-system", Judul: "Membangun Support System Orang Tua", Ringkasan: "Peran keluarga dan komunitas dalam kesehatan mental.", Isi: "Buat daftar kontak dukungan, jadwalkan check-in mingguan dengan orang terdekat.", Kategori: "Stress", Phase: "umum", Tags: "support-system,stres", ImageURL: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&h=680&fit=crop", ReadMin: 5},
		},
		"contents": {
			{Slug: "konten-umum-pola-tidur-bayi", Judul: "Pola Tidur Bayi Sesuai Usia", Ringkasan: "Panduan ringkas jam tidur bayi dan balita.", Isi: "Buat rutinitas tidur konsisten untuk membantu kualitas tidur anak.", Kategori: "Parenting", Phase: "bayi", Tags: "tidur,bayi", ImageURL: "https://images.unsplash.com/photo-1478806146488-cf11bf6a7b8c?w=1200&h=680&fit=crop", ReadMin: 5},
			{Slug: "konten-umum-camilan-sehat-balita", Judul: "Ide Camilan Sehat untuk Balita", Ringkasan: "Pilihan camilan bernutrisi untuk selingan.", Isi: "Kombinasikan buah segar, yogurt tanpa gula, dan kacang sesuai usia.", Kategori: "Gizi", Phase: "balita", Tags: "camilan,balita", ImageURL: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&h=680&fit=crop", ReadMin: 4},
			{Slug: "konten-umum-komunikasi-positif-anak", Judul: "Komunikasi Positif dengan Anak", Ringkasan: "Teknik komunikasi untuk mengurangi konflik.", Isi: "Gunakan kalimat sederhana, validasi emosi, dan berikan pilihan terbatas.", Kategori: "Parenting", Phase: "3-6 Tahun", Tags: "komunikasi,parenting", ImageURL: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=1200&h=680&fit=crop", ReadMin: 6},
			{Slug: "konten-umum-ceklist-kunjungan-posyandu", Judul: "Checklist Kunjungan Posyandu", Ringkasan: "Daftar persiapan sebelum ke posyandu.", Isi: "Bawa buku KIA, catatan keluhan, dan rekam tumbuh kembang terbaru.", Kategori: "Kesehatan Ibu", Phase: "umum", Tags: "posyandu,kia", ImageURL: "https://images.unsplash.com/photo-1576765607924-3f5aa9f95d21?w=1200&h=680&fit=crop", ReadMin: 5},
			{Slug: "konten-umum-phbs-rumah", Judul: "PHBS di Rumah untuk Keluarga", Ringkasan: "Praktik harian menjaga kebersihan rumah.", Isi: "Jadwalkan kebersihan rutin dan ajarkan kebiasaan bersih sejak dini.", Kategori: "PHBS", Phase: "umum", Tags: "phbs,rumah", ImageURL: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=1200&h=680&fit=crop", ReadMin: 5},
		},
	}

	for tableName, items := range tableItems {
		for _, item := range items {
			upsertFeatureContent(db, tableName, adminID, item)
		}
	}

	seedPolaAsuhDummies(db, adminID)
	log.Println("âœ… Seed: Data dummy konten fitur selesai diproses")
}

func upsertFeatureContent(db *gorm.DB, tableName string, adminID string, item contentSeedItem) {
	var existing models.Content
	err := db.Table(tableName).Model(&models.Content{}).Unscoped().Where("slug = ?", item.Slug).First(&existing).Error
	if err == nil {
		if existing.DeletedAt.Valid {
			if errRestore := db.Table(tableName).Unscoped().Model(&models.Content{}).Where("id = ?", existing.ID).Update("deleted_at", nil).Error; errRestore != nil {
				log.Printf("warning: seed gagal restore konten %s (%s): %v", item.Slug, tableName, errRestore)
			}
		}
		return
	}
	if err != nil && err != gorm.ErrRecordNotFound {
		log.Printf("warning: seed gagal cek konten %s (%s): %v", item.Slug, tableName, err)
		return
	}

	payload := models.Content{
		AdminID:     adminID,
		Slug:        item.Slug,
		Judul:       item.Judul,
		Ringkasan:   item.Ringkasan,
		Isi:         item.Isi,
		Kategori:    item.Kategori,
		Phase:       item.Phase,
		Tags:        item.Tags,
		GambarURL:   item.ImageURL,
		ReadMinutes: item.ReadMin,
		IsPublished: true,
	}

	if err := db.Table(tableName).
		Clauses(clause.OnConflict{Columns: []clause.Column{{Name: "slug"}}, DoNothing: true}).
		Create(&payload).Error; err != nil {
		log.Printf("warning: seed gagal insert konten %s (%s): %v", item.Slug, tableName, err)
	}
}

func seedPolaAsuhDummies(db *gorm.DB, adminID string) {
	items := []polaAsuhSeedItem{
		{Slug: "pola-asuh-konsisten-0-18", Judul: "Pola Asuh Responsif 0-18 Bulan", Ringkasan: "Membangun rasa aman dengan respons cepat dan hangat.", Isi: "Pola asuh responsif membantu bayi membentuk keterikatan aman.", Kategori: "tahap-bayi", Phase: "0-18 Bulan", LangkahPraktis: []string{"Respon tangisan secara konsisten", "Bangun rutinitas tidur dan makan", "Gunakan sentuhan dan kontak mata", "Berikan bahasa yang lembut"}, ImageURL: "https://images.unsplash.com/photo-1503454537688-e7b99cede977?w=1200&h=680&fit=crop", ReadMin: 6},
		{Slug: "pola-asuh-tantrum-1-3", Judul: "Mendampingi Tantrum Usia 1.5-3 Tahun", Ringkasan: "Teknik tenang saat anak meluapkan emosi.", Isi: "Tantrum adalah fase belajar regulasi emosi pada anak.", Kategori: "tahap-salita", Phase: "1.5-3 Tahun", LangkahPraktis: []string{"Pastikan anak aman", "Tetap tenang dan stabil", "Validasi emosi dengan kata sederhana", "Ajak refleksi setelah anak tenang"}, ImageURL: "https://images.unsplash.com/photo-1484662020986-75935d2ebc66?w=1200&h=680&fit=crop", ReadMin: 7},
		{Slug: "pola-asuh-disiplin-3-6", Judul: "Disiplin Positif untuk Usia 3-6 Tahun", Ringkasan: "Menetapkan batas tanpa hukuman keras.", Isi: "Anak belajar tanggung jawab saat aturan jelas dan konsisten.", Kategori: "tahap-pra-sekolah", Phase: "3-6 Tahun", LangkahPraktis: []string{"Jelaskan aturan singkat", "Gunakan konsekuensi logis", "Fokus pada perilaku, bukan label anak", "Apresiasi kemajuan kecil"}, ImageURL: "https://images.unsplash.com/photo-1607457561901-e6ec3a6d16cf?w=1200&h=680&fit=crop", ReadMin: 7},
		{Slug: "pola-asuh-kualitas-waktu-6plus", Judul: "Kualitas Waktu Bersama Anak 6+ Tahun", Ringkasan: "Membangun koneksi lewat aktivitas bermakna.", Isi: "Kualitas interaksi lebih penting daripada durasi kebersamaan.", Kategori: "tahap-sekolah", Phase: "6+ Tahun", LangkahPraktis: []string{"Sediakan waktu bebas gawai", "Ajukan pertanyaan terbuka", "Lakukan aktivitas sesuai minat anak", "Tutup hari dengan refleksi positif"}, ImageURL: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&h=680&fit=crop", ReadMin: 6},
		{Slug: "pola-asuh-kemandirian-anak", Judul: "Melatih Kemandirian Anak di Rumah", Ringkasan: "Membimbing anak berani mencoba sendiri.", Isi: "Kemandirian tumbuh saat anak diberi kesempatan untuk berlatih.", Kategori: "tahap-pra-sekolah", Phase: "3-6 Tahun", LangkahPraktis: []string{"Berikan pilihan sederhana", "Pecah tugas besar jadi langkah kecil", "Biarkan anak menyelesaikan tugas", "Puji proses, bukan hanya hasil"}, ImageURL: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=1200&h=680&fit=crop", ReadMin: 6},
	}

	for _, item := range items {
		var existing models.PolaAsuh
		err := db.Unscoped().Where("slug = ?", item.Slug).First(&existing).Error
		if err == nil {
			if existing.DeletedAt.Valid {
				if errRestore := db.Unscoped().Model(&models.PolaAsuh{}).Where("id = ?", existing.ID).Update("deleted_at", nil).Error; errRestore != nil {
					log.Printf("warning: seed gagal restore pola asuh %s: %v", item.Slug, errRestore)
				}
			}
			continue
		}
		if err != nil && err != gorm.ErrRecordNotFound {
			log.Printf("warning: seed gagal cek pola asuh %s: %v", item.Slug, err)
			continue
		}

		langkahJSON, _ := json.Marshal(item.LangkahPraktis)
		payload := models.PolaAsuh{
			AdminID:        adminID,
			Slug:           item.Slug,
			Judul:          item.Judul,
			Ringkasan:      item.Ringkasan,
			Isi:            item.Isi,
			Kategori:       item.Kategori,
			Phase:          item.Phase,
			LangkahPraktis: string(langkahJSON),
			GambarURL:      item.ImageURL,
			ReadMinutes:    item.ReadMin,
			IsPublished:    true,
		}

		if err := db.
			Clauses(clause.OnConflict{Columns: []clause.Column{{Name: "slug"}}, DoNothing: true}).
			Create(&payload).Error; err != nil {
			log.Printf("warning: seed gagal insert pola asuh %s: %v", item.Slug, err)
		}
	}
}

// SeedQuizDummies mengisi 4 kuis lengkap dengan soal dan opsi jawaban.
func SeedQuizDummies(db *gorm.DB) {
	quizzes := []quizSeed{
		{
			Judul:     "Kuis Dasar Gizi Ibu Hamil",
			Deskripsi: "Uji pemahaman gizi ibu hamil trimester 1-3.",
			Kategori:  "Gizi",
			Phase:     "kehamilan",
			Pertanyaan: []quizQuestionSeed{
				{Teks: "Nutrisi kunci untuk mencegah anemia pada ibu hamil adalah...", Pilihan: []string{"Vitamin C", "Zat besi", "Kalsium", "Yodium"}, CorrectIdx: 1, Penjelasan: "Zat besi berperan penting dalam pembentukan hemoglobin."},
				{Teks: "Sumber protein hewani yang baik untuk ibu hamil adalah...", Pilihan: []string{"Kerupuk", "Daging/ikan/telur", "Sirup", "Mie instan"}, CorrectIdx: 1, Penjelasan: "Protein hewani mengandung asam amino esensial lengkap."},
				{Teks: "Kebutuhan cairan ibu hamil yang aman dipenuhi dari...", Pilihan: []string{"Minuman manis", "Air putih", "Kopi berlebih", "Soda"}, CorrectIdx: 1, Penjelasan: "Air putih adalah sumber hidrasi terbaik."},
				{Teks: "Asam folat paling dianjurkan mulai kapan?", Pilihan: []string{"Sebelum hamil hingga trimester awal", "Trimester akhir saja", "Setelah melahirkan", "Saat anak MPASI"}, CorrectIdx: 0, Penjelasan: "Asam folat penting sejak perencanaan kehamilan."},
				{Teks: "Contoh camilan sehat ibu hamil adalah...", Pilihan: []string{"Buah dan yogurt", "Keripik pedas", "Permen", "Minuman energi"}, CorrectIdx: 0, Penjelasan: "Buah dan yogurt membantu serat, vitamin, dan protein ringan."},
			},
		},
		{
			Judul:     "Kuis MPASI dan Gizi Anak",
			Deskripsi: "Evaluasi pemahaman menu MPASI dan gizi anak.",
			Kategori:  "Gizi Anak",
			Phase:     "balita",
			Pertanyaan: []quizQuestionSeed{
				{Teks: "MPASI umumnya mulai diberikan pada usia...", Pilihan: []string{"3 bulan", "6 bulan", "9 bulan", "12 bulan"}, CorrectIdx: 1, Penjelasan: "Rekomendasi WHO: MPASI dimulai pada 6 bulan."},
				{Teks: "Komponen menu seimbang anak adalah...", Pilihan: []string{"Karbo saja", "Protein saja", "Karbo, protein, sayur, buah", "Makanan instan"}, CorrectIdx: 2, Penjelasan: "Menu seimbang membantu tumbuh kembang optimal."},
				{Teks: "Tekstur MPASI perlu...", Pilihan: []string{"Selalu cair", "Meningkat bertahap sesuai usia", "Langsung makanan keluarga", "Tidak perlu diubah"}, CorrectIdx: 1, Penjelasan: "Tekstur bertahap melatih oral motorik anak."},
				{Teks: "Jika anak GTM, orang tua sebaiknya...", Pilihan: []string{"Memaksa makan", "Menawarkan variasi menu", "Menghukum", "Menghentikan makan"}, CorrectIdx: 1, Penjelasan: "Variasi menu dan suasana makan positif lebih efektif."},
				{Teks: "Sumber lemak baik untuk anak adalah...", Pilihan: []string{"Margarin berlebih", "Alpukat", "Permen", "Minuman bersoda"}, CorrectIdx: 1, Penjelasan: "Alpukat mengandung lemak baik untuk perkembangan otak."},
			},
		},
		{
			Judul:     "Kuis Parenting dan Pola Asuh",
			Deskripsi: "Mengukur pengetahuan praktik pola asuh positif.",
			Kategori:  "Parenting",
			Phase:     "pra-sekolah",
			Pertanyaan: []quizQuestionSeed{
				{Teks: "Saat anak tantrum, langkah pertama adalah...", Pilihan: []string{"Membentak", "Memastikan anak aman", "Membiarkan sendiri", "Membandingkan dengan anak lain"}, CorrectIdx: 1, Penjelasan: "Keamanan fisik anak adalah prioritas utama."},
				{Teks: "Disiplin positif berfokus pada...", Pilihan: []string{"Hukuman keras", "Solusi dan konsistensi", "Ancaman", "Hadiah berlebihan"}, CorrectIdx: 1, Penjelasan: "Disiplin positif menekankan pembelajaran perilaku."},
				{Teks: "Cara efektif membangun kedekatan anak adalah...", Pilihan: []string{"Mengurangi interaksi", "Waktu berkualitas rutin", "Memberi gawai terus", "Membiarkan tanpa batas"}, CorrectIdx: 1, Penjelasan: "Waktu berkualitas memperkuat ikatan emosi."},
				{Teks: "Validasi emosi anak berarti...", Pilihan: []string{"Mengabaikan emosi", "Mengakui perasaan anak", "Menyalahkan anak", "Mengolok emosi"}, CorrectIdx: 1, Penjelasan: "Anak butuh merasa dipahami agar belajar regulasi emosi."},
				{Teks: "Melatih kemandirian terbaik dilakukan dengan...", Pilihan: []string{"Semua dikerjakan orang tua", "Memberi tugas kecil sesuai usia", "Menghukum kesalahan", "Membebaskan tanpa arahan"}, CorrectIdx: 1, Penjelasan: "Tugas kecil bertahap membangun percaya diri."},
			},
		},
		{
			Judul:     "Kuis Kesehatan Mental Orang Tua",
			Deskripsi: "Deteksi dini pemahaman mental health pengasuhan.",
			Kategori:  "Mental Orang Tua",
			Phase:     "umum",
			Pertanyaan: []quizQuestionSeed{
				{Teks: "Tanda perlu bantuan profesional adalah...", Pilihan: []string{"Sedih 1 hari", "Gejala >2 minggu dan mengganggu fungsi", "Capek biasa", "Bosan sesaat"}, CorrectIdx: 1, Penjelasan: "Durasi dan dampak fungsi harian adalah indikator penting."},
				{Teks: "Strategi meredakan cemas cepat adalah...", Pilihan: []string{"Menahan napas", "Latihan napas 4-6", "Menambah kopi", "Begadang"}, CorrectIdx: 1, Penjelasan: "Pernapasan teratur membantu menurunkan ketegangan."},
				{Teks: "Support system keluarga berfungsi untuk...", Pilihan: []string{"Menambah beban", "Meringankan beban emosional", "Menghakimi orang tua", "Mengabaikan masalah"}, CorrectIdx: 1, Penjelasan: "Dukungan sosial menurunkan risiko burnout."},
				{Teks: "Self-care orang tua dapat berupa...", Pilihan: []string{"Tidak tidur", "Jeda istirahat terjadwal", "Melewati makan", "Memendam emosi"}, CorrectIdx: 1, Penjelasan: "Self-care sederhana konsisten membantu kestabilan emosi."},
				{Teks: "Baby blues umumnya terjadi pada...", Pilihan: []string{"Setelah melahirkan", "Sebelum menikah", "Saat anak sekolah", "Saat pensiun"}, CorrectIdx: 0, Penjelasan: "Baby blues lazim pada awal periode postpartum."},
			},
		},
	}

	for _, quiz := range quizzes {
		upsertQuizWithQuestions(db, quiz)
	}

	log.Println("âœ… Seed: Data dummy kuis selesai diproses")
}

func upsertQuizWithQuestions(db *gorm.DB, seed quizSeed) {
	var existing models.Quiz
	err := db.Where("LOWER(judul) = LOWER(?)", seed.Judul).First(&existing).Error
	if err == nil {
		return
	}
	if err != nil && err != gorm.ErrRecordNotFound {
		log.Printf("âš ï¸ Seed: gagal cek quiz %s: %v", seed.Judul, err)
		return
	}

	quiz := models.Quiz{
		Judul:       seed.Judul,
		Deskripsi:   seed.Deskripsi,
		Kategori:    seed.Kategori,
		Phase:       seed.Phase,
		IsPublished: true,
	}
	if err := db.Create(&quiz).Error; err != nil {
		log.Printf("âš ï¸ Seed: gagal membuat quiz %s: %v", seed.Judul, err)
		return
	}

	for idx, q := range seed.Pertanyaan {
		if len(q.Pilihan) == 0 || q.CorrectIdx < 0 || q.CorrectIdx >= len(q.Pilihan) {
			continue
		}

		pilihanJSON, _ := json.Marshal(q.Pilihan)
		jawabanBenar := q.Pilihan[q.CorrectIdx]
		question := models.QuizQuestion{
			QuizID:       quiz.ID,
			Teks:         q.Teks,
			Pilihan:      string(pilihanJSON),
			JawabanBenar: jawabanBenar,
			Penjelasan:   q.Penjelasan,
			Urutan:       idx + 1,
		}
		if err := db.Create(&question).Error; err != nil {
			log.Printf("âš ï¸ Seed: gagal membuat pertanyaan quiz %s: %v", seed.Judul, err)
			continue
		}

		for optIdx, option := range q.Pilihan {
			opt := models.QuizOption{
				QuestionID: question.ID,
				OptionKey:  optionKey(optIdx),
				OptionText: option,
				IsCorrect:  optIdx == q.CorrectIdx,
				Urutan:     (idx+1)*10 + optIdx,
			}
			if err := db.Create(&opt).Error; err != nil {
				log.Printf("âš ï¸ Seed: gagal membuat opsi quiz %s: %v", seed.Judul, err)
			}
		}
	}
}

func optionKey(index int) string {
	if index >= 0 && index < 26 {
		return string(rune('A' + index))
	}
	return fmt.Sprintf("%d", index+1)
}
