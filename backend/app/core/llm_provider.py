from langchain_groq import ChatGroq
import os

_cached_llm = None


def get_llm():
    """Return a singleton ChatGroq client when an API key is available."""
    global _cached_llm

    if _cached_llm is not None:
        return _cached_llm

    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        return None

    _cached_llm = ChatGroq(
        groq_api_key=api_key,
        model_name="llama-3.1-70b-versatile",
        temperature=0
    )

    return _cached_llm

