import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, accuracy_score
import joblib


def load_data(path='ml/mental_health_data.csv'):
    df = pd.read_csv(path)
    return df


def train_model(df):
    X = df[[f'q{i}' for i in range(1, 11)]]
    y = df['label'].map({'tidak': 0, 'stres': 1})

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42, stratify=y)

    pipeline = make_pipeline(
        StandardScaler(),
        LogisticRegression(solver='liblinear', class_weight='balanced', random_state=42)
    )

    pipeline.fit(X_train, y_train)

    y_pred = pipeline.predict(X_test)
    print('accuracy:', accuracy_score(y_test, y_pred))
    print(classification_report(y_test, y_pred, target_names=['tidak', 'stres']))

    return pipeline


def save_model(model, path='ml/mental_health_model.pkl'):
    joblib.dump(model, path)
    print(f'Model disimpan ke {path}')


def main():
    df = load_data()
    model = train_model(df)
    save_model(model)


if __name__ == '__main__':
    main()
