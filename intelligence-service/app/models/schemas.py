from pydantic import BaseModel

# Request coming from Property Service
class AnalyzeRequest(BaseModel):
    address: str
    userEmail: str

# Response going back to Property Service
class AnalyzeResponse(BaseModel):
    address: str
    safetyScore: float
    reviewScore: float
    rentScore: float
    overallScore: float
    aiReport: str