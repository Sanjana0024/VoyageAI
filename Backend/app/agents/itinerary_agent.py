from app.config import llm


def itinerary_agent(state):
    """
    Final agent that combines all information
    and generates complete travel itinerary.
    """

    prompt = f"""
    You are a professional travel itinerary creator.

    Create a complete travel plan using the information below.

    User Request:
    {state['user_request']}

    Destination Information:
    {state['destination']}

    Budget Information:
    {state['budget']}

    Weather Information:
    {state['weather']}

    Activities Information:
    {state['activities']}


    Create a detailed final itinerary including:

    1. Trip summary
    2. Total estimated budget
    3. Day-wise plan
    4. Places to visit
    5. Activities
    6. Food recommendations
    7. Travel tips

    Make it realistic and easy for a traveler to follow.
    """

    response = llm.invoke(prompt)

    state["itinerary"] = response.content

    return state