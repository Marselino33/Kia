package app

import (
	"fmt"
	"log"
	"net"
	"strconv"
	"strings"

	"sejiwa-backend/app/controllers"
	"sejiwa-backend/app/helpers"
	appMiddleware "sejiwa-backend/app/middleware"
	"sejiwa-backend/app/models"
	"sejiwa-backend/app/repositories"
	"sejiwa-backend/app/routes"
	"sejiwa-backend/app/seed"
	"sejiwa-backend/app/usecases"
	"sejiwa-backend/pkg/config"
	"sejiwa-backend/pkg/database"

	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
	echoMiddleware "github.com/labstack/echo/v4/middleware"
	"github.com/spf13/viper"
	"golang.org/x/time/rate"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"

	_ "sejiwa-backend/docs"
)

type Main struct {
	cfg        *config.Config
	db         *gorm.DB
	repo       *repositories.Main
	usecase    *usecases.Main
	controller *controllers.Main
	router     *echo.Echo
}

func New() *Main {
	return new(Main)
}

func runPenggunaEmailMigration(db *gorm.DB) {
	statements := []string{
		`ALTER TABLE IF EXISTS public.pengguna ADD COLUMN IF NOT EXISTS email text`,
		`ALTER TABLE IF EXISTS public.pengguna ADD COLUMN IF NOT EXISTS password_hash text`,
		`UPDATE public.pengguna SET email = 'admin@sejiwa.id' WHERE role = 'admin' AND (email IS NULL OR btrim(email) = '')`,
		`UPDATE public.pengguna SET email = lower(no_hp) WHERE (email IS NULL OR btrim(email) = '') AND no_hp IS NOT NULL AND position('@' in no_hp) > 1`,
		`UPDATE public.pengguna SET email = concat('user_', id, '@placeholder.local') WHERE email IS NULL OR btrim(email) = ''`,
		`DO $m$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'pengguna' AND column_name = 'pin_hash') THEN EXECUTE $q$UPDATE public.pengguna SET password_hash = COALESCE(password_hash, pin_hash) WHERE NULLIF(btrim(password_hash), '') IS NULL$q$; END IF; END $m$`,
		`ALTER TABLE IF EXISTS public.pengguna ALTER COLUMN password_hash SET NOT NULL`,
		`DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'pengguna' AND column_name = 'pin_hash') THEN EXECUTE 'ALTER TABLE public.pengguna DROP COLUMN pin_hash'; END IF; END $$`,
		`ALTER TABLE IF EXISTS public.pengguna ALTER COLUMN no_hp DROP NOT NULL`,
		`DROP INDEX IF EXISTS public.idx_pengguna_no_hp_unique`,
		`ALTER TABLE IF EXISTS public.pengguna DROP CONSTRAINT IF EXISTS idx_pengguna_no_hp`,
		`DROP INDEX IF EXISTS public.idx_pengguna_no_hp`,
		`CREATE UNIQUE INDEX IF NOT EXISTS idx_pengguna_email_unique ON public.pengguna (lower(email)) WHERE deleted_at IS NULL`,
	}

	for _, sql := range statements {
		if err := db.Exec(sql).Error; err != nil {
			log.Printf("Migrasi email pengguna warning: %v", err)
		}
	}
}

func runFeatureContentMigration(db *gorm.DB) {
	statements := []string{
		`ALTER TABLE IF EXISTS public.contents ADD COLUMN IF NOT EXISTS admin_id varchar(36)`,
		`ALTER TABLE IF EXISTS public.contents ALTER COLUMN admin_id DROP NOT NULL`,
		`DO $$
BEGIN
	IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'stimulus_anak') THEN
		CREATE TABLE public.stimulus_anak (
			id varchar(36) PRIMARY KEY,
			admin_id varchar(36) REFERENCES public.pengguna(id) ON DELETE RESTRICT,
			slug text NOT NULL UNIQUE,
			judul text NOT NULL,
			ringkasan text,
			isi text,
			kategori text,
			phase text,
			tags text,
			gambar_url text,
			read_minutes integer DEFAULT 5,
			is_published boolean DEFAULT true,
			created_at timestamptz DEFAULT now(),
			updated_at timestamptz DEFAULT now(),
			deleted_at timestamptz
		);
	END IF;
END $$`,
		`DO $$
BEGIN
	IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'phbs') THEN
		CREATE TABLE public.phbs (
			id varchar(36) PRIMARY KEY,
			admin_id varchar(36) REFERENCES public.pengguna(id) ON DELETE RESTRICT,
			slug text NOT NULL UNIQUE,
			judul text NOT NULL,
			ringkasan text,
			isi text,
			kategori text,
			phase text,
			tags text,
			gambar_url text,
			read_minutes integer DEFAULT 5,
			is_published boolean DEFAULT true,
			created_at timestamptz DEFAULT now(),
			updated_at timestamptz DEFAULT now(),
			deleted_at timestamptz
		);
	END IF;
END $$`,
		`DO $$
BEGIN
	IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'gizi_ibu') THEN
		CREATE TABLE public.gizi_ibu (
			id varchar(36) PRIMARY KEY,
			admin_id varchar(36) REFERENCES public.pengguna(id) ON DELETE RESTRICT,
			slug text NOT NULL UNIQUE,
			judul text NOT NULL,
			ringkasan text,
			isi text,
			kategori text,
			phase text,
			tags text,
			gambar_url text,
			read_minutes integer DEFAULT 5,
			is_published boolean DEFAULT true,
			created_at timestamptz DEFAULT now(),
			updated_at timestamptz DEFAULT now(),
			deleted_at timestamptz
		);
	END IF;
END $$`,
		`DO $$
BEGIN
	IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'gizi_anak') THEN
		CREATE TABLE public.gizi_anak (
			id varchar(36) PRIMARY KEY,
			admin_id varchar(36) REFERENCES public.pengguna(id) ON DELETE RESTRICT,
			slug text NOT NULL UNIQUE,
			judul text NOT NULL,
			ringkasan text,
			isi text,
			kategori text,
			phase text,
			tags text,
			gambar_url text,
			read_minutes integer DEFAULT 5,
			is_published boolean DEFAULT true,
			created_at timestamptz DEFAULT now(),
			updated_at timestamptz DEFAULT now(),
			deleted_at timestamptz
		);
	END IF;
END $$`,
		`DO $$
BEGIN
	IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'mpasi') THEN
		CREATE TABLE public.mpasi (
			id varchar(36) PRIMARY KEY,
			admin_id varchar(36) REFERENCES public.pengguna(id) ON DELETE RESTRICT,
			slug text NOT NULL UNIQUE,
			judul text NOT NULL,
			ringkasan text,
			isi text,
			kategori text,
			phase text,
			tags text,
			gambar_url text,
			read_minutes integer DEFAULT 5,
			is_published boolean DEFAULT true,
			created_at timestamptz DEFAULT now(),
			updated_at timestamptz DEFAULT now(),
			deleted_at timestamptz
		);
	END IF;
END $$`,
		`DO $$
BEGIN
	IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'informasi_umum') THEN
		CREATE TABLE public.informasi_umum (
			id varchar(36) PRIMARY KEY,
			admin_id varchar(36) REFERENCES public.pengguna(id) ON DELETE RESTRICT,
			slug text NOT NULL UNIQUE,
			judul text NOT NULL,
			ringkasan text,
			isi text,
			kategori text,
			phase text,
			tags text,
			gambar_url text,
			read_minutes integer DEFAULT 5,
			is_published boolean DEFAULT true,
			created_at timestamptz DEFAULT now(),
			updated_at timestamptz DEFAULT now(),
			deleted_at timestamptz
		);
	END IF;
END $$`,
		`DO $$
BEGIN
	IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'mental_orang_tua') THEN
		CREATE TABLE public.mental_orang_tua (
			id varchar(36) PRIMARY KEY,
			admin_id varchar(36) REFERENCES public.pengguna(id) ON DELETE RESTRICT,
			slug text NOT NULL UNIQUE,
			judul text NOT NULL,
			ringkasan text,
			isi text,
			kategori text,
			phase text,
			tags text,
			gambar_url text,
			read_minutes integer DEFAULT 5,
			is_published boolean DEFAULT true,
			created_at timestamptz DEFAULT now(),
			updated_at timestamptz DEFAULT now(),
			deleted_at timestamptz
		);
	END IF;
END $$`,
		`DO $$
BEGIN
	IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'pola_asuh') THEN
		CREATE TABLE public.pola_asuh (
			id varchar(36) PRIMARY KEY,
			admin_id varchar(36) REFERENCES public.pengguna(id) ON DELETE RESTRICT,
			slug text NOT NULL UNIQUE,
			judul text NOT NULL,
			ringkasan text,
			isi text,
			kategori text,
			phase text,
			langkah_praktis text,
			gambar_url text,
			read_minutes integer DEFAULT 5,
			is_published boolean DEFAULT true,
			created_at timestamptz DEFAULT now(),
			updated_at timestamptz DEFAULT now(),
			deleted_at timestamptz
		);
	END IF;
END $$`,
	}

	for _, sql := range statements {
		if err := db.Exec(sql).Error; err != nil {
			log.Printf("Migrasi fitur konten warning: %v", err)
		}
	}

	var adminID string
	if err := db.Table("pengguna").Select("id").Where("role = ?", "admin").Order("created_at ASC").Limit(1).Scan(&adminID).Error; err != nil {
		log.Printf("Migrasi fitur konten warning: gagal mengambil admin default: %v", err)
	}
	if adminID == "" {
		return
	}

	type migrationMapping struct {
		tableName string
		kategori  string
	}
	mappings := []migrationMapping{
		{tableName: "stimulus_anak", kategori: "parenting"},
		{tableName: "gizi_ibu", kategori: "gizi ibu"},
		{tableName: "gizi_anak", kategori: "gizi anak"},
		{tableName: "mpasi", kategori: "mpasi"},
		{tableName: "informasi_umum", kategori: "umum"},
		{tableName: "informasi_umum", kategori: "phbs"},
		{tableName: "mental_orang_tua", kategori: "mental orang tua"},
	}

	for _, m := range mappings {
		sql := `INSERT INTO public.` + m.tableName + ` (id, admin_id, slug, judul, ringkasan, isi, kategori, phase, tags, gambar_url, read_minutes, is_published, created_at, updated_at, deleted_at)
SELECT id, ` + "'" + adminID + "'" + `, slug, judul, ringkasan, isi, kategori, phase, tags, gambar_url, COALESCE(read_minutes, 5), COALESCE(is_published, true), created_at, updated_at, deleted_at
FROM public.contents
WHERE LOWER(kategori) = LOWER(` + "'" + m.kategori + "'" + `)
ON CONFLICT (slug) DO NOTHING`
		if err := db.Exec(sql).Error; err != nil {
			log.Printf("Migrasi fitur konten warning: backfill %s gagal: %v", m.tableName, err)
		}
	}
}

func (m *Main) Init() (err error) {
	viper.SetConfigFile(".env")
	err = viper.ReadInConfig()
	if err != nil {
		return
	}
	m.cfg = config.NewConfig()

	e := echo.New()
	e.HideBanner = true
	e.Validator = &helpers.CustomValidator{Validator: validator.New()}

	e.Use(echoMiddleware.Logger())
	e.Use(echoMiddleware.Recover())
	e.Use(echoMiddleware.CORSWithConfig(echoMiddleware.CORSConfig{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{echo.GET, echo.POST, echo.PUT, echo.DELETE, echo.OPTIONS},
		AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept, echo.HeaderAuthorization},
	}))
	// Rate limiting: 20 request per second per IP
	e.Use(echoMiddleware.RateLimiter(echoMiddleware.NewRateLimiterMemoryStore(rate.Limit(20))))

	// GORM config: PrepareStmt=false wajib untuk Supabase Transaction Pooler (port 6543)
	gormCfg := &gorm.Config{
		PrepareStmt: false,
		Logger:      logger.Default.LogMode(logger.Info),
	}

	// Prioritaskan DATABASE_URL (Supabase), fallback ke config individual
	if m.cfg.DatabaseURL != "" {
		log.Println("Menghubungkan ke Supabase via DATABASE_URL...")
		m.db, err = gorm.Open(postgres.New(postgres.Config{
			DSN:                  m.cfg.DatabaseURL,
			PreferSimpleProtocol: true,
		}), gormCfg)
	} else {
		m.db, err = database.GetConnection(m.cfg.Postgres().Read.ToArgs(database.Postgres, database.ReadConn, nil))
	}
	if err != nil {
		log.Printf("GAGAL koneksi database: %v", err)
		return
	}
	log.Println("Koneksi database berhasil!")
	runPenggunaEmailMigration(m.db)
	runFeatureContentMigration(m.db)

	// Auto migrate semua tabel (buat jika belum ada)
	log.Println("Menjalankan auto migrate...")
	err = m.db.AutoMigrate(
		&models.Pengguna{},
		&models.Anak{},
		&models.Content{},
		&models.Quiz{},
		&models.QuizQuestion{},
		&models.QuizOption{},
		&models.QuizAttempt{},
		&models.QuizAttemptAnswer{},
		&models.ResepGiziDB{},
		&models.PolaAsuh{},
	)
	if err != nil {
		log.Printf("AutoMigrate warning: %v", err)
		err = nil // jangan fatal, tabel mungkin sudah dibuat manual via SQL Editor
	}

	// Seed akun admin default
	seed.SeedAdmin(m.db)

	m.repo = repositories.Init(repositories.Options{
		Config:   m.cfg,
		Postgres: m.db,
	})
	m.usecase = usecases.Init(usecases.Options{
		Config:     m.cfg,
		Repository: m.repo,
	})
	m.controller = controllers.Init(controllers.Options{
		Config:   m.cfg,
		UseCases: m.usecase,
		Repo:     m.repo,
		DB:       m.db,
	})

	jwtMw := appMiddleware.JWTMiddleware(m.usecase.Auth)

	m.router = e
	routes.ConfigureRouter(e, m.controller, jwtMw)
	return nil
}

func (m *Main) Run() error {
	port := m.cfg.ServicePort
	if port == "" {
		port = "8081"
	}

	startPort, err := strconv.Atoi(port)
	if err != nil || startPort <= 0 {
		startPort = 8081
	}

	var lastErr error
	for offset := 0; offset < 10; offset++ {
		currentPort := strconv.Itoa(startPort + offset)
		listener, err := net.Listen("tcp", ":"+currentPort)
		if err != nil {
			if isAddressInUse(err) {
				lastErr = err
				continue
			}
			return err
		}

		log.Printf("Menjalankan SEJIWA Backend di port %s", currentPort)
		m.router.Listener = listener
		m.router.Server.Addr = ":" + currentPort
		err = m.router.StartServer(m.router.Server)
		_ = m.router.Close()
		return err
	}

	if lastErr != nil {
		return fmt.Errorf("gagal bind port mulai %d: %w", startPort, lastErr)
	}

	return fmt.Errorf("tidak ada port tersedia mulai %d", startPort)
}

func isAddressInUse(err error) bool {
	msg := strings.ToLower(err.Error())
	return strings.Contains(msg, "address already in use") || strings.Contains(msg, "only one usage of each socket address")
}
