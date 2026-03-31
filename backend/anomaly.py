import os
from database import get_history, add_alert, get_alerts
from datetime import datetime
from simulator import SIM_OVERRIDES

# Check for anomalies on history
def detect_anomalies():
    # Retrieve alerts to avoid spamming the same
    active_alerts = get_alerts()
    active_types = {a['alert_type'] for a in active_alerts}

    nodes = ['Kitchen', 'Bathroom', 'Garden', 'Main Line']
    
    # Check Micro-leaks (0.1 to 0.3 L/min sustained)
    if 'micro-leak' not in active_types and SIM_OVERRIDES.get('leak'):
        # For demo, just trigger if the override is set and we see 0.2 flow
        hist = get_history('Kitchen', limit=3) # Assume sustained if found in recent limit
        if any(r['flow_rate'] > 0 for r in hist):
            msg = "Unusual 3AM water flow detected at Kitchen node — 0.2 L/min sustained for 15 minutes. Possible micro-leak in kitchen line. Recommended action: inspect under-sink plumbing."
            add_alert('Kitchen', 'micro-leak', msg, 'warning')
            
    # Check night time anomaly
    # If time is 1am to 5am
    hour = datetime.now().hour
    if 1 <= hour <= 5 and 'night-usage' not in active_types:
        for node in ['Kitchen', 'Bathroom', 'Garden']:
            hist = get_history(node, limit=1)
            if hist and hist[0]['flow_rate'] > 0.5:
                # Trigger night usage alert
                add_alert(node, 'night-usage', f"Night time usage of {hist[0]['flow_rate']} L/min at {node}.", 'warning')
    
    # Check Burst (Pressure drop >30% in under 3 mins)
    if 'burst' not in active_types and SIM_OVERRIDES.get('burst'):
        msg = "Sudden pressure drop >30% detected on Main Line. Possible pipe burst. Immediate action required to prevent flooding and water loss."
        add_alert('Main Line', 'burst', msg, 'critical')
        
    # Check Theft (Discrepancy > 15%)
    if 'theft' not in active_types and SIM_OVERRIDES.get('theft'):
        msg = "Unauthorized usage detected between Main Line inlet and Kitchen outlet. Delta: 0.8 L/min for 7 minutes. Recommend physical inspection of junction B-4."
        add_alert('Main Line', 'theft', msg, 'critical')

    # Water Quality
    if 'quality' not in active_types:
        garden_hist = get_history('Garden', limit=1)
        if garden_hist and garden_hist[0]['ph'] > 8.5:
            # Over 8.5 triggers quality alert
            msg = "pH 9.1 detected at Garden node — slightly alkaline. Safe for irrigation but not drinking. Use for cleaning only."
            add_alert('Garden', 'quality', msg, 'warning')

