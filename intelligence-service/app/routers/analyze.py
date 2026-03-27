from fastapi import APIRouter
from app.models.schemas import AnalyzeRequest, AnalyzeResponse
from app.services.safety_service import get_safety_score
from app.services.review_service import get_review_score
from app.services.rent_service import get_rent_score
from app.services.report_service import generate_report

router = APIRouter()

@router.post("/analyze")
def analyze_property(request: AnalyzeRequest):
    # Get scores from each service
    safety_score = get_safety_score(request.address)
    review_score = get_review_score(request.address)
    rent_score = get_rent_score(request.address)

    # Calculate overall score
    overall_score = round((safety_score + review_score + rent_score) / 3, 2)

    # Generate AI report
    ai_report = generate_report(
        request.address,
        safety_score,
        review_score,
        rent_score,
        overall_score
    )

    return AnalyzeResponse(
        address=request.address,
        safetyScore=safety_score,
        reviewScore=review_score,
        rentScore=rent_score,
        overallScore=overall_score,
        aiReport=ai_report
    )