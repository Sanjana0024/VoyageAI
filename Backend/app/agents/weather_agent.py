from app.config import llm

def weather_agent(state):

    print("Weather Agent Started")
    print("State Before:", state)

    prompt = f"""
You are an expert travel weather advisor.

User travel request:
{state['user_request']}

Selected destination:
{state['destination']}

Provide:

1. Expected weather conditions
2. Best months to visit
3. Clothes/items to carry
4. Travel precautions

Keep the response concise.
"""

    response = llm.invoke(prompt)

    state["weather"] = response.content

    print("Weather Added")
    print(state)

    return state