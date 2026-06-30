from app.config import llm


def travel_agent(user_input: str):

    prompt = f"""
    You are an expert travel planner AI.

    User request:
    {user_input}

    Create a detailed travel plan with:
    - Destination
    - Budget estimate
    - Day wise itinerary
    - Travel tips
    """

    response = llm.invoke(prompt)

    return response.content