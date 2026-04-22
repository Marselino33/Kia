@echo off
REM ============================================================
REM Training Script for Mental Health Model (v2 - 3-Class)
REM Requirements: Python 3.8+, scikit-learn, pandas, joblib
REM ============================================================

echo.
echo ============================================================
echo  Mental Health Model Training (v2 - 3-Class)
echo ============================================================
echo.

REM Check Python availability
where python >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python not found in PATH.
    echo Please install Python 3.8+ from python.org
    echo or run: winget install Python.Python.3.12
    pause
    exit /b 1
)

REM Check if dataset exists
if not exist "dataset_klasifikasi.csv" (
    echo [ERROR] dataset_klasifikasi.csv not found in current directory!
    echo Please run this script from the ml/ folder.
    pause
    exit /b 1
)

REM Install dependencies if not present
echo [1/3] Checking Python dependencies...
python -c "import sklearn, pandas, joblib" >nul 2>&1
if errorlevel 1 (
    echo Installing required packages...
    pip install -r requirements.txt
    if errorlevel 1 (
        echo [ERROR] Failed to install packages. Check pip output above.
        pause
        exit /b 1
    )
    echo Dependencies installed.
) else (
    echo Dependencies OK.
)

REM Run training
echo.
echo [2/3] Starting training...
echo This may take 1-2 minutes...
echo.

python train_rf_model.py

if errorlevel 1 (
    echo.
    echo [ERROR] Training failed! Check error messages above.
    pause
    exit /b 1
)

REM Verify model file created
echo.
echo [3/3] Verifying model artifact...
if exist "pss10_rf_model_v2.pkl" (
    echo SUCCESS: Model saved as pss10_rf_model_v2.pkl
    echo.
    echo ============================================================
    echo Next steps:
    echo   1. Start ML service: uvicorn mental_health_api:app --port 8000
    echo   2. Test: curl http://localhost:8000/health
    echo   3. Deploy with Docker: docker build -t kia-mental-health .
    echo ============================================================
) else (
    echo [ERROR] Model file not created!
    echo Check training output for errors.
)

echo.
pause
