from app.config import llm


def weather_agent(state):
    """
    Agent responsible for weather analysis
    and travel timing recommendations.
    """

    prompt = f"""
    You are an expert travel weather advisor.

    User travel request:
    {state['user_request']}

    Selected destination:
    {state['destination']}

    Provide weather information:

    1. Expected weather conditions
    2. Best months to visit
    3. What clothes/items to carry
    4. Weather-related travel precautions

    Make recommendations useful for a traveler.
    """

    response = llm.invoke(prompt)

    state["weather"] = response.content

    return state