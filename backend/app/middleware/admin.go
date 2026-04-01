package middleware

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

// AdminMiddleware memastikan pengguna yang sedang login memiliki role "admin".
// Middleware ini harus digunakan SETELAH JWTMiddleware.
func AdminMiddleware() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			role := GetRole(c)
			if role != "admin" {
				return c.JSON(http.StatusForbidden, map[string]interface{}{
					"status_code": http.StatusForbidden,
					"message":     "akses ditolak: hanya admin yang diizinkan",
				})
			}
			return next(c)
		}
	}
}
