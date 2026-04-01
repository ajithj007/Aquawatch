# AquaWatch: Intelligent Water Management & Conservation

## Problem Statement
Water scarcity is reaching critical levels globally, yet billions of gallons are lost annually due to undetected micro-leaks, inefficient irrigation during rain events, and a general lack of visibility for consumers. Current meters are passive and don't provide the real-time, granular data needed to make informed conservation decisions or detect hazardous anomalies like pipe bursts before major damage occurs.

## Project Description
AquaWatch is a state-of-the-art water intelligence platform designed for the modern smart home. It transforms passive plumbing into an active, self-monitoring network. Using a Python-based synthetic data simulator and a React-powered dashboard, it provides:

1.  **Real-Time Telemetry**: Granular monitoring of flow rate, pressure, pH, and turbidity across various household nodes.
2.  **Autonomous Anomaly Detection**: Logic-driven detection of micro-leaks, bursts, and unauthorized night usage.
3.  **Meteorological Overrides**: Integration with real-time weather APIs to automatically halt irrigation and switch routing when precipitation is detected.
4.  **Community Benchmarking**: Macro-level visibility to compare household usage with community averages, promoting collective conservation.
5.  **Water Credit System**: A gamified scoring system that rewards efficient consumption and high leak-free uptime.

---

## Google AI Usage
### Tools / Models Used
- **Gemini 1.5 Pro**: Used as the core architect for design, simulation logic, and UI generation.
- **Google AI Studio / Gemini API**: Integrated as a placeholder for upcoming "Smart Assistant" and Anomaly Insight features in the dashboard.

### How Google AI Was Used
Google's Gemini model was used extensively as a **Pair Programmer and Design Architect** to:
- **Generate Synthetic Water Patterns**: AI was used to design the complex randomized simulator that models different usage modes (Kitchen vs. Bathroom) and edge-case anomalies (leaks/bursts).
- **Premium UI/UX Design**: Every component, from the Glassmorphic charts to the high-contrast dark theme, was iterated and polished using AI-driven design principles to ensure a world-class user experience.
- **Optimized Data Pipeline**: AI assisted in crafting the high-performance consolidated API endpoints and SQL indexing strategies that allow the dashboard to update in real-time without latency.

---

## Proof of Google AI Usage
Attach screenshots in a `/proof` folder:

![AI Design Iterations](./proof/ai_design_drafts.png)
*Initial UI concepts generated and refined via Google AI.*

---

## Screenshots 
Add project screenshots:

![Dashboard Monitor](./assets/monitor_view.png)  
![Topology Routing](./assets/topology_logic.png)

---

## Demo Video
Upload your demo video to Google Drive and paste the shareable link here(max 3 minutes).
[Watch AquaWatch Demo](#)

---

## Installation Steps

### 1. Prerequisites
- Python 3.10+
- Node.js 18+

### 2. Backend Setup
```bash
cd backend
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the backend
python app.py
```

### 3. Frontend Setup
```bash
cd frontend
# Install dependencies
npm install

# Run the dashboard
npm run dev
```
By default, the dashboard will be available at `http://localhost:5173`.
