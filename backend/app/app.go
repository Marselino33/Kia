package app

import (
	"fmt"
	"log"
	"net/http"

	"kia/app/controllers"
	"kia/app/helpers"
	appMiddleware "kia/app/middleware"
	"kia/app/models"
	"kia/app/repositories"
	"kia/app/routes"
	"kia/app/seed"
	"kia/app/usecases"
	"kia/pkg/config"

	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
	echoMiddleware "github.com/labstack/echo/v4/middleware"
	"github.com/spf13/viper"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	_ "kia/docs"
)

type App struct {
	echo          *echo.Echo
	config        *config.Config
	db            *gorm.DB
	controllers   *controllers.Main
	jwtMiddleware echo.MiddlewareFunc
}

func New() *App {
	return &App{echo: echo.New()}
}

func (a *App) Init() error {
	loadEnv()

	a.config = config.NewConfig()

	db, err := openDatabase(a.config)
	if err != nil {
		log.Printf("warning: database unavailable, starting degraded mode: %v", err)
		a.setupHTTP()
		a.initDegradedMode()
		return nil
	}
	a.db = db

	if err := a.migrate(); err != nil {
		log.Printf("warning: database migrate skipped due to error: %v", err)
	}

	repo := repositories.Init(repositories.Options{Postgres: a.db, Config: a.config})
	uc := usecases.Init(usecases.Options{Repository: repo, Config: a.config})
	a.controllers = controllers.Init(controllers.Options{Config: a.config, UseCases: uc, Repo: repo, DB: a.db})
	a.jwtMiddleware = appMiddleware.JWTMiddleware(uc.Auth)

	a.seedInitialData()
	a.setupHTTP()
	routes.ConfigureRouter(a.echo, a.controllers, a.jwtMiddleware)

	return nil
}

func (a *App) initDegradedMode() {
	mental := controllers.NewMentalHealthController(a.config)

	a.echo.GET("/health", func(c echo.Context) error {
		return c.JSON(http.StatusOK, map[string]interface{}{
			"status":   "degraded",
			"database": "unavailable",
			"service":  "backend",
		})
	})

	api := a.echo.Group("/api/v1")
	api.POST("/mental-health/predict", mental.Predict)
}

func (a *App) Run() error {
	port := a.config.ServicePort
	if port == "" {
		port = "8081"
	}

	addr := ":" + port
	log.Printf("server running on %s", addr)
	return a.echo.Start(addr)
}

func (a *App) setupHTTP() {
	a.echo.HideBanner = true
	a.echo.Validator = &helpers.CustomValidator{Validator: validator.New()}

	a.echo.Use(echoMiddleware.Recover())
	a.echo.Use(echoMiddleware.RequestID())
	a.echo.Use(echoMiddleware.CORSWithConfig(echoMiddleware.CORSConfig{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{echo.GET, echo.POST, echo.PUT, echo.PATCH, echo.DELETE, echo.OPTIONS},
		AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept, echo.HeaderAuthorization},
	}))
}

func (a *App) migrate() error {
	return a.db.AutoMigrate(
		&models.Pengguna{},
		&models.Anak{},
		&models.Content{},
		&models.PolaAsuh{},
		&models.StimulusAnakV2{},
		&models.ResepGiziDB{},
		&models.Quiz{},
		&models.QuizQuestion{},
		&models.QuizOption{},
		&models.QuizAttempt{},
		&models.QuizAttemptAnswer{},
		&models.MentalHealthQuestion{},
		&models.ParentingQuizQuestion{},
	)
}

func (a *App) seedInitialData() {
	admin := seed.SeedAdmin(a.db)
	if admin == nil {
		return
	}

	seed.SeedFeatureContentDummies(a.db, admin.ID)
	seed.SeedQuizDummies(a.db)
}

func loadEnv() {
	viper.SetConfigFile(".env")
	viper.SetConfigType("env")
	viper.AutomaticEnv()
	_ = viper.ReadInConfig()
}

func openDatabase(cfg *config.Config) (*gorm.DB, error) {
	if cfg.DatabaseURL != "" {
		return gorm.Open(postgres.New(postgres.Config{
			DSN:                  cfg.DatabaseURL,
			PreferSimpleProtocol: true,
		}), &gorm.Config{})
	}

	pg := cfg.Postgres()
	write := pg.Write

	dsn := fmt.Sprintf(
		"host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
		write.URL,
		write.Port,
		write.Username,
		write.Password,
		write.Name,
	)

	return gorm.Open(postgres.New(postgres.Config{
		DSN:                  dsn,
		PreferSimpleProtocol: true,
	}), &gorm.Config{})
}
