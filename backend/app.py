from flask import Flask, jsonify, request
from flask_cors import CORS
import threading
import time

from database import init_db, get_latest_readings, get_history, get_alerts, dismiss_alert, get_credit_score, get_community_data, get_budget, set_budget, add_alert
from simulator import simulate_cycle, SIM_OVERRIDES
from anomaly import detect_anomalies
from weather import get_weather
from gemini_client import analyze_with_gemini

app = Flask(__name__)
CORS(app)

# Background task for simulating sensor cycles
def background_simulator():
    while True:
        simulate_cycle()
        detect_anomalies()
        time.sleep(5)

@app.route('/api/sensors', methods=['GET'])
def sensors():
    data = get_latest_readings()
    return jsonify(data)

@app.route('/api/sensors/history/<node_id>', methods=['GET'])
def sensor_history(node_id):
    limit = int(request.args.get('limit', 20))
    data = get_history(node_id, limit)
    return jsonify(data)

@app.route('/api/alerts', methods=['GET'])
def alerts():
    data = get_alerts()
    return jsonify(data)

@app.route('/api/alerts/dismiss/<int:alert_id>', methods=['POST'])
def dismiss(alert_id):
    dismiss_alert(alert_id)
    return jsonify({'status': 'success'})

@app.route('/api/credit-score', methods=['GET'])
def credit_score():
    data = get_credit_score()
    if SIM_OVERRIDES.get('low_credit'):
        data = {'score': 35, 'efficiency_score': 5, 'leak_score': 5, 'peak_score': 10, 'rain_score': 15}
    return jsonify(data)

@app.route('/api/weather', methods=['GET'])
def weather():
    lat = float(request.args.get('lat', 9.9816))
    lon = float(request.args.get('lon', 76.2999))
    data = get_weather(lat, lon)
    if SIM_OVERRIDES.get('rain'):
        data['will_rain'] = True
        data['expected_rain_mm'] = 25.5
    return jsonify(data)

@app.route('/api/community', methods=['GET'])
def community():
    data = get_community_data()
    return jsonify(data)

@app.route('/api/budget', methods=['POST'])
def update_budget():
    amount = float(request.json.get('daily_limit_litres', 150))
    set_budget(amount)
    return jsonify({'status': 'success'})

@app.route('/api/budget/today', methods=['GET'])
def get_budget_today():
    data = get_budget()
    return jsonify(data)

@app.route('/api/gemini/analyze', methods=['POST'])
def gemini_analyze():
    req_data = request.json
    prompt_type = req_data.get('type')
    context = req_data.get('context', {})
    
    prompt = "Analyze the following water management data and provide insights.\\n"
    if prompt_type == 'leak':
        prompt = f"Unusual water leak detected: {context.get('msg')}. Generate a short explanation and advice."
    elif prompt_type == 'credit':
        prompt = f"User credit score: {context.get('score')} based on metrics {context}. Give 3 personalized improvement tips."
    elif prompt_type == 'rain':
        prompt = f"Rainwater tank {context.get('tank')}%. Weather: {context.get('rain')} expected. Give smart usage strategy."
    elif prompt_type == 'community':
        prompt = f"Community stats: {context}. Give neighborhood intelligence narrative about anomalies if any."
    elif prompt_type == 'sim':
        prompt = f"User parameters: {context}. Give conservation plan."
    elif prompt_type == 'quality':
        prompt = f"Water quality: {context}. Give usage guidance."
    elif prompt_type == 'emergency':
        prompt = f"Emergency shutdown initiated! Give critical response instructions."
    else:
        # Custom / unhandled
        prompt = req_data.get('prompt', prompt)

    response_text = analyze_with_gemini(prompt)
    return jsonify({'analysis': response_text})

@app.route('/api/emergency', methods=['POST'])
def emergency_toggle():
    status = request.json.get('status', True)
    SIM_OVERRIDES['emergency'] = status
    if status:
        add_alert('SYSTEM', 'emergency', 'Emergency Mode Activated. Shutting down all nodes to prevent hazard.', 'critical')
    return jsonify({'status': 'success', 'emergency': status})

@app.route('/api/demo/override', methods=['POST'])
def update_demo():
    overrides = request.json
    for key, value in overrides.items():
        if key in SIM_OVERRIDES:
            SIM_OVERRIDES[key] = value
    return jsonify(SIM_OVERRIDES)


if __name__ == '__main__':
    import sys
    if sys.version_info < (3, 10):
        print("Error: Python 3.10+ is required due to dependencies compatibility.")
        sys.exit(1)
        
    init_db()
    # Start background simulator
    bg_thread = threading.Thread(target=background_simulator, daemon=True)
    bg_thread.start()
    app.run(port=5001, debug=False)
