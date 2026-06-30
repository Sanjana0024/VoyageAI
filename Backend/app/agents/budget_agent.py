from app.config import llm


def budget_agent(state):
    """
    Agent responsible for analyzing trip budget.
    """

    prompt = f"""
    You are an expert travel budget planner.

    User travel request:
    {state['user_request']}

    Selected destination:
    {state['destination']}

    Analyze the budget and provide:

    1. Estimated transportation cost
    2. Accommodation cost
    3. Food cost
    4. Activities cost
    5. Total estimated budget
    6. Suggestions to save money

    Keep the plan realistic.
    """

    response = llm.invoke(prompt)

    state["budget"] = response.content

    return state