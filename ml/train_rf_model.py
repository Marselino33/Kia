import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, GridSearchCV, StratifiedKFold
from sklearn.metrics import classification_report, accuracy_score, f1_score
import joblib
import warnings

warnings.filterwarnings("ignore")

# ── Configuration ─────────────────────────────────────────────────────────────
SEED = 42
LABEL_MAP = {"RENDAH": 0, "SEDANG": 1, "TINGGI": 2}
LABEL_INV = {v: k for k, v in LABEL_MAP.items()}
REVERSED_IDX = {5, 6, 7, 8, 9}  # 0-based indices for Q6-10

# ── Load Dataset ───────────────────────────────────────────────────────────────
# Use the available dataset file
CSV_PATH = "dataset_klasifikasi.csv"
df = pd.read_csv(CSV_PATH)

print("Dataset loaded successfully")
print(f"Shape: {df.shape}")
print(f"Columns: {list(df.columns)}\n")

# ── Feature Engineering ────────────────────────────────────────────────────────
# The dataset already has q*_adj columns, but we'll compute them to be sure
FEATURE_COLS = [f"q{i + 1}_adj" for i in range(10)]

# If dataset doesn't have adj columns, compute from raw
if "q1_adj" not in df.columns:
    print("Computing adjusted scores from raw answers...")
    raw_cols = [f"q{i + 1}_raw" for i in range(10)]
    for i in range(10):
        raw_col = f"q{i + 1}_raw"
        adj_col = f"q{i + 1}_adj"
        if i in REVERSED_IDX:
            df[adj_col] = 4 - df[raw_col]
        else:
            df[adj_col] = df[raw_col]
else:
    print("Using existing adjusted score columns.\n")

X = df[FEATURE_COLS].values
y = df["label"].map(LABEL_MAP).values

print(f"Feature matrix shape: {X.shape}")
print(f"Target distribution:")
for lbl, enc in LABEL_MAP.items():
    count = (y == enc).sum()
    print(f"  {lbl} ({enc}): {count} ({count / len(y) * 100:.0f}%)\n")

# ── Train-Test Split ───────────────────────────────────────────────────────────
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=SEED, stratify=y
)

print(f"Train: {X_train.shape[0]} | Test: {X_test.shape[0]}\n")

# ── Baseline Model ─────────────────────────────────────────────────────────────
print("Training Baseline Random Forest...")
rf_base = RandomForestClassifier(
    n_estimators=100, random_state=SEED, class_weight="balanced", n_jobs=-1
)
rf_base.fit(X_train, y_train)

y_pred_base = rf_base.predict(X_test)
acc_base = accuracy_score(y_test, y_pred_base)
f1_base = f1_score(y_test, y_pred_base, average="macro")

print(f"Baseline Accuracy : {acc_base:.4f}")
print(f"Baseline F1 Macro : {f1_base:.4f}\n")
print("Baseline Classification Report:")
print(
    classification_report(
        y_test, y_pred_base, target_names=["RENDAH", "SEDANG", "TINGGI"]
    )
)

# ── Hyperparameter Tuning ──────────────────────────────────────────────────────
print("\nStarting GridSearchCV for hyperparameter tuning...")
param_grid = {
    "n_estimators": [100, 200, 300],
    "max_depth": [None, 10, 20],
    "min_samples_split": [2, 5],
    "min_samples_leaf": [1, 2],
}

grid_search = GridSearchCV(
    RandomForestClassifier(random_state=SEED, class_weight="balanced", n_jobs=-1),
    param_grid,
    cv=StratifiedKFold(n_splits=5, shuffle=True, random_state=SEED),
    scoring="f1_macro",
    n_jobs=-1,
    verbose=1,
)

grid_search.fit(X_train, y_train)

print(f"\nTuning complete!")
print(f"   Best params : {grid_search.best_params_}")
print(f"   Best F1 CV  : {grid_search.best_score_:.4f}\n")

# ── Best Model Evaluation ──────────────────────────────────────────────────────
rf_best = grid_search.best_estimator_
y_pred_best = rf_best.predict(X_test)
y_proba_best = rf_best.predict_proba(X_test)

acc_best = accuracy_score(y_test, y_pred_best)
f1_best = f1_score(y_test, y_pred_best, average="macro")

print("=" * 50)
print("  MODEL TERBAIK (setelah tuning)")
print(f"  Accuracy  : {acc_best:.4f}  ({acc_best * 100:.2f}%)")
print(f"  F1 Macro  : {f1_best:.4f}")
print("=" * 50 + "\n")
print(
    classification_report(
        y_test, y_pred_best, target_names=["RENDAH", "SEDANG", "TINGGI"]
    )
)

# ── Save Model Artifact ────────────────────────────────────────────────────────
MODEL_PATH = "pss10_rf_model_v2.pkl"

model_artifact = {
    "model": rf_best,
    "feature_cols": FEATURE_COLS,
    "label_map": LABEL_MAP,
    "label_inv": LABEL_INV,
    "reversed_idx": REVERSED_IDX,
    "best_params": grid_search.best_params_,
    "metrics": {
        "accuracy_baseline": round(acc_base, 4),
        "f1_baseline": round(f1_base, 4),
        "accuracy_tuned": round(acc_best, 4),
        "f1_tuned": round(f1_best, 4),
    },
    "versi": "v2 — no skor_total feature, with reversal, class_weight=balanced",
    "n_train": len(X_train),
    "n_test": len(X_test),
}

joblib.dump(model_artifact, MODEL_PATH)
print(f"\nModel artifact saved: {MODEL_PATH}")
print("\nArtifact contents:")
for k, v in model_artifact.items():
    if k != "model":
        print(f"  {k:<22}: {v}")
