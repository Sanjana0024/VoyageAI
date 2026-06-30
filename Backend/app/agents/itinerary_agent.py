import json
from app.config import llm


def itinerary_agent(state):
    """
    Final agent that generates structured JSON itinerary.
    """

    prompt = f"""
Return ONLY valid JSON. No explanations, no markdown.

Schema:
{{
  "trip_summary": "",
  "total_budget": "",
  "day_wise_plan": [],
  "places_to_visit": [],
  "activities": [],
  "food": [],
  "travel_tips": []
}}

Input:
User Request: {state['user_request']}
Destination: {state['destination']}
Budget: {state['budget']}
Weather: {state['weather']}
Activities: {state['activities']}
"""

    response = llm.invoke(prompt)

    # Extract text safely
    content = response.content

    try:
        parsed = json.loads(content)
    except Exception:
        # fallback if model returns messy output
        parsed = {
            "raw_output": content
        }

    state["itinerary"] = parsed

    return state