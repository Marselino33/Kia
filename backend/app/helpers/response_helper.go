package helpers

import (
	"sejiwa-backend/app/models"

	"github.com/labstack/echo/v4"
)

func ResponseWrapper(c echo.Context, statusCode int, response interface{}) error {
	return c.JSON(statusCode, response)
}

func StandardResponse(c echo.Context, statusCode int, message interface{}, data interface{}, pagination *models.Pagination) error {
	isError := statusCode >= 400
	var details interface{} = nil

	if isError {
		details = data
		data = nil
	}

	switch {
	case pagination == nil:
		return ResponseWrapper(c, statusCode, models.Response{
			Error:      isError,
			StatusCode: statusCode,
			Message:    message,
			Data:       data,
			Details:    details,
		})
	default:
		return ResponseWrapper(c, statusCode, models.ResponseWithPaginate{
			Error:      isError,
			StatusCode: statusCode,
			Message:    message,
			Data:       data,
			Details:    details,
			Pagination: pagination,
		})
	}
}

func Response(c echo.Context, statusCode int, message []string) error {
	isError := statusCode >= 400
	return ResponseWrapper(c, statusCode, models.BasicResponse{
		Error:      isError,
		StatusCode: statusCode,
		Message:    message,
	})
}
