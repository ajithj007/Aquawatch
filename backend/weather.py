import requests

def get_weather(lat=9.9816, lon=76.2999): # Ernakulam default
    url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&hourly=precipitation&forecast_days=1"
    try:
        response = requests.get(url)
        data = response.json()
        precip = sum(data['hourly']['precipitation'])
        return {
            'expected_rain_mm': precip,
            'will_rain': precip > 2.0
        }
    except Exception as e:
        print("Error fetching weather:", e)
        return {'expected_rain_mm': 0, 'will_rain': False}
