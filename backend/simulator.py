import random
import time
from database import insert_reading, add_usage

nodes = ['Kitchen', 'Bathroom', 'Garden', 'Main Line']
node_states = {
    'Kitchen': {'flow_rate': 0.0, 'pressure': 2.5, 'ph': 7.0, 'turbidity': 1.0, 'status': 'normal'},
    'Bathroom': {'flow_rate': 0.0, 'pressure': 2.5, 'ph': 7.0, 'turbidity': 1.0, 'status': 'normal'},
    'Garden': {'flow_rate': 0.0, 'pressure': 2.5, 'ph': 7.0, 'turbidity': 1.0, 'status': 'normal'},
    'Main Line': {'flow_rate': 0.0, 'pressure': 3.0, 'ph': 7.0, 'turbidity': 1.0, 'status': 'normal'}
}

# Global overrides for demo purposes
SIM_OVERRIDES = {
    'leak': False,
    'burst': False,
    'theft': False,
    'emergency': False,
    'low_credit': False,
    'rain': False
}

def generate_base_readings():
    if SIM_OVERRIDES['emergency']:
        for n in nodes:
            node_states[n]['flow_rate'] = 0.0
            node_states[n]['pressure'] = 0.0
            node_states[n]['status'] = 'OFFLINE'
        return node_states
        
    for node in nodes:
        # Base realistic variations
        if node == 'Main Line':
            base_flow = sum(node_states[n]['flow_rate'] for n in ['Kitchen', 'Bathroom', 'Garden']) 
            if SIM_OVERRIDES['theft']:
                base_flow += 0.8  # Extra unmeasured flow
            
            node_states[node]['flow_rate'] = base_flow
            node_states[node]['pressure'] = 3.0 + random.uniform(-0.1, 0.1)
            node_states[node]['status'] = 'normal'
        else:
            # Random occasional usage
            if random.random() < 0.2:
                node_states[node]['flow_rate'] = random.uniform(2.0, 5.0)
            else:
                node_states[node]['flow_rate'] = 0.0
                
            node_states[node]['pressure'] = 2.5 + random.uniform(-0.1, 0.1)
            node_states[node]['ph'] = 7.0 + random.uniform(-0.2, 0.2)
            node_states[node]['turbidity'] = 1.0 + random.uniform(0.0, 0.5)
            node_states[node]['status'] = 'normal'

    # Overrides
    if SIM_OVERRIDES['leak']:
        node_states['Kitchen']['flow_rate'] = 0.2
        node_states['Kitchen']['status'] = 'warning'

    if SIM_OVERRIDES['burst']:
        node_states['Main Line']['pressure'] = 1.5
        node_states['Main Line']['status'] = 'critical'
        
    # pH anomaly demo (sometimes requested by quality check)
    if random.random() < 0.1:
        node_states['Garden']['ph'] = 9.1
        node_states['Garden']['status'] = 'warning'

    return node_states

def simulate_cycle():
    states = generate_base_readings()
    total_new_usage = 0
    for node, data in states.items():
        insert_reading(node, data['flow_rate'], data['pressure'], data['ph'], data['turbidity'], data['status'])
        if node != 'Main Line':
            # Integrate flow rate (L/min) over 5 seconds (5/60 min)
            total_new_usage += data['flow_rate'] * (5.0 / 60.0)
            
    if total_new_usage > 0:
        add_usage(total_new_usage)
    return states
