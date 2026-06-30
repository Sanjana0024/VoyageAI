from fastapi import FastAPI
from pydantic import BaseModel

from app.graph.travel_graph import create_travel_graph


app = FastAPI(
    title="VoyageAI API",
    description="Multi Agent AI Travel Planner"
)


class TravelRequest(BaseModel):
    user_input: str


# Create LangGraph workflow
travel_graph = create_travel_graph()


@app.get("/")
def home():
    return {
        "message": "VoyageAI is running 🚀"
    }


@app.post("/plan")
def plan_trip(request: TravelRequest):

    initial_state = {
        "user_request": request.user_input,

        "destination": "",
        "budget": "",
        "weather": "",
        "activities": "",
        "itinerary": ""
    }


    result = travel_graph.invoke(
        initial_state
    )


    return {
        "travel_plan": result["itinerary"]
    }