from app.config import llm


def destination_agent(state):

    prompt = f"""
You are a travel destination expert.

Analyze this request:

{state['user_request']}

Return only the important travel information:

Destination:
Best time:
Top places:

Keep the answer short.
"""

    response = llm.invoke(prompt)

    state["destination"] = response.content

    return state