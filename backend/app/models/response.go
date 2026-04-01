package models

type Response struct {
	Error      bool        `json:"error"`
	StatusCode int         `json:"status_code"`
	Message    interface{} `json:"message,omitempty"`
	Data       interface{} `json:"data,omitempty"`
	Details    interface{} `json:"details,omitempty"`
}

type BasicResponse struct {
	Error      bool        `json:"error"`
	StatusCode int         `json:"status_code"`
	Message    interface{} `json:"message,omitempty"`
	Details    interface{} `json:"details,omitempty"`
}

type ResponseWithPaginate struct {
	Error      bool        `json:"error"`
	StatusCode int         `json:"status_code"`
	Message    interface{} `json:"message,omitempty"`
	Data       interface{} `json:"data,omitempty"`
	Details    interface{} `json:"details,omitempty"`
	Pagination *Pagination `json:"pagination,omitempty"`
}

type Pagination struct {
	Page      int `json:"page,omitempty"`
	PageSize  int `json:"page_size,omitempty"`
	Total     int `json:"total,omitempty"`
	TotalPage int `json:"total_page,omitempty"`
}
