import random

def get_rent_score(address: str) -> float:
    # Simulated rent manipulation score
    # Higher score means rent is more fair
    score = random.uniform(3.5, 9.5) - (len(address) % 4)
    score = round(min(max(score, 0.0), 10.0), 2)
    return score