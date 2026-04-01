package app

import (
	"log"

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
		m.db, err = gorm.Open(postgres.Open(m.cfg.DatabaseURL), gormCfg)
	} else {
		m.db, err = database.GetConnection(m.cfg.Postgres().Read.ToArgs(database.Postgres, database.ReadConn, nil))
	}
	if err != nil {
		log.Printf("GAGAL koneksi database: %v", err)
		return
	}
	log.Println("Koneksi database berhasil!")

	// Auto migrate semua tabel (buat jika belum ada)
	log.Println("Menjalankan auto migrate...")
	err = m.db.AutoMigrate(
		&models.Pengguna{},
		&models.Anak{},
		&models.MasterVaksin{},
		&models.RiwayatImunisasi{},
		&models.Content{},
		&models.Quiz{},
		&models.QuizQuestion{},
		&models.QuizAttempt{},
		&models.ResepGiziDB{},
	)
	if err != nil {
		log.Printf("AutoMigrate warning: %v", err)
		err = nil // jangan fatal, tabel mungkin sudah dibuat manual via SQL Editor
	}

	// Seed 26 vaksin KIA 2024 jika tabel kosong
	if err2 := seed.SeedMasterVaksin(m.db); err2 != nil {
		log.Printf("Seed warning: %v", err2)
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

	log.Printf("Menjalankan SEJIWA Backend di port %s", port)

	err := m.router.Start(":" + port)
	m.router.Close()
	return err
}
