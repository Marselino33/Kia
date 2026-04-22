package seed

import (
	"log"

	"sejiwa-backend/app/models"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

const (
	primaryAdminName     = "Admin KIA Cerdas"
	primaryAdminEmail    = "admin@sejiwa.id"
	primaryAdminPassword = "123456"
	primaryAdminDesa     = "Pusat"
)

// SeedAdmin memastikan akun admin utama selalu tersedia di database.
// Email: admin@sejiwa.id, Password: 123456, Role: admin
func SeedAdmin(db *gorm.DB) *models.Pengguna {
	var admin models.Pengguna
	err := db.Where("LOWER(email) = LOWER(?)", primaryAdminEmail).First(&admin).Error
	if err == nil {
		hash, errHash := bcrypt.GenerateFromPassword([]byte(primaryAdminPassword), bcrypt.DefaultCost)
		if errHash != nil {
			log.Println("⚠️ Seed: gagal hash password admin utama:", errHash)
			return &admin
		}

		updates := map[string]interface{}{
			"nama":          primaryAdminName,
			"role":          "admin",
			"desa":          primaryAdminDesa,
			"password_hash": string(hash),
		}
		if errUpdate := db.Model(&admin).Updates(updates).Error; errUpdate != nil {
			log.Println("⚠️ Seed: gagal sinkronisasi profil admin utama:", errUpdate)
		} else {
			admin.Nama = primaryAdminName
			admin.Role = "admin"
			admin.Desa = primaryAdminDesa
			admin.PasswordHash = string(hash)
		}

		log.Println("✅ Seed: Admin utama tersedia (Email: admin@sejiwa.id, Password: 123456)")
		return &admin
	}

	if err != gorm.ErrRecordNotFound {
		log.Println("❌ Seed: Gagal memeriksa admin utama:", err)
		return nil
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(primaryAdminPassword), bcrypt.DefaultCost)
	if err != nil {
		log.Println("❌ Seed: Gagal hash password admin:", err)
		return nil
	}

	admin = models.Pengguna{
		Nama:         primaryAdminName,
		Email:        primaryAdminEmail,
		PasswordHash: string(hash),
		Role:         "admin",
		Desa:         primaryAdminDesa,
	}

	if err := db.Create(&admin).Error; err != nil {
		log.Println("❌ Seed: Gagal membuat admin utama:", err)
		return nil
	}

	log.Println("✅ Seed: Admin utama berhasil dibuat (Email: admin@sejiwa.id, Password: 123456)")
	return &admin
}
