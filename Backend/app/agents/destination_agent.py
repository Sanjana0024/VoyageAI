from app.config import llm


def destination_agent(state):
    """
    Agent responsible for selecting the best destination
    based on user's travel requirements.
    """

    prompt = f"""
    You are an expert travel destination planner.

    User travel request:
    {state['user_request']}

    Analyze the request and suggest the best destination.

    Provide:
    1. Destination name
    2. Why this destination matches the user's needs
    3. Best time to visit
    4. Main attractions
    5. Approximate travel suitability based on budget
    """

    response = llm.invoke(prompt)

    state["destination"] = response.content

    return state