import joblib
import os
import requests
import re

# Load trained model and vectorizer
model = joblib.load(os.path.join(os.path.dirname(__file__), '../../trained_models/review_model.pkl'))
vectorizer = joblib.load(os.path.join(os.path.dirname(__file__), '../../trained_models/review_vectorizer.pkl'))

def get_reviews_from_address(address: str) -> list:
    # Use Nominatim to get city from address then search for reviews
    # For now we generate sample review-like text based on the address
    # In production this would scrape real reviews from listing sites
    sample_reviews = [
        f"Great place at {address}. Very clean and well maintained.",
        f"Love this apartment. Landlord is very responsive.",
        f"Amazing location. Highly recommend this property.",
        f"Good value for the price. Nice neighborhood.",
        f"Decent place. Some maintenance issues but overall okay."
    ]
    return sample_reviews

def get_review_score(address: str) -> float:
    try:
        # Get sample reviews for the address
        reviews = get_reviews_from_address(address)

        # Predict fake probability for each review
        reviews_tfidf = vectorizer.transform(reviews)
        predictions = model.predict(reviews_tfidf)
        probabilities = model.predict_proba(reviews_tfidf)

        # Get index of OR (original/real) class
        classes = model.classes_.tolist()
        or_index = classes.index('OR')

        # Average probability of being real across all reviews
        avg_real_prob = sum([prob[or_index] for prob in probabilities]) / len(probabilities)

        # Convert to score 0-10
        score = round(avg_real_prob * 10, 2)

        return score

    except Exception as e:
        print(f"Review score error: {e}")
        return 5.0