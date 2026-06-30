from fastapi import FastAPI
from pydantic import BaseModel

from app.agents.travel_agent import travel_agent


app = FastAPI(
    title="VoyageAI API",
    description="Multi Agent AI Travel Planner"
)


class TravelRequest(BaseModel):
    user_input: str


@app.get("/")
def home():
    return {
        "message": "VoyageAI is running 🚀"
    }


@app.post("/plan")
def plan_trip(request: TravelRequest):

    result = travel_agent(
        request.user_input
    )

    return {
        "travel_plan": result
    }