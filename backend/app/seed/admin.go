package seed

import (
	"log"

	"sejiwa-backend/app/models"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// SeedAdmin memastikan akun admin default tersedia di database.
// Email: admin@sejiwa.id, PIN: 123456, Role: admin
func SeedAdmin(db *gorm.DB) {
	var count int64
	db.Model(&models.Pengguna{}).Where("role = ?", "admin").Count(&count)
	if count > 0 {
		log.Println("✅ Seed: Admin sudah ada, skip seed.")
		return
	}

	pinHash, err := bcrypt.GenerateFromPassword([]byte("123456"), bcrypt.DefaultCost)
	if err != nil {
		log.Println("❌ Seed: Gagal hash PIN admin:", err)
		return
	}

	admin := models.Pengguna{
		Nama:    "Admin SEJIWA",
		Email:   "admin@sejiwa.id",
		PasswordHash: string(pinHash),
		Role:    "admin",
		Desa:    "Pusat",
	}

	if err := db.Create(&admin).Error; err != nil {
		log.Println("❌ Seed: Gagal membuat admin:", err)
		return
	}

	log.Println("✅ Seed: Akun admin berhasil dibuat (Email: admin@sejiwa.id, PIN: 123456)")
}
