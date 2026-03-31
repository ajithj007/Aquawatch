# AquaWatch
**AI-Powered Smart Water Management System**

AquaWatch is an intelligent water decision system that predicts anomalies, influences water conservation, optimizes multi-source routing, and provides community-level intelligence — all utilizing the power of Google Gemini AI.

## Features
1. **Live Sensor Dashboard**: Real-time telemetry for household nodes.
2. **Predictive Analytics**: Detect micro-leaks or sudden bursts using historic data context.
3. **Smart AI Diagnostics**: Gemini AI translates sensor anomalies into automated actionable advice.
4. **Water Credit Score**: Multidimensional behavior score with AI-generated improvement tasks.
5. **Community Grid Intel**: Compare water usage with neighbors to spot area anomalies.
6. **Smart Routing**: Combines forecast data (Open-Meteo) with Rainwater storage, routing intelligently.
7. **What-If Simulation**: Predictive conservation and cost modeling with AI feedback.

## Tech Stack
- Frontend: React (Vite) + TailwindCSS + Recharts + Lucide
- Backend: Flask, SQLite
- AI Integration: `google-generativeai` (Gemini 1.5 Flash)

## Setup Instructions

### 1. Gemini AI API Key
Create a `.env` file in the `backend` directory:
```
GEMINI_API_KEY=your_gemini_api_key_here
```

### 2. Backend Setup
```bash
cd backend
pip install -r requirements.txt
python3 app.py
```
The Flask server will start on `http://localhost:5000`.

### 3. Frontend Setup
In a new terminal:
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

## Demo Considerations
To access the hidden "Demo Controls" panel, open the app with the URL parameter `?demo=true`.
Example: `http://localhost:5173/?demo=true`
This allows you to instantly simulate micro-leaks, bursts, quality anomalies, API rain data, and more for presentation.
