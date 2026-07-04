from app.config import llm
import json

def weather_agent(state):

    prompt = f"""
You are a travel weather expert.

Return ONLY valid JSON:

{{
  "condition": "",
  "temperature": "",
  "best_time": "",
  "packing": [],
  "tips": []
}}

User Request:
{state['user_request']}

Destination:
{state['destination']}
"""

    response = llm.invoke(prompt)
    content = response.content

    try:
        parsed = json.loads(content)
    except:
        parsed = {
            "condition": "Unknown",
            "temperature": "N/A",
            "best_time": "N/A",
            "packing": [],
            "tips": []
        }

    state["weather"] = parsed

    return state