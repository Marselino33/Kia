package usecases

import (
	"errors"
	"time"

	"sejiwa-backend/app/models"
	"sejiwa-backend/app/repositories"

	"github.com/golang-jwt/jwt/v4"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// AuthUseCase menangani logika autentikasi (register, login, refresh token).
type AuthUseCase struct {
	penggunaRepo *repositories.PenggunaRepository
	jwtSecret    string
}

// AuthClaims adalah custom JWT claims untuk SEJIWA.
type AuthClaims struct {
	PenggunaID string `json:"pengguna_id"`
	Role       string `json:"role"`
	jwt.RegisteredClaims
}

func NewAuthUseCase(penggunaRepo *repositories.PenggunaRepository, jwtSecret string) *AuthUseCase {
	if jwtSecret == "" {
		jwtSecret = "sejiwa-rahasia-default-ganti-di-env"
	}
	return &AuthUseCase{
		penggunaRepo: penggunaRepo,
		jwtSecret:    jwtSecret,
	}
}

// Register mendaftarkan pengguna baru dan mengembalikan token pair.
func (u *AuthUseCase) Register(req models.RegisterRequest) (*models.AuthResponse, error) {
	// Cek email sudah terdaftar
	existing, err := u.penggunaRepo.FindByEmail(req.Email)
	if existing != nil {
		return nil, errors.New("email sudah terdaftar")
	}
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, err
	}

	// Hash password dengan bcrypt
	pinHash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	desa := req.Desa
	if desa == "" {
		desa = "Hutabulu Mejan"
	}

	pengguna := &models.Pengguna{
		Nama:    req.Nama,
		Email:   req.Email,
		PasswordHash: string(pinHash),
		Role:    req.Role,
		Desa:    desa,
	}

	if err := u.penggunaRepo.Create(pengguna); err != nil {
		return nil, err
	}

	return u.buildAuthResponse(pengguna)
}

// Login memvalidasi email + password dan mengembalikan token pair.
func (u *AuthUseCase) Login(req models.LoginRequest) (*models.AuthResponse, error) {
	pengguna, err := u.penggunaRepo.FindByEmail(req.Email)
	if err != nil {
		return nil, errors.New("email atau password salah")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(pengguna.PasswordHash), []byte(req.Password)); err != nil {
		return nil, errors.New("email atau password salah")
	}

	return u.buildAuthResponse(pengguna)
}

// RefreshToken menghasilkan access token baru dari refresh token yang valid.
func (u *AuthUseCase) RefreshToken(refreshToken string) (*models.AuthResponse, error) {
	claims, err := u.ValidateToken(refreshToken)
	if err != nil {
		return nil, errors.New("refresh token tidak valid atau sudah kadaluarsa")
	}

	pengguna, err := u.penggunaRepo.FindByID(claims.PenggunaID)
	if err != nil {
		return nil, errors.New("pengguna tidak ditemukan")
	}

	return u.buildAuthResponse(pengguna)
}

// ValidateToken memvalidasi JWT dan mengembalikan claims-nya.
func (u *AuthUseCase) ValidateToken(tokenStr string) (*AuthClaims, error) {
	token, err := jwt.ParseWithClaims(tokenStr, &AuthClaims{}, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("metode signing tidak valid")
		}
		return []byte(u.jwtSecret), nil
	})
	if err != nil {
		return nil, err
	}

	claims, ok := token.Claims.(*AuthClaims)
	if !ok || !token.Valid {
		return nil, errors.New("token tidak valid")
	}
	return claims, nil
}

// buildAuthResponse membuat pasangan access + refresh token untuk pengguna.
func (u *AuthUseCase) buildAuthResponse(pengguna *models.Pengguna) (*models.AuthResponse, error) {
	// Access token: berlaku 15 menit
	accessToken, err := u.signToken(pengguna, 15*time.Minute)
	if err != nil {
		return nil, err
	}

	// Refresh token: berlaku 7 hari
	refreshToken, err := u.signToken(pengguna, 7*24*time.Hour)
	if err != nil {
		return nil, err
	}

	return &models.AuthResponse{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		Pengguna: models.PenggunaPublic{
			ID:    pengguna.ID,
			Nama:  pengguna.Nama,
			Role:  pengguna.Role,
			Email: pengguna.Email,
			Desa:  pengguna.Desa,
		},
	}, nil
}

func (u *AuthUseCase) signToken(pengguna *models.Pengguna, duration time.Duration) (string, error) {
	claims := AuthClaims{
		PenggunaID: pengguna.ID,
		Role:       pengguna.Role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(duration)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Subject:   pengguna.ID,
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(u.jwtSecret))
}
