from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv
import os

load_dotenv()

llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash",
    google_api_key=os.getenv("GOOGLE_API_KEY")
)


def travel_agent(user_input: str):
    prompt = f"""
You are an expert travel planner AI.

User request:
{user_input}

Give a detailed travel plan with:
- Destination suggestion
- Budget estimate
- 3-5 day itinerary
- Travel tips
"""

    response = llm.invoke(prompt)
    return response.content