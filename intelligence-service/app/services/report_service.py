import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def generate_report(address: str, safety_score: float, review_score: float, rent_score: float, overall_score: float) -> str:
    prompt = f"""
    You are TenantLens AI, a renter protection assistant.
    
    Analyze this property and generate a short, clear report for a renter:
    
    Address: {address}
    Safety Score: {safety_score}/10
    Review Authenticity Score: {review_score}/10
    Rent Fairness Score: {rent_score}/10
    Overall Trust Score: {overall_score}/10
    
    Write a 3-4 sentence plain English report explaining what these scores mean for this renter.
    Be honest and helpful.
    """

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=300
    )

    return response.choices[0].message.content