# ============================================================
#  SEJIWA Backend – Makefile
#  Sistem Imunisasi Ibu dan Anak | Desa Hutabulu Mejan
# ============================================================

APP_NAME   = sejiwa-backend
MAIN       = ./cmd/main.go
BUILD_DIR  = ./bin
BINARY     = $(BUILD_DIR)/$(APP_NAME)

# ── Local development ───────────────────────────────────────
.PHONY: run
run:
	go run $(MAIN)

.PHONY: build
build:
	@mkdir -p $(BUILD_DIR)
	go build -ldflags="-w -s" -o $(BINARY) $(MAIN)
	@echo "✅ Binary: $(BINARY)"

.PHONY: clean
clean:
	rm -rf $(BUILD_DIR)

# ── Dependencies ────────────────────────────────────────────
.PHONY: tidy
tidy:
	go mod tidy

.PHONY: deps
deps:
	go mod download

# ── Code quality ────────────────────────────────────────────
.PHONY: lint
lint:
	golangci-lint run ./...

.PHONY: fmt
fmt:
	gofmt -w .

.PHONY: vet
vet:
	go vet ./...

# ── Testing ─────────────────────────────────────────────────
.PHONY: test
test:
	go test ./... -v -cover

.PHONY: test-short
test-short:
	go test ./... -short

# ── Swagger docs ────────────────────────────────────────────
.PHONY: swagger
swagger:
	swag init -g cmd/main.go --output docs

# ── Docker ──────────────────────────────────────────────────
.PHONY: docker-up
docker-up:
	docker-compose up -d

.PHONY: docker-down
docker-down:
	docker-compose down

.PHONY: docker-logs
docker-logs:
	docker-compose logs -f api

.PHONY: docker-build
docker-build:
	docker-compose build --no-cache

.PHONY: docker-restart
docker-restart: docker-down docker-up

# ── Database ────────────────────────────────────────────────
# Tabel dibuat otomatis oleh GORM AutoMigrate saat app start.
# Target ini untuk reset data development saja.
.PHONY: db-reset
db-reset:
	docker-compose exec postgres psql -U sejiwa_user -d sejiwa_db \
	  -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
	@echo "⚠️  Database direset. Jalankan 'make run' untuk re-migrate & seed."

# ── Quick start ─────────────────────────────────────────────
.PHONY: setup
setup: deps
	@cp -n .env.example .env 2>/dev/null || true
	@echo "✅ Salin .env.example → .env selesai. Edit .env sesuai kebutuhan."

.PHONY: all
all: tidy vet build
