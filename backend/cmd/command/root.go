package command

import (
	"log"

	"github.com/spf13/cobra"

	application "sejiwa-backend/app"
)

func init() {
	log.SetFlags(log.LstdFlags | log.Lmicroseconds | log.Llongfile)
}

var cmdRoot = &cobra.Command{
	Use:   "sejiwa-backend",
	Short: "SEJIWA – Sistem Imunisasi Ibu dan Anak, Desa Hutabulu Mejan.",
	Long:  `SEJIWA Backend API – mengelola data pengguna, anak, jadwal imunisasi KIA 2024, dan riwayat imunisasi.`,
	Run: func(cmd *cobra.Command, args []string) {
		app := application.New()
		err := app.Init()
		if err != nil {
			log.Fatalf("Error in initializing the application: %+v", err)
			return
		}

		err = app.Run()
		if err != nil {
			log.Fatalf("Error in running the application: %+v", err)
			return
		}
	},
}

func Execute() {
	if err := cmdRoot.Execute(); err != nil {
		log.Fatalf("Error in executing the root command: %+v", err)
	}
}
