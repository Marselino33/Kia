package routes

import (
	"sejiwa-backend/app/controllers"
	appMiddleware "sejiwa-backend/app/middleware"

	"github.com/labstack/echo/v4"
	echoSwagger "github.com/swaggo/echo-swagger"
)

// ConfigureRouter mendaftarkan semua endpoint API SEJIWA.
//
// Base path: /api/v1
// Public   : /auth/*, /content/*, /gizi/resep/*, /mental-health/predict
// Protected: /anak/*, /profile, /bookmarks, /quizzes/attempt, /gizi/*
// Admin    : /admin/* (JWT + role=admin)
func ConfigureRouter(e *echo.Echo, ctrl *controllers.Main, jwtMiddleware echo.MiddlewareFunc) {
	// Swagger UI (development)
	e.GET("/swagger/*", echoSwagger.WrapHandler)

	api := e.Group("/api/v1")

	// ─── Public routes ────────────────────────────────────────────────────────
	auth := api.Group("/auth")
	auth.POST("/register", ctrl.Auth.Register)
	auth.POST("/login", ctrl.Auth.Login)
	auth.POST("/refresh", ctrl.Auth.RefreshToken)

	// Content
	api.GET("/content", ctrl.Master.ListContent)
	api.GET("/content/:slug", ctrl.Master.GetContentBySlug)

	// Parenting / Stimulus Anak / Pola Asuh
	api.GET("/parenting", ctrl.Master.ListParenting)
	api.GET("/parenting/:slug", ctrl.Master.GetParentingBySlug)
	api.GET("/pola-asuh", ctrl.Master.ListPolaAsuh)
	api.GET("/pola-asuh/:slug", ctrl.Master.GetPolaAsuhBySlug)

	// Mental Orang Tua
	api.GET("/mental-orang-tua", ctrl.Master.ListMentalOrangTua)
	api.GET("/mental-orang-tua/:slug", ctrl.Master.GetMentalOrangTuaBySlug)

	// ─── Protected routes (Bearer JWT) ────────────────────────────────────────
	protected := api.Group("", jwtMiddleware)

	// profile & bookmarks (backend stubs)
	protected.GET("/profile", ctrl.Master.GetProfile)
	protected.PUT("/profile", ctrl.Master.UpdateProfile)
	protected.GET("/bookmarks", ctrl.Master.ListBookmarks)
	protected.POST("/bookmarks", ctrl.Master.AddBookmark)
	protected.DELETE("/bookmarks/:id", ctrl.Master.RemoveBookmark)
	protected.GET("/bookmarks/:slug", ctrl.Master.CheckBookmark)
	protected.POST("/quizzes/attempt", ctrl.Master.RecordQuizAttempt)
	protected.GET("/quizzes/history", ctrl.Master.ListQuizAttemptHistory)

	// CRUD Anak
	protected.GET("/anak", ctrl.Anak.List)
	protected.POST("/anak", ctrl.Anak.Create)
	protected.GET("/anak/:id", ctrl.Anak.Detail)
	protected.PUT("/anak/:id", ctrl.Anak.Update)
	protected.DELETE("/anak/:id", ctrl.Anak.Delete)

	// ─── Gizi & Menu ──────────────────────────────────────────────────────────
	// Public: list & detail resep
	api.GET("/gizi/resep", ctrl.Gizi.ListResep)
	api.GET("/gizi/resep/:slug", ctrl.Gizi.GetResepBySlug)
	api.POST("/mental-health/predict", ctrl.Mental.Predict)

	// Protected: jadwal makan & favorit
	protected.GET("/gizi/jadwal", ctrl.Gizi.ListJadwal)
	protected.POST("/gizi/jadwal", ctrl.Gizi.AddJadwal)
	protected.POST("/gizi/resep/:id/favorit", ctrl.Gizi.ToggleFavorit)

	// ─── Admin routes (JWT + role=admin) ──────────────────────────────────────
	admin := api.Group("/admin", jwtMiddleware, appMiddleware.AdminMiddleware())

	// Dashboard stats
	admin.GET("/dashboard", ctrl.Admin.Dashboard)

	// Pengguna CRUD
	admin.GET("/pengguna", ctrl.Admin.ListPengguna)
	admin.POST("/pengguna", ctrl.Admin.CreatePengguna)
	admin.GET("/pengguna/:id", ctrl.Admin.GetPengguna)
	admin.PUT("/pengguna/:id", ctrl.Admin.UpdatePengguna)
	admin.DELETE("/pengguna/:id", ctrl.Admin.DeletePengguna)

	// Anak CRUD
	admin.GET("/anak", ctrl.Admin.ListAnak)
	admin.POST("/anak", ctrl.Admin.CreateAnak)
	admin.GET("/anak/:id", ctrl.Admin.GetAnak)
	admin.PUT("/anak/:id", ctrl.Admin.UpdateAnak)
	admin.DELETE("/anak/:id", ctrl.Admin.DeleteAnak)

	// Content (Artikel) CRUD
	admin.GET("/content", ctrl.Admin.ListContent)
	admin.POST("/content", ctrl.Admin.CreateContent)
	admin.GET("/content/:id", ctrl.Admin.GetContent)
	admin.PUT("/content/:id", ctrl.Admin.UpdateContent)
	admin.DELETE("/content/:id", ctrl.Admin.DeleteContent)

	// Pola Asuh CRUD (tabel khusus)
	admin.GET("/pola-asuh", ctrl.Admin.ListPolaAsuh)
	admin.POST("/pola-asuh", ctrl.Admin.CreatePolaAsuh)
	admin.GET("/pola-asuh/:id", ctrl.Admin.GetPolaAsuh)
	admin.PUT("/pola-asuh/:id", ctrl.Admin.UpdatePolaAsuh)
	admin.DELETE("/pola-asuh/:id", ctrl.Admin.DeletePolaAsuh)

	// Resep Gizi CRUD
	admin.GET("/resep-gizi", ctrl.Admin.ListResepAdmin)
	admin.POST("/resep-gizi", ctrl.Admin.CreateResep)
	admin.GET("/resep-gizi/:id", ctrl.Admin.GetResepAdmin)
	admin.PUT("/resep-gizi/:id", ctrl.Admin.UpdateResep)
	admin.DELETE("/resep-gizi/:id", ctrl.Admin.DeleteResep)

	// Quiz CRUD
	admin.GET("/quiz", ctrl.Admin.ListQuiz)
	admin.POST("/quiz", ctrl.Admin.CreateQuiz)
	admin.GET("/quiz/:id", ctrl.Admin.GetQuiz)
	admin.PUT("/quiz/:id", ctrl.Admin.UpdateQuiz)
	admin.DELETE("/quiz/:id", ctrl.Admin.DeleteQuiz)

	// Quiz Questions sub-resource
	admin.POST("/quiz/:id/questions", ctrl.Admin.CreateQuestion)
	admin.DELETE("/quiz/:id/questions/:qid", ctrl.Admin.DeleteQuestion)
}
