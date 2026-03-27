import random

def get_safety_score(address: str) -> float:
    # Simulated safety score - will connect to real crime API later
    score = (len(address) % 5) + random.uniform(4.0, 9.0)
    score = round(min(max(score, 0.0), 10.0), 2)
    return score