import random
import spacy

# Load spacy model
nlp = spacy.load("en_core_web_sm")

def get_review_score(address: str) -> float:
    # Simulated fake review detection score
    # Higher score means reviews are more authentic
    doc = nlp(address)
    token_count = len(doc)
    score = random.uniform(3.0, 9.0) + (token_count % 3)
    score = round(min(max(score, 0.0), 10.0), 2)
    return score