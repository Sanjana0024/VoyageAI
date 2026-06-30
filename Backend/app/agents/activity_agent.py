from app.config import llm


def activity_agent(state):
    """
    Agent responsible for recommending activities
    and experiences at the destination.
    """

    prompt = f"""
    You are an expert travel activity planner.

    User travel request:
    {state['user_request']}

    Selected destination:
    {state['destination']}

    Weather information:
    {state['weather']}

    Suggest activities and experiences.

    Include:

    1. Adventure activities
    2. Famous places to visit
    3. Local experiences
    4. Activities suitable according to budget
    5. Things the traveler should not miss

    Make recommendations practical.
    """

    response = llm.invoke(prompt)

    state["activities"] = response.content

    return state