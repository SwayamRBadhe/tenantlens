import joblib
import requests
import os

# Load city safety lookup
city_safety = joblib.load(os.path.join(os.path.dirname(__file__), '../../trained_models/city_safety_lookup.pkl'))

def get_city_state_from_address(address: str):
    # Use Nominatim to get city and state from address
    try:
        url = f"https://nominatim.openstreetmap.org/search?q={requests.utils.quote(address)}&format=json&addressdetails=1"
        response = requests.get(url, headers={"User-Agent": "TenantLens/1.0"})
        data = response.json()
        if data and len(data) > 0:
            address_details = data[0].get('address', {})
            city = address_details.get('city') or address_details.get('town') or address_details.get('village', '')
            state = address_details.get('state', '')
            return city.lower().strip(), state.lower().strip()
    except Exception as e:
        print(f"Geocoding error: {e}")
    return None, None

def get_safety_score(address: str) -> float:
    try:
        city, state = get_city_state_from_address(address)

        if not city or not state:
            return 5.0

        # Look up city safety score
        key = f"{city}_{state}"
        if key in city_safety:
            return float(city_safety[key])

        # Try partial match - check if city name is contained in any key
        for lookup_key, score in city_safety.items():
            if city in lookup_key and state in lookup_key:
                return float(score)

        # If city not found return average score
        avg_score = round(sum(city_safety.values()) / len(city_safety), 2)
        return avg_score

    except Exception as e:
        print(f"Safety score error: {e}")
        return 5.0