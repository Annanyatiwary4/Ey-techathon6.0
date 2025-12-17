class BaseAgent:
    name: str = "base"

    def run(self, payload: dict) -> dict:
        raise NotImplementedError
