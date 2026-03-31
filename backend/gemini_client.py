import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY", "")

if api_key:
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-2.0-flash")
else:
    model = None

# Simple in-memory cache to prevent quota exhaustion
prompt_cache = {}

def analyze_with_gemini(prompt):
    if not model:
        return "AI analysis disabled. Please provide GEMINI_API_KEY to activate Gemini insights."
        
    # Check cache first
    cache_key = prompt.strip()
    if cache_key in prompt_cache:
        return prompt_cache[cache_key]
        
    try:
        response = model.generate_content(prompt + "\\n\\nKeep the response under 100 words — concise, actionable, operator-friendly.")
        result = response.text.strip()
        # Save to cache
        prompt_cache[cache_key] = result
        return result
    except Exception as e:
        error_msg = str(e)
        if "429" in error_msg or "Quota" in error_msg:
            return "AI Rate Limit Exceeded (Free Tier). Please wait 1 minute before requesting new insights. Cached insights will still work."
        return f"AI analysis error: {error_msg}"

# Convenience functions for specific prompts
def generate_leak_alert_explanation(node, duration, flow):
    prompt = f"Unusual water flow detected at {node} node — {flow} L/min sustained for {duration} mins. Generate a natural language explanation recommending action."
    return analyze_with_gemini(prompt)

def generate_credit_score_tips(score, efficiency, leaks, peak, rain):
    prompt = f"A user has a water credit score of {score}/100 based on efficiency:{efficiency}, leaks:{leaks}, peak-hours:{peak}, rain-usage:{rain}. Give 3 personalized improvement tips."
    return analyze_with_gemini(prompt)

def generate_rainwater_strategy(rain_expected, expected_mm, tank_level):
    prompt = f"Rainwater tank level is {tank_level}%. Expected rain in 24h is {expected_mm}mm ({'Will rain' if rain_expected else 'No rain'}). Generate a smart water usage strategy message."
    return analyze_with_gemini(prompt)

def generate_community_narrative(neighborhood_data, flagged_house):
    prompt = f"Neighborhood data shows {neighborhood_data}. {flagged_house} usage spiked >25% above average. Explain this anomaly in a community water intelligence narrative."
    return analyze_with_gemini(prompt)

def generate_conservation_plan(shower_time, people, watering_freq, has_rainwater, saved_litres):
    prompt = f"User takes {shower_time} min showers, {people} people household, waters garden {watering_freq} times/week, has rainwater tank: {has_rainwater}. Saved {saved_litres}L this month. Generate a personalized conservation plan and environmental impact analogy."
    return analyze_with_gemini(prompt)

def generate_quality_guidance(node, ph, turbidity):
    prompt = f"Water quality at {node} is pH {ph}, turbidity {turbidity} NTU. Classify it and suggest appropriate usage (safe ranges: pH 6.5-8.5, Turbidity <4 NTU)."
    return analyze_with_gemini(prompt)

def generate_emergency_response(event_details):
    prompt = f"Emergency mode activated due to: {event_details}. Generate a critical response message."
    return analyze_with_gemini(prompt)
