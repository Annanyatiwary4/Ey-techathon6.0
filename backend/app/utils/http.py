import requests
def safe_get_json(url, params=None):
    try:
        res = requests.get(
            url,
            params=params,
            timeout=10,
            headers={
                "User-Agent": "Mozilla/5.0 (research-bot)",
                "Accept": "application/json"
            }
        )
        if res.status_code != 200:
            return {}
        return res.json()
    except Exception:
        return {}
