from fastapi import FastAPI
from app.agents.travel_agent import travel_agent

app = FastAPI(title="VoyageAI - Multi Agent Travel Planner")


@app.get("/")
def home():
    return {"message": "VoyageAI is running 🚀"}


@app.post("/plan")
def plan_trip(user_input: str):
    result = travel_agent(user_input)
    return {"travel_plan": result}