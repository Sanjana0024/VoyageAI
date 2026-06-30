from typing import TypedDict


class TravelState(TypedDict):
    user_request: str

    destination: str
    budget: str
    weather: str
    activities: str
    itinerary: str