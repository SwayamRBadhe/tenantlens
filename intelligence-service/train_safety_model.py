import pandas as pd
import numpy as np
import joblib
import os

# Load and combine all 4 crime datasets
print("Loading crime datasets...")
df1 = pd.read_csv('data/crime_40_60.csv')
df2 = pd.read_csv('data/crime_60_100.csv')
df3 = pd.read_csv('data/crime_100_250.csv')
df4 = pd.read_csv('data/crime_250_plus.csv')

df = pd.concat([df1, df2, df3, df4], ignore_index=True)
print(f"Combined dataset shape: {df.shape}")

# Keep only useful columns
df = df[['states', 'cities', 'violent_crime', 'prop_crime']].copy()

# Drop rows with missing values
df = df.dropna()

# Convert crime rates to numeric
df['violent_crime'] = pd.to_numeric(df['violent_crime'], errors='coerce')
df['prop_crime'] = pd.to_numeric(df['prop_crime'], errors='coerce')
df = df.dropna()

# Normalize crime rates to 0-1 scale
max_violent = df['violent_crime'].max()
max_prop = df['prop_crime'].max()

df['violent_norm'] = df['violent_crime'] / max_violent
df['prop_norm'] = df['prop_crime'] / max_prop

# Combined crime score (weighted - violent crime weighted more)
df['crime_score'] = (df['violent_norm'] * 0.6) + (df['prop_norm'] * 0.4)

# Convert to safety score 0-10 (inverse of crime score)
df['safety_score'] = round((1 - df['crime_score']) * 10, 2)

# Clean city names for lookup
df['city_clean'] = df['cities'].str.lower().str.strip()
df['state_clean'] = df['states'].str.lower().str.strip()

print(f"Safety scores range: {df['safety_score'].min()} - {df['safety_score'].max()}")
print(f"Sample data:\n{df[['cities', 'states', 'safety_score']].head(5)}")

# Save as lookup dictionary
city_safety = {}
for _, row in df.iterrows():
    key = f"{row['city_clean']}_{row['state_clean']}"
    city_safety[key] = row['safety_score']

# Save lookup
os.makedirs('trained_models', exist_ok=True)
joblib.dump(city_safety, 'trained_models/city_safety_lookup.pkl')

print(f"Saved {len(city_safety)} cities to lookup")
print("Training complete!")