from typing import TypedDict, Any

from langgraph.graph import StateGraph, END

from app.agents.destination_agent import destination_agent
from app.agents.budget_agent import budget_agent
from app.agents.weather_agent import weather_agent
from app.agents.activity_agent import activity_agent
from app.agents.itinerary_agent import itinerary_agent


# Shared memory between agents
class TravelState(TypedDict):

    user_request: str

    destination: str
    budget: str
    weather: str
    activities: str

    itinerary: Any



def create_travel_graph():

    graph = StateGraph(TravelState)


    # Agents
    graph.add_node(
        "destination",
        destination_agent
    )

    graph.add_node(
        "budget",
        budget_agent
    )

    graph.add_node(
        "weather",
        weather_agent
    )

    graph.add_node(
        "activities",
        activity_agent
    )

    graph.add_node(
        "itinerary",
        itinerary_agent
    )


    # Flow

    graph.set_entry_point(
        "destination"
    )


    graph.add_edge(
        "destination",
        "budget"
    )


    graph.add_edge(
        "budget",
        "weather"
    )


    graph.add_edge(
        "weather",
        "activities"
    )


    graph.add_edge(
        "activities",
        "itinerary"
    )


    graph.add_edge(
        "itinerary",
        END
    )


    return graph.compile()