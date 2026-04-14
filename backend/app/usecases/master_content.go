package usecases

// MasterContentUseCase menyimpan usecase umum non-imunisasi.
// Saat ini dipertahankan sebagai placeholder agar wiring controller tetap konsisten.
type MasterContentUseCase struct{}

func NewMasterContentUseCase() *MasterContentUseCase {
	return &MasterContentUseCase{}
}
