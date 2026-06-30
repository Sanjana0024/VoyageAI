from app.config import llm


def router_agent(state):
    """
    Decides which agents are needed.
    """

    prompt = f"""
    You are a routing system for a travel AI.

    Based on this request, decide which modules are needed:

    Modules:
    - destination
    - budget
    - weather
    - activities
    - itinerary

    User request:
    {state['user_request']}

    Return ONLY list of modules in order.
    """

    response = llm.invoke(prompt)

    state["route"] = response.content

    return state