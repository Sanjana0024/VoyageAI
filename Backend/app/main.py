from fastapi import FastAPI
from pydantic import BaseModel

from app.graph.travel_graph import create_travel_graph

from fastapi.responses import StreamingResponse
import json
import asyncio
from fastapi.middleware.cors import CORSMiddleware 


app = FastAPI(
    title="VoyageAI API",
    description="Multi Agent AI Travel Planner"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request schema
class TravelRequest(BaseModel):
    user_input: str


# Initialize LangGraph once
travel_graph = create_travel_graph()


# -------------------------
# HEALTH CHECK
# -------------------------
@app.get("/")
def home():
    return {
        "message": "VoyageAI is running 🚀"
    }


# -------------------------
# NORMAL (NON-STREAMING API)
# -------------------------
@app.post("/plan")
def plan_trip(request: TravelRequest):

    initial_state = {
        "user_request": request.user_input,
        "destination": "",
        "budget": "",
        "weather": "",
        "activities": "",
        "itinerary": {}
    }

    result = travel_graph.invoke(initial_state)

    return {
        "status": "success",
        "data": result["itinerary"]
    }


# -------------------------
# STREAMING API (CHATGPT STYLE)
# -------------------------
@app.post("/plan-stream")
async def plan_trip_stream(request: TravelRequest):

    initial_state = {
        "user_request": request.user_input,
        "destination": "",
        "budget": "",
        "weather": "",
        "activities": "",
        "itinerary": {}
    }

    async def event_stream():

        yield "🚀 Starting VoyageAI...\n"
        await asyncio.sleep(0.3)

        yield "🧭 Understanding travel request...\n"
        await asyncio.sleep(0.3)

        yield "📍 Planning destination...\n"
        await asyncio.sleep(0.3)

        yield "💰 Estimating budget...\n"
        await asyncio.sleep(0.3)

        yield "🌤 Checking weather conditions...\n"
        await asyncio.sleep(0.3)

        yield "🎯 Finding best activities...\n"
        await asyncio.sleep(0.3)

        yield "🧠 Running AI multi-agent system...\n"

        # Run LangGraph safely (non-blocking)
        result = await asyncio.to_thread(
            travel_graph.invoke,
            initial_state
        )

        yield "📅 Finalizing itinerary...\n"
        await asyncio.sleep(0.3)

        yield "\n================ FINAL TRAVEL PLAN ================\n\n"

        yield json.dumps(
            result["itinerary"],
            indent=2
        )

    return StreamingResponse(
        event_stream(),
        media_type="text/plain"
    )