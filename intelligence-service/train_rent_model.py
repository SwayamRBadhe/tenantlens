import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import mean_absolute_error, r2_score
import joblib
import os

# Load dataset
print("Loading dataset...")
df = pd.read_csv('data/apartments_for_rent_classified_100K.csv', sep=';', encoding='latin-1', low_memory=False)

print(f"Dataset shape: {df.shape}")

# Keep only useful columns
df = df[['price', 'bedrooms', 'bathrooms', 'square_feet', 'state', 'cityname']].copy()

# Drop rows with missing values
df = df.dropna()

# Remove outliers - keep only prices between $300 and $10000
df = df[(df['price'] >= 300) & (df['price'] <= 10000)]

# Convert to numeric
df['price'] = pd.to_numeric(df['price'], errors='coerce')
df['bedrooms'] = pd.to_numeric(df['bedrooms'], errors='coerce')
df['bathrooms'] = pd.to_numeric(df['bathrooms'], errors='coerce')
df['square_feet'] = pd.to_numeric(df['square_feet'], errors='coerce')

# Drop any remaining NaN
df = df.dropna()

print(f"Cleaned dataset shape: {df.shape}")

# Encode state column
state_encoder = LabelEncoder()
df['state_encoded'] = state_encoder.fit_transform(df['state'])

# Features and target
X = df[['bedrooms', 'bathrooms', 'square_feet', 'state_encoded']]
y = df['price']

# Train test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train Random Forest model
print("Training Random Forest model...")
model = RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1)
model.fit(X_train, y_train)

# Evaluate
y_pred = model.predict(X_test)
mae = mean_absolute_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print(f"Mean Absolute Error: ${mae:.2f}")
print(f"R2 Score: {r2:.4f}")

# Also compute median rent per state for comparison
state_median_rent = df.groupby('state')['price'].median().to_dict()

# Save model and encoders
os.makedirs('trained_models', exist_ok=True)
joblib.dump(model, 'trained_models/rent_model.pkl')
joblib.dump(state_encoder, 'trained_models/state_encoder.pkl')
joblib.dump(state_median_rent, 'trained_models/state_median_rent.pkl')

print("Model saved to trained_models/")
print("Training complete!")