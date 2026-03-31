import React, { useEffect, useState, useRef } from 'react';
import './Landing.css';

export default function Landing({ onEnter }) {
  const [flowVal, setFlowVal] = useState(284);
  const [bars, setBars] = useState([40, 55, 70, 50, 80, 65, 85]);
  const observerRef = useRef(null);

  useEffect(() => {
    // Flow value & bar animation
    const intervalId = setInterval(() => {
      setFlowVal(260 + Math.round(Math.random() * 60));
      setBars(prev => prev.map(() => 35 + Math.round(Math.random() * 55)));
    }, 2200);

    // Scroll observer
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
        }
      });
    }, { threshold: 0.15 });

    const items = document.querySelectorAll('.fade-item');
    items.forEach(el => observerRef.current.observe(el));

    return () => {
      clearInterval(intervalId);
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return (
    <div className="landing-page">
      {/* NAV */}
      <nav>
        <div className="nav-logo">AquaWatch</div>
        <div className="nav-links">
          <a href="#">Overview</a>
          <a href="#">Features</a>
          <a href="#">How it works</a>
          <a href="#">Analytics</a>
          <a href="#">Pricing</a>
        </div>
        <button className="nav-cta" onClick={onEnter}>Launch Dashboard</button>
      </nav>

      {/* HERO */}
      <section className="hero">
        <p className="hero-eyebrow">Smart Water Management</p>
        <h1>Every drop.<br />Accounted for.</h1>
        <p>AquaWatch uses AI-powered sensors and real-time analytics to help cities and industries save water, detect leaks instantly, and build a sustainable future.</p>
        <div className="hero-btns">
          <button className="btn-primary" onClick={onEnter}>Launch Dashboard →</button>
          <button className="btn-ghost">Learn more</button>
        </div>
      </section>

      {/* ANIMATED WAVE SVG */}
      <div className="wave-wrap">
        <svg width="100%" height="180" viewBox="0 0 1440 180" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="wg" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0071e3" stopOpacity="0.25"/>
              <stop offset="100%" stopColor="#0071e3" stopOpacity="0.03"/>
            </linearGradient>
          </defs>
          <path d="M0,80 C240,140 480,20 720,80 C960,140 1200,20 1440,80 L1440,180 L0,180 Z" fill="url(#wg)">
            <animate attributeName="d" dur="6s" repeatCount="indefinite"
              values="
                M0,80 C240,140 480,20 720,80 C960,140 1200,20 1440,80 L1440,180 L0,180 Z;
                M0,60 C200,120 480,30 720,70 C960,110 1240,40 1440,90 L1440,180 L0,180 Z;
                M0,80 C240,140 480,20 720,80 C960,140 1200,20 1440,80 L1440,180 L0,180 Z
              "/>
          </path>
          <path d="M0,100 C180,60 400,140 720,100 C1040,60 1260,130 1440,100 L1440,180 L0,180 Z" fill="rgba(0,113,227,0.12)">
            <animate attributeName="d" dur="8s" repeatCount="indefinite"
              values="
                M0,100 C180,60 400,140 720,100 C1040,60 1260,130 1440,100 L1440,180 L0,180 Z;
                M0,90 C220,130 440,50 720,110 C1000,50 1280,120 1440,90 L1440,180 L0,180 Z;
                M0,100 C180,60 400,140 720,100 C1040,60 1260,130 1440,100 L1440,180 L0,180 Z
              "/>
          </path>
        </svg>
      </div>

      {/* STATS */}
      <div className="stats-band">
        <div className="stat-item fade-item">
          <div className="stat-num">40%</div>
          <div className="stat-label">Average water savings</div>
        </div>
        <div className="stat-item fade-item">
          <div className="stat-num">&lt;2s</div>
          <div className="stat-label">Leak detection time</div>
        </div>
        <div className="stat-item fade-item">
          <div className="stat-num">99.8%</div>
          <div className="stat-label">System uptime</div>
        </div>
        <div className="stat-item fade-item">
          <div className="stat-num">500+</div>
          <div className="stat-label">Cities deployed</div>
        </div>
      </div>

      {/* FEATURES */}
      <section className="features">
        <div className="section-header fade-item">
          <p className="section-eyebrow">Features</p>
          <h2 className="section-title">Built for the planet.<br />Designed for people.</h2>
          <p className="section-sub">From municipal pipelines to industrial facilities, AquaWatch gives you complete control.</p>
        </div>
        <div className="features-grid">
          <div className="feat-card wide fade-item">
            <div className="feat-icon icon-blue">💧</div>
            <div className="feat-title">Real-time leak detection</div>
            <div className="feat-desc">Ultrasonic sensors and ML models pinpoint leaks within 2 seconds, anywhere in your network — no manual inspections required.</div>
            <span className="feat-tag">AI-powered</span>
          </div>
          <div className="feat-card fade-item">
            <div className="feat-icon icon-teal">📊</div>
            <div className="feat-title">Usage analytics</div>
            <div className="feat-desc">Granular dashboards show consumption patterns, anomalies, and forecasts across zones and time ranges.</div>
            <span className="feat-tag">Live data</span>
          </div>
          <div className="feat-card fade-item">
            <div className="feat-icon icon-green">🌱</div>
            <div className="feat-title">Sustainability reports</div>
            <div className="feat-desc">Automated ESG-ready reports track your carbon and water footprint. Share with stakeholders in one click.</div>
            <span className="feat-tag">Auto-generated</span>
          </div>
          <div className="feat-card fade-item">
            <div className="feat-icon icon-orange">🔔</div>
            <div className="feat-title">Smart alerts</div>
            <div className="feat-desc">Threshold-based and predictive alerts sent to your team via SMS, email, or Slack before issues escalate.</div>
            <span className="feat-tag">Configurable</span>
          </div>
          <div className="feat-card fade-item">
            <div className="feat-icon icon-purple">🔗</div>
            <div className="feat-title">API & integrations</div>
            <div className="feat-desc">Connect with SCADA, ERP, and GIS systems out of the box. REST and MQTT support included.</div>
            <span className="feat-tag">Developer friendly</span>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="howitworks">
        <div className="section-header fade-item">
          <p className="section-eyebrow" style={{color: 'var(--blue)'}}>How it works</p>
          <h2 className="section-title" style={{color: '#fff'}}>Simple. Powerful. Smart.</h2>
          <p className="section-sub" style={{color: 'rgba(255,255,255,0.5)'}}>Deploy in days, not months. Our four-step approach gets your network intelligent fast.</p>
        </div>
        <div className="steps fade-item">
          <div className="step">
            <div className="step-num">Step 01</div>
            <div className="step-title">Install sensors</div>
            <div className="step-desc">Non-invasive IoT sensors clip onto existing pipes — no digging, no downtime.</div>
          </div>
          <div className="step">
            <div className="step-num">Step 02</div>
            <div className="step-title">Connect to cloud</div>
            <div className="step-desc">Sensors stream data over secure LTE or LoRaWAN to AquaWatch's edge servers.</div>
          </div>
          <div className="step">
            <div className="step-num">Step 03</div>
            <div className="step-title">AI analyzes flow</div>
            <div className="step-desc">Our ML engine builds a baseline and flags anomalies in real time, 24/7.</div>
          </div>
          <div className="step">
            <div className="step-title">You take action</div>
            <div className="step-desc">The dashboard and alerts guide your team to the exact issue — fast and precisely.</div>
          </div>
        </div>
      </section>

      {/* SPOTLIGHT */}
      <section className="spotlight">
        <div className="spotlight-inner">
          <div className="spotlight-text fade-item">
            <p style={{fontSize: '12px', fontWeight: 600, color: 'var(--blue)', letterSpacing: '0.6px', textTransform: 'uppercase', marginBottom: '14px'}}>Live Dashboard</p>
            <h2>Your entire water network.<br />One screen.</h2>
            <p>See flow rates, pressure readings, usage heatmaps, and anomaly flags — all in a single unified view designed for water operators.</p>
            <button className="btn-primary" onClick={onEnter}>View live demo →</button>
          </div>
          <div className="spotlight-visual fade-item" id="dashboard-card">
            <div className="svi-header">Flow rate · Zone A-3</div>
            <div><span className="svi-value" id="flow-val">{flowVal}</span><span className="svi-unit">L/min</span></div>
            <div className="svi-bars" id="bar-chart">
              {bars.map((h, i) => (
                <div key={i} className={`svi-bar ${i === bars.length - 1 ? 'active' : ''}`} style={{height: `${h}%`}}></div>
              ))}
            </div>
            <div className="svi-label"><span>6h ago</span><span>Now</span></div>
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="testimonial">
        <blockquote className="fade-item">"AquaWatch helped us reduce non-revenue water loss by 38% in the first quarter. The leak detection alone paid for the entire deployment."</blockquote>
        <cite className="fade-item">— Director of Infrastructure, Metropolitan Water Authority</cite>
      </section>

      {/* CTA FOOTER */}
      <section className="cta-footer fade-item">
        <h2>Water is precious.<br />Treat it that way.</h2>
        <p>Join 500+ cities and enterprises managing water smarter with AquaWatch.</p>
        <button className="btn-primary" style={{fontSize: '16px', padding: '15px 36px'}} onClick={onEnter}>Launch Dashboard Now</button>
        <div className="footer-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Documentation</a>
          <a href="#">Contact</a>
          <a href="#">© 2025 AquaWatch Inc.</a>
        </div>
      </section>
    </div>
  );
}
