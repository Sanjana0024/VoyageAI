from app.config import llm


def budget_agent(state):

    prompt = f"""
You are a travel budget planner.

User request:
{state['user_request']}

Destination:
{state['destination']}

Return a short budget summary.

Include:
- Transport cost
- Stay cost
- Food cost
- Activities cost
- Total estimated cost

Keep response under 200 words.
"""

    response = llm.invoke(prompt)

    state["budget"] = response.content

    return state