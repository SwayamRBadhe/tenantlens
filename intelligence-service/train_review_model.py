import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
import joblib
import os

# Load dataset
print("Loading dataset...")
df = pd.read_csv('data/fake reviews dataset.csv')

print(f"Dataset shape: {df.shape}")
print(f"Label distribution:\n{df['label'].value_counts()}")

# Drop rows with missing text
df = df.dropna(subset=['text_', 'label'])

# Features and target
X = df['text_']
y = df['label']  # CG = fake, OR = real

# Train test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Convert text to TF-IDF features
print("Vectorizing text...")
vectorizer = TfidfVectorizer(max_features=5000, stop_words='english')
X_train_tfidf = vectorizer.fit_transform(X_train)
X_test_tfidf = vectorizer.transform(X_test)

# Train Logistic Regression
print("Training Logistic Regression model...")
model = LogisticRegression(max_iter=1000, random_state=42)
model.fit(X_train_tfidf, y_train)

# Evaluate
y_pred = model.predict(X_test_tfidf)
accuracy = accuracy_score(y_test, y_pred)
print(f"Accuracy: {accuracy:.4f}")
print(classification_report(y_test, y_pred))

# Save model and vectorizer
os.makedirs('trained_models', exist_ok=True)
joblib.dump(model, 'trained_models/review_model.pkl')
joblib.dump(vectorizer, 'trained_models/review_vectorizer.pkl')

print("Model saved to trained_models/")
print("Training complete!")