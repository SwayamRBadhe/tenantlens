import joblib
import requests
import os

# Load trained model and encoders
model = joblib.load(os.path.join(os.path.dirname(__file__), '../../trained_models/rent_model.pkl'))
state_encoder = joblib.load(os.path.join(os.path.dirname(__file__), '../../trained_models/state_encoder.pkl'))
state_median_rent = joblib.load(os.path.join(os.path.dirname(__file__), '../../trained_models/state_median_rent.pkl'))

def get_state_from_address(address: str) -> str:
    # Use Nominatim to get state from address
    try:
        url = f"https://nominatim.openstreetmap.org/search?q={requests.utils.quote(address)}&format=json&addressdetails=1"
        response = requests.get(url, headers={"User-Agent": "TenantLens/1.0"})
        data = response.json()
        if data and len(data) > 0:
            address_details = data[0].get('address', {})
            state = address_details.get('state', '')
            # Convert full state name to abbreviation
            state_abbr = get_state_abbr(state)
            return state_abbr
    except Exception as e:
        print(f"Geocoding error: {e}")
    return None

def get_state_abbr(state_name: str) -> str:
    # Map full state names to abbreviations
    states = {
        'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR',
        'California': 'CA', 'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE',
        'Florida': 'FL', 'Georgia': 'GA', 'Hawaii': 'HI', 'Idaho': 'ID',
        'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA', 'Kansas': 'KS',
        'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD',
        'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS',
        'Missouri': 'MO', 'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV',
        'New Hampshire': 'NH', 'New Jersey': 'NJ', 'New Mexico': 'NM', 'New York': 'NY',
        'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH', 'Oklahoma': 'OK',
        'Oregon': 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
        'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT',
        'Vermont': 'VT', 'Virginia': 'VA', 'Washington': 'WA', 'West Virginia': 'WV',
        'Wisconsin': 'WI', 'Wyoming': 'WY', 'District of Columbia': 'DC'
    }
    return states.get(state_name, state_name[:2].upper())

def get_rent_score(address: str) -> float:
    try:
        # Get state from address
        state = get_state_from_address(address)

        if state is None or state not in state_encoder.classes_:
            # Fall back to median score if state not found
            return 5.0

        # Encode state
        state_encoded = state_encoder.transform([state])[0]

        # Predict fair rent with average bedrooms/bathrooms/sqft
        predicted_rent = model.predict([[2, 1, 900, state_encoded]])[0]

        # Get median rent for this state
        median_rent = state_median_rent.get(state, predicted_rent)

        # Calculate how far median rent is from predicted fair rent
        ratio = median_rent / predicted_rent

        # If ratio is close to 1 → fair rent → high score
        # If ratio is much higher → manipulation → low score
        if ratio <= 1.1:
            score = 9.0
        elif ratio <= 1.2:
            score = 8.0
        elif ratio <= 1.3:
            score = 7.0
        elif ratio <= 1.5:
            score = 5.0
        elif ratio <= 1.8:
            score = 3.0
        else:
            score = 1.0

        return round(score, 2)

    except Exception as e:
        print(f"Rent score error: {e}")
        return 5.0