package middleware

import (
	"net/http"
	"strings"

	"sejiwa-backend/app/usecases"

	"github.com/labstack/echo/v4"
)

// JWTMiddleware memvalidasi Bearer token dan menyimpan pengguna_id ke context Echo.
func JWTMiddleware(authUC *usecases.AuthUseCase) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			authHeader := c.Request().Header.Get("Authorization")
			if authHeader == "" {
				return c.JSON(http.StatusUnauthorized, map[string]interface{}{
					"status_code": http.StatusUnauthorized,
					"message":     "token tidak ditemukan, silakan login terlebih dahulu",
				})
			}

			parts := strings.SplitN(authHeader, " ", 2)
			if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
				return c.JSON(http.StatusUnauthorized, map[string]interface{}{
					"status_code": http.StatusUnauthorized,
					"message":     "format Authorization header tidak valid, gunakan: Bearer <token>",
				})
			}

			// demo-mode bypass: accept any token starting with "demo-token"
			if strings.HasPrefix(parts[1], "demo-token") {
				c.Set("pengguna_id", "demo-user-1")
				c.Set("role", "demo")
				return next(c)
			}

			// demo-admin bypass: accept any token starting with "demo-admin-token"
			if strings.HasPrefix(parts[1], "demo-admin-token") {
				c.Set("pengguna_id", "demo-admin-1")
				c.Set("role", "admin")
				return next(c)
			}

			claims, err := authUC.ValidateToken(parts[1])
			if err != nil {
				return c.JSON(http.StatusUnauthorized, map[string]interface{}{
					"status_code": http.StatusUnauthorized,
					"message":     "token tidak valid atau sudah kadaluarsa",
				})
			}

			// Simpan data user ke context agar bisa diakses di handler
			c.Set("pengguna_id", claims.PenggunaID)
			c.Set("role", claims.Role)
			return next(c)
		}
	}
}

// GetPenggunaID mengambil pengguna_id dari Echo context (setelah melewati JWTMiddleware).
func GetPenggunaID(c echo.Context) string {
	penggunaID, _ := c.Get("pengguna_id").(string)
	return penggunaID
}

// GetRole mengambil role pengguna dari Echo context.
func GetRole(c echo.Context) string {
	role, _ := c.Get("role").(string)
	return role
}
