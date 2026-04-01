// Package seed menyediakan data awal yang dibutuhkan sistem SEJIWA.
// Seed dijalankan otomatis saat pertama kali aplikasi distart (jika tabel master_vaksin kosong).
package seed

import (
	"log"

	"sejiwa-backend/app/models"

	"gorm.io/gorm"
)

// vaksinKIA2024 adalah 26 vaksin wajib berdasarkan Buku KIA 2024 Kemenkes RI.
// Nama vaksin HARUS konsisten dengan yang dipakai di frontend Flutter (sejiwa_data.dart).
var vaksinKIA2024 = []models.MasterVaksin{
	{
		NamaVaksin: "Hepatitis B (HB-0)",
		UsiaBulan:  0,
		UsiaTeks:   "0–24 jam setelah lahir",
		Deskripsi:  "Vaksin Hepatitis B dosis pertama diberikan sesegera mungkin setelah lahir (idealnya dalam 12 jam). Mencegah infeksi Hepatitis B yang dapat menyebabkan penyakit hati kronis.",
		Lokasi:     "Fasilitas persalinan / Puskesmas Balige",
		Sumber:     "Buku KIA 2024",
	},
	{
		NamaVaksin: "Polio 0 (OPV)",
		UsiaBulan:  0,
		UsiaTeks:   "0–24 jam setelah lahir",
		Deskripsi:  "Vaksin Polio oral (tetes) dosis pertama diberikan saat lahir bersama Hepatitis B. Mencegah penyakit poliomielitis yang dapat menyebabkan kelumpuhan.",
		Lokasi:     "Fasilitas persalinan / Puskesmas Balige",
		Sumber:     "Buku KIA 2024",
	},
	{
		NamaVaksin: "BCG",
		UsiaBulan:  1,
		UsiaTeks:   "1 bulan",
		Deskripsi:  "Vaksin BCG (Bacillus Calmette-Guérin) melindungi dari penyakit Tuberkulosis (TBC) yang berat. Diberikan satu kali seumur hidup.",
		Lokasi:     "Posyandu Mejan / Puskesmas Balige",
		Sumber:     "Buku KIA 2024",
	},
	{
		NamaVaksin: "Polio 1 (OPV)",
		UsiaBulan:  1,
		UsiaTeks:   "1 bulan",
		Deskripsi:  "Vaksin Polio oral dosis kedua untuk memperkuat kekebalan terhadap virus polio.",
		Lokasi:     "Posyandu Mejan / Puskesmas Balige",
		Sumber:     "Buku KIA 2024",
	},
	{
		NamaVaksin: "DPT-HB-Hib 1",
		UsiaBulan:  2,
		UsiaTeks:   "2 bulan",
		Deskripsi:  "Vaksin kombinasi yang melindungi dari Difteri, Pertusis (batuk rejan), Tetanus, Hepatitis B, dan Haemophilus influenzae tipe b (Hib). Dosis pertama dari 4 dosis.",
		Lokasi:     "Posyandu Mejan / Puskesmas Balige",
		Sumber:     "Buku KIA 2024",
	},
	{
		NamaVaksin: "Polio 2 (OPV)",
		UsiaBulan:  2,
		UsiaTeks:   "2 bulan",
		Deskripsi:  "Vaksin Polio oral dosis ketiga.",
		Lokasi:     "Posyandu Mejan / Puskesmas Balige",
		Sumber:     "Buku KIA 2024",
	},
	{
		NamaVaksin: "PCV 1",
		UsiaBulan:  2,
		UsiaTeks:   "2 bulan",
		Deskripsi:  "Vaksin Pneumokokus (PCV) melindungi dari bakteri Streptococcus pneumoniae penyebab pneumonia, meningitis, dan infeksi serius lainnya. Dosis pertama dari 4 dosis.",
		Lokasi:     "Posyandu Mejan / Puskesmas Balige",
		Sumber:     "Buku KIA 2024",
	},
	{
		NamaVaksin: "Rotavirus 1",
		UsiaBulan:  2,
		UsiaTeks:   "2 bulan",
		Deskripsi:  "Vaksin Rotavirus mencegah diare berat yang disebabkan virus rotavirus. Dosis pertama, diberikan secara oral (tetes).",
		Lokasi:     "Posyandu Mejan / Puskesmas Balige",
		Sumber:     "Buku KIA 2024",
	},
	{
		NamaVaksin: "DPT-HB-Hib 2",
		UsiaBulan:  3,
		UsiaTeks:   "3 bulan",
		Deskripsi:  "Vaksin DPT-HB-Hib dosis kedua untuk memperkuat perlindungan.",
		Lokasi:     "Posyandu Mejan / Puskesmas Balige",
		Sumber:     "Buku KIA 2024",
	},
	{
		NamaVaksin: "Polio 3 (OPV)",
		UsiaBulan:  3,
		UsiaTeks:   "3 bulan",
		Deskripsi:  "Vaksin Polio oral dosis keempat.",
		Lokasi:     "Posyandu Mejan / Puskesmas Balige",
		Sumber:     "Buku KIA 2024",
	},
	{
		NamaVaksin: "PCV 2",
		UsiaBulan:  3,
		UsiaTeks:   "3 bulan",
		Deskripsi:  "Vaksin Pneumokokus dosis kedua.",
		Lokasi:     "Posyandu Mejan / Puskesmas Balige",
		Sumber:     "Buku KIA 2024",
	},
	{
		NamaVaksin: "Rotavirus 2",
		UsiaBulan:  3,
		UsiaTeks:   "3 bulan",
		Deskripsi:  "Vaksin Rotavirus dosis kedua (oral).",
		Lokasi:     "Posyandu Mejan / Puskesmas Balige",
		Sumber:     "Buku KIA 2024",
	},
	{
		NamaVaksin: "DPT-HB-Hib 3",
		UsiaBulan:  4,
		UsiaTeks:   "4 bulan",
		Deskripsi:  "Vaksin DPT-HB-Hib dosis ketiga. Setelah ini, seri imunisasi dasar DPT-HB-Hib selesai.",
		Lokasi:     "Posyandu Mejan / Puskesmas Balige",
		Sumber:     "Buku KIA 2024",
	},
	{
		NamaVaksin: "Polio 4 (OPV + IPV)",
		UsiaBulan:  4,
		UsiaTeks:   "4 bulan",
		Deskripsi:  "Vaksin Polio dosis terakhir imunisasi dasar: OPV (oral) dan IPV (suntik) diberikan bersamaan untuk perlindungan optimal.",
		Lokasi:     "Posyandu Mejan / Puskesmas Balige",
		Sumber:     "Buku KIA 2024",
	},
	{
		NamaVaksin: "PCV 3",
		UsiaBulan:  4,
		UsiaTeks:   "4 bulan",
		Deskripsi:  "Vaksin Pneumokokus dosis ketiga.",
		Lokasi:     "Posyandu Mejan / Puskesmas Balige",
		Sumber:     "Buku KIA 2024",
	},
	{
		NamaVaksin: "Campak-Rubela (MR) 1",
		UsiaBulan:  9,
		UsiaTeks:   "9 bulan",
		Deskripsi:  "Vaksin Campak-Rubela (MR) dosis pertama. Melindungi dari campak dan rubela (campak Jerman). Rubela pada ibu hamil dapat menyebabkan cacat lahir.",
		Lokasi:     "Posyandu Mejan / Puskesmas Balige",
		Sumber:     "Buku KIA 2024",
	},
	{
		NamaVaksin: "PCV 4",
		UsiaBulan:  9,
		UsiaTeks:   "9 bulan",
		Deskripsi:  "Vaksin Pneumokokus dosis keempat (booster).",
		Lokasi:     "Posyandu Mejan / Puskesmas Balige",
		Sumber:     "Buku KIA 2024",
	},
	{
		NamaVaksin: "JE (Japanese Encephalitis)",
		UsiaBulan:  9,
		UsiaTeks:   "9 bulan (daerah endemis)",
		Deskripsi:  "Vaksin Japanese Encephalitis (radang otak Jepang) untuk daerah endemis. Kabupaten Toba termasuk area yang direkomendasikan mendapat vaksin ini.",
		Lokasi:     "Puskesmas Balige",
		Sumber:     "Buku KIA 2024",
	},
	{
		NamaVaksin: "Influenza",
		UsiaBulan:  12,
		UsiaTeks:   "12 bulan (tiap tahun)",
		Deskripsi:  "Vaksin Influenza melindungi dari virus flu musiman. Diberikan setiap tahun karena virus influenza terus bermutasi.",
		Lokasi:     "Posyandu Mejan / Puskesmas Balige",
		Sumber:     "Buku KIA 2024",
	},
	{
		NamaVaksin: "DPT-HB-Hib 4 (Booster)",
		UsiaBulan:  18,
		UsiaTeks:   "18 bulan",
		Deskripsi:  "Booster DPT-HB-Hib untuk memperbarui kekebalan yang didapat dari seri imunisasi dasar (2-4 bulan).",
		Lokasi:     "Posyandu Mejan / Puskesmas Balige",
		Sumber:     "Buku KIA 2024",
	},
	{
		NamaVaksin: "Campak-Rubela (MR) 2 (Booster)",
		UsiaBulan:  18,
		UsiaTeks:   "18 bulan",
		Deskripsi:  "Booster vaksin Campak-Rubela kedua untuk memastikan perlindungan jangka panjang.",
		Lokasi:     "Posyandu Mejan / Puskesmas Balige",
		Sumber:     "Buku KIA 2024",
	},
	{
		NamaVaksin: "Tifoid",
		UsiaBulan:  24,
		UsiaTeks:   "2 tahun (tiap 3 tahun)",
		Deskripsi:  "Vaksin Tifoid melindungi dari demam tifoid (tifus). Diulang setiap 3 tahun.",
		Lokasi:     "Puskesmas Balige",
		Sumber:     "Buku KIA 2024",
	},
	{
		NamaVaksin: "Hepatitis A",
		UsiaBulan:  24,
		UsiaTeks:   "2 tahun (2 dosis)",
		Deskripsi:  "Vaksin Hepatitis A dosis pertama. Dosis kedua diberikan 6-12 bulan kemudian. Mencegah infeksi Hepatitis A yang menyebabkan penyakit kuning.",
		Lokasi:     "Puskesmas Balige",
		Sumber:     "Buku KIA 2024",
	},
	{
		NamaVaksin: "DPT 5 (Booster)",
		UsiaBulan:  60,
		UsiaTeks:   "5 tahun",
		Deskripsi:  "Booster DPT ke-5 (usia sekolah). Biasanya diberikan saat anak masuk SD.",
		Lokasi:     "Puskesmas Balige",
		Sumber:     "Buku KIA 2024",
	},
	{
		NamaVaksin: "Campak-Rubela (MR) 3",
		UsiaBulan:  60,
		UsiaTeks:   "5 tahun",
		Deskripsi:  "Vaksin MR ke-3 untuk memastikan perlindungan menyeluruh sebelum anak masuk lingkungan sekolah.",
		Lokasi:     "Puskesmas Balige",
		Sumber:     "Buku KIA 2024",
	},
	{
		NamaVaksin: "Polio (IPV 2)",
		UsiaBulan:  60,
		UsiaTeks:   "5 tahun",
		Deskripsi:  "Vaksin Polio IPV (suntik) kedua sebagai booster akhir untuk perlindungan polio jangka panjang.",
		Lokasi:     "Puskesmas Balige",
		Sumber:     "Buku KIA 2024",
	},
}

// SeedMasterVaksin mengisi tabel master_vaksin jika masih kosong.
func SeedMasterVaksin(db *gorm.DB) error {
	var count int64
	if err := db.Model(&models.MasterVaksin{}).Count(&count).Error; err != nil {
		return err
	}

	if count > 0 {
		log.Printf("✅ Seed: %d master vaksin sudah ada, skip seed.", count)
		return nil
	}

	log.Println("🌱 Seed: mengisi 26 master vaksin KIA 2024...")
	if err := db.Create(&vaksinKIA2024).Error; err != nil {
		return err
	}

	log.Printf("✅ Seed: %d master vaksin berhasil dimuat.", len(vaksinKIA2024))
	return nil
}
