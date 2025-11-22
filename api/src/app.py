from contextlib import asynccontextmanager
from datetime import datetime, timedelta
from typing import AsyncIterator

from fastapi import FastAPI, Form, status
from fastapi.responses import RedirectResponse
from typing_extensions import TypedDict

from services.database import JSONDatabase


class Quote(TypedDict):
    name: str
    message: str
    time: str


database: JSONDatabase[list[Quote]] = JSONDatabase("data/database.json")


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    """Handle database management when running app."""
    if "quotes" not in database:
        print("Adding quotes entry to database")
        database["quotes"] = []

    yield

    database.close()


app = FastAPI(lifespan=lifespan)


@app.post("/quote")
def post_message(name: str = Form(), message: str = Form()) -> RedirectResponse:
    """
    Process a user submitting a new quote.
    You should not modify this function except for the return value.
    """
    now = datetime.now()
    quote = Quote(name=name, message=message, time=now.isoformat(timespec="seconds"))
    database["quotes"].append(quote)

    # You may modify the return value as needed to support other functionality
    return quote


@app.get("/quotes")
def get_quotes(max_age_days: int | None = None) -> list[Quote]:
    """
    Retrieve quotes from the database, filtered
    by the maximum age of the quote (in days).

    Example usage:
        /quotes                ---> returns all quotes
        /quotes?max_age_days=7 ---> returns quotes from past week
    """
    quotes = database["quotes"]

    if max_age_days is None: return quotes

    now = datetime.now()
    latest_time = now - timedelta(days=max_age_days)

    filtered_quotes = []
    for q in quotes:
        try:
            q_time = datetime.fromisoformat(q["time"])
        except ValueError:
            print("ERROR: quote with improper time value:", q)
            continue

        if q_time >= latest_time:
            filtered_quotes.append(q)

    return filtered_quotes