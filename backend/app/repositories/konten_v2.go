package repositories

import (
	"strings"

	"gorm.io/gorm"
)

// KontenV2Repository - dipertahankan untuk kompatibilitas antarmuka tetapi
// tidak melakukan sinkronisasi ke tabel konten lama (sudah dihapus).
type KontenV2Repository struct {
	db *gorm.DB
}

func NewKontenV2Repository(db *gorm.DB) *KontenV2Repository {
	return &KontenV2Repository{db: db}
}

// UpsertFromLegacy - no-op, tabel konten lama sudah tidak digunakan
func (r *KontenV2Repository) UpsertFromLegacy(tx *gorm.DB, feature string, legacy interface{}) error {
	return nil
}

// DeleteByID - no-op
func (r *KontenV2Repository) DeleteByID(tx *gorm.DB, id string) error {
	return nil
}

func isMissingRelationError(err error) bool {
	if err == nil {
		return false
	}
	msg := strings.ToLower(err.Error())
	return strings.Contains(msg, "sqlstate 42p01") || (strings.Contains(msg, "relation") && strings.Contains(msg, "does not exist"))
}
