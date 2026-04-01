from flask import Flask, jsonify, request
from flask_cors import CORS
import threading
import time

from database import init_db, get_latest_readings, get_history, get_alerts, dismiss_alert, get_credit_score, get_community_data, get_budget, set_budget, add_alert, get_dashboard_data
from simulator import simulate_cycle, SIM_OVERRIDES
from anomaly import detect_anomalies
from weather import get_weather

app = Flask(__name__)
CORS(app)

# Background task for simulating sensor cycles
def background_simulator():
    while True:
        simulate_cycle()
        detect_anomalies()
        time.sleep(5)

simulator_started = False

@app.before_request
def start_simulator():
    global simulator_started
    if not simulator_started:
        # Prevents sqlite lock corruption due to gunicorn fork
        init_db()
        bg_thread = threading.Thread(target=background_simulator, daemon=True)
        bg_thread.start()
        simulator_started = True

@app.route('/api/sensors', methods=['GET'])
def sensors():
    data = get_latest_readings()
    return jsonify(data)

@app.route('/api/dashboard', methods=['GET'])
def dashboard_all():
    data = get_dashboard_data()
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
    import os
    if sys.version_info < (3, 10):
        print("Error: Python 3.10+ is required due to dependencies compatibility.")
        sys.exit(1)
        
    # Render requires listening on 0.0.0.0 and expects the dynamic PORT environment variable.
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=False)
