package controllers

import (
	"sort"
	"strings"

	"sejiwa-backend/app/models"

	"gorm.io/gorm"
)

var featureContentTables = map[string]string{
	"parenting":        "stimulus_anak",
	"stimulus_anak":    "stimulus_anak",
	"pola-asuh":        "pola_asuh",
	"pola_asuh":        "pola_asuh",
	"phbs":             "informasi_umum",
	"gizi-ibu":         "gizi_ibu",
	"gizi_ibu":         "gizi_ibu",
	"gizi-anak":        "gizi_anak",
	"gizi_anak":        "gizi_anak",
	"mpasi":            "mpasi",
	"informasi-umum":   "informasi_umum",
	"informasi_umum":   "informasi_umum",
	"mental-orang-tua": "mental_orang_tua",
	"mental_orang_tua": "mental_orang_tua",
	"contents":         "contents",
	"konten":           "contents",
}

var allContentTables = []string{
	"stimulus_anak",
	"pola_asuh",
	"informasi_umum",
	"gizi_ibu",
	"gizi_anak",
	"mpasi",
	"mental_orang_tua",
	"contents",
}

func normalizeFeatureKey(feature string) string {
	return strings.ToLower(strings.TrimSpace(strings.ReplaceAll(feature, " ", "-")))
}

func tableNameForFeature(feature string) string {
	key := normalizeFeatureKey(feature)
	if table, ok := featureContentTables[key]; ok {
		return table
	}
	return ""
}

func queryFeatureContents(db *gorm.DB, tableName string, publishedOnly bool) ([]models.Content, error) {
	var list []models.Content
	query := db.Table(tableName).Model(&models.Content{})
	if publishedOnly {
		query = query.Where("is_published = ?", true)
	}
	if err := query.Order("created_at DESC").Find(&list).Error; err != nil {
		if isMissingTableError(err) {
			return []models.Content{}, nil
		}
		return nil, err
	}
	return list, nil
}

func queryAllContents(db *gorm.DB, publishedOnly bool) ([]models.Content, error) {
	all := make([]models.Content, 0)
	for _, tableName := range allContentTables {
		items, err := queryFeatureContents(db, tableName, publishedOnly)
		if err != nil {
			return nil, err
		}
		all = append(all, items...)
	}

	sort.SliceStable(all, func(i, j int) bool {
		return all[i].CreatedAt.After(all[j].CreatedAt)
	})

	seen := make(map[string]struct{}, len(all))
	deduped := make([]models.Content, 0, len(all))
	for _, item := range all {
		if _, ok := seen[item.Slug]; ok {
			continue
		}
		seen[item.Slug] = struct{}{}
		deduped = append(deduped, item)
	}

	return deduped, nil
}

func findContentBySlug(db *gorm.DB, slug string) (*models.Content, string, error) {
	for _, tableName := range allContentTables {
		var item models.Content
		err := db.Table(tableName).Model(&models.Content{}).Where("slug = ?", slug).First(&item).Error
		if err == nil {
			return &item, tableName, nil
		}
		if isMissingTableError(err) {
			continue
		}
		if err != gorm.ErrRecordNotFound {
			return nil, "", err
		}
	}
	return nil, "", gorm.ErrRecordNotFound
}

func isMissingTableError(err error) bool {
	if err == nil {
		return false
	}
	msg := strings.ToLower(err.Error())
	return strings.Contains(msg, "sqlstate 42p01") || (strings.Contains(msg, "relation") && strings.Contains(msg, "does not exist"))
}
