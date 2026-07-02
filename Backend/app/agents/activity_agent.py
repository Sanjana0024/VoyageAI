from app.config import llm


def activity_agent(state):

    prompt = f"""
You are a travel activity planner.

Destination:
{state['destination']}

Suggest:

- Adventure activities
- Famous places
- Local experiences
- Must try things

Keep response concise.
"""

    response = llm.invoke(prompt)

    state["activities"] = response.content

    return state