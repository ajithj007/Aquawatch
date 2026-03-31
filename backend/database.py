import sqlite3
import os
import json
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), 'aquawatch.db')

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    c = conn.cursor()
    
    c.execute('''
        CREATE TABLE IF NOT EXISTS sensor_readings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            node_id TEXT,
            flow_rate REAL,
            pressure REAL,
            ph REAL,
            turbidity REAL,
            status TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    c.execute('''
        CREATE TABLE IF NOT EXISTS alerts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            node_id TEXT,
            alert_type TEXT,
            message TEXT,
            severity TEXT,
            dismissed INTEGER DEFAULT 0,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    c.execute('''
        CREATE TABLE IF NOT EXISTS water_budget (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            daily_limit_litres REAL,
            current_usage REAL,
            date TEXT
        )
    ''')

    c.execute('''
        CREATE TABLE IF NOT EXISTS credit_score (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            score INTEGER,
            efficiency_score INTEGER,
            leak_score INTEGER,
            peak_score INTEGER,
            rain_score INTEGER,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    c.execute('''
        CREATE TABLE IF NOT EXISTS community_houses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            house_name TEXT,
            daily_usage REAL,
            last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Initialize some default data if empty
    c.execute('SELECT COUNT(*) FROM community_houses')
    if c.fetchone()[0] == 0:
        houses = [
            ('House A', 140.5),
            ('House B', 160.2),
            ('House C', 135.0),
            ('House D', 180.0),
            ('House E', 150.0)
        ]
        c.executemany('INSERT INTO community_houses (house_name, daily_usage) VALUES (?, ?)', houses)
        
    c.execute('SELECT COUNT(*) FROM water_budget')
    if c.fetchone()[0] == 0:
        c.execute('INSERT INTO water_budget (daily_limit_litres, current_usage, date) VALUES (?, ?, ?)',
                  (150.0, 0.0, datetime.now().strftime('%Y-%m-%d')))
                  
    c.execute('SELECT COUNT(*) FROM credit_score')
    if c.fetchone()[0] == 0:
        c.execute('INSERT INTO credit_score (score, efficiency_score, leak_score, peak_score, rain_score) VALUES (?, ?, ?, ?, ?)',
                  (85, 20, 25, 20, 20))

    conn.commit()
    conn.close()

def insert_reading(node_id, flow_rate, pressure, ph, turbidity, status):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute('''
        INSERT INTO sensor_readings (node_id, flow_rate, pressure, ph, turbidity, status)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (node_id, flow_rate, pressure, ph, turbidity, status))
    conn.commit()
    conn.close()

def get_latest_readings():
    conn = get_db_connection()
    c = conn.cursor()
    c.execute('''
        SELECT n.node_id, r.flow_rate, r.pressure, r.ph, r.turbidity, r.status, r.timestamp
        FROM (SELECT DISTINCT node_id FROM sensor_readings) n
        JOIN sensor_readings r ON n.node_id = r.node_id
        WHERE r.id = (
            SELECT MAX(id) FROM sensor_readings WHERE node_id = n.node_id
        )
    ''')
    rows = c.fetchall()
    conn.close()
    return [dict(ix) for ix in rows]

def get_history(node_id, limit=20):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute('''
        SELECT * FROM sensor_readings
        WHERE node_id = ?
        ORDER BY timestamp DESC
        LIMIT ?
    ''', (node_id, limit))
    rows = c.fetchall()
    conn.close()
    # Reverse to get chronological order
    return [dict(ix) for ix in reversed(rows)]

def add_alert(node_id, alert_type, message, severity):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute('''
        INSERT INTO alerts (node_id, alert_type, message, severity)
        VALUES (?, ?, ?, ?)
    ''', (node_id, alert_type, message, severity))
    conn.commit()
    conn.close()

def get_alerts():
    conn = get_db_connection()
    c = conn.cursor()
    c.execute('SELECT * FROM alerts WHERE dismissed = 0 ORDER BY timestamp DESC')
    rows = c.fetchall()
    conn.close()
    return [dict(ix) for ix in rows]

def dismiss_alert(alert_id):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute('UPDATE alerts SET dismissed = 1 WHERE id = ?', (alert_id,))
    conn.commit()
    conn.close()

def get_credit_score():
    conn = get_db_connection()
    c = conn.cursor()
    c.execute('SELECT * FROM credit_score ORDER BY timestamp DESC LIMIT 1')
    row = c.fetchone()
    conn.close()
    return dict(row) if row else None

def get_community_data():
    conn = get_db_connection()
    c = conn.cursor()
    c.execute('SELECT * FROM community_houses')
    rows = c.fetchall()
    conn.close()
    return [dict(ix) for ix in rows]

def get_budget():
    conn = get_db_connection()
    c = conn.cursor()
    today = datetime.now().strftime('%Y-%m-%d')
    c.execute('SELECT * FROM water_budget WHERE date = ? ORDER BY id DESC LIMIT 1', (today,))
    row = c.fetchone()
    if not row:
        c.execute('SELECT * FROM water_budget ORDER BY id DESC LIMIT 1')
        last_budget = c.fetchone()
        limit = last_budget['daily_limit_litres'] if last_budget else 150.0
        c.execute('INSERT INTO water_budget (daily_limit_litres, current_usage, date) VALUES (?, ?, ?)', (limit, 0.0, today))
        conn.commit()
        c.execute('SELECT * FROM water_budget WHERE date = ? ORDER BY id DESC LIMIT 1', (today,))
        row = c.fetchone()
    conn.close()
    return dict(row)

def set_budget(limit):
    conn = get_db_connection()
    c = conn.cursor()
    today = datetime.now().strftime('%Y-%m-%d')
    c.execute('UPDATE water_budget SET daily_limit_litres = ? WHERE date = ?', (limit, today))
    if c.rowcount == 0:
        c.execute('INSERT INTO water_budget (daily_limit_litres, current_usage, date) VALUES (?, ?, ?)', (limit, 0.0, today))
    conn.commit()
    conn.close()

def add_usage(litres):
    conn = get_db_connection()
    c = conn.cursor()
    today = datetime.now().strftime('%Y-%m-%d')
    c.execute('UPDATE water_budget SET current_usage = current_usage + ? WHERE date = ?', (litres, today))
    conn.commit()
    conn.close()

if __name__ == '__main__':
    init_db()
