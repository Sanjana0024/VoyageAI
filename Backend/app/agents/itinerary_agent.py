import json
from app.config import llm


def itinerary_agent(state):
    print("STATE RECEIVED:", state)
    """
    Final agent that generates structured JSON itinerary.
    """

    prompt = f"""
You are an expert AI travel planner.

Create a complete day-wise travel itinerary.

IMPORTANT RULES:
- Return ONLY valid JSON.
- No markdown.
- No explanations.
- day_wise_plan MUST contain exactly 5 days.
- Each day must have location, activities, food, and estimated_cost.
- Keep the total budget within the user's budget.

Required JSON format:

{{
  "trip_summary": "",
  "total_budget": "",
  "day_wise_plan": [
    {{
      "day": 1,
      "location": "",
      "activities": [],
      "food": [],
      "estimated_cost": ""
    }},
    {{
      "day": 2,
      "location": "",
      "activities": [],
      "food": [],
      "estimated_cost": ""
    }},
    {{
      "day": 3,
      "location": "",
      "activities": [],
      "food": [],
      "estimated_cost": ""
    }},
    {{
      "day": 4,
      "location": "",
      "activities": [],
      "food": [],
      "estimated_cost": ""
    }},
    {{
      "day": 5,
      "location": "",
      "activities": [],
      "food": [],
      "estimated_cost": ""
    }}
  ],
  "places_to_visit": [],
  "activities": [],
  "travel_tips": []
}}

User Request:
{state['user_request']}

Destination Information:
{state['destination']}

Budget Information:
{state['budget']}

Weather Information:
{state['weather']}

Activity Information:
{state['activities']}
"""

    response = llm.invoke(prompt)

    content = response.content

    try:
        parsed = json.loads(content)

    except Exception:
        parsed = {
            "raw_output": content
        }

    state["itinerary"] = parsed

    return state