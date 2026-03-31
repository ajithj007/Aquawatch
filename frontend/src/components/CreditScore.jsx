import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Award, Zap, AlertTriangle, Clock, CloudRain } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function CreditScore() {
  const [scoreData, setScoreData] = useState(null);

  useEffect(() => {
    const fetchScore = async () => {
      try {
        const res = await axios.get('https://aquawatch-1.onrender.com');
        setScoreData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchScore();
    const interval = setInterval(fetchScore, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!scoreData) return <div className="text-center p-20 text-slate-500 font-mono text-sm uppercase tracking-widest">Compiling Metrics...</div>;

  const scoreColor = scoreData.score >= 75 ? '#10b981' : scoreData.score >= 50 ? '#f59e0b' : '#ef4444';
  const data = [
    { name: 'Score', value: scoreData.score },
    { name: 'Remaining', value: 100 - scoreData.score }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="border-b border-[#1F2332] pb-6">
        <h2 className="text-2xl font-bold text-white tracking-wide uppercase">Credit Score</h2>
        <p className="text-slate-500 mt-1 font-medium text-sm">Aggregate efficiency rating based on multiple usage dimensions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Score Gauge */}
        <div className="clean-card p-8 col-span-1 md:col-span-1 flex flex-col items-center justify-center">
          <h3 className="text-[10px] font-bold text-slate-500 mb-6 uppercase tracking-widest">Calculated Performance</h3>

          <div className="w-52 h-52 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={100}
                  startAngle={180}
                  endAngle={0}
                  dataKey="value"
                  stroke="none"
                >
                  <Cell fill={scoreColor} />
                  <Cell fill="#1F2332" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center -mt-6">
              <span className="text-5xl font-black text-white">{scoreData.score}</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">/ 100</span>
            </div>
          </div>

          <div className={`mt-2 px-4 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest border bg-[#0B0C10]`} style={{ color: scoreColor, borderColor: `${scoreColor}40` }}>
            {scoreData.score >= 75 ? 'Optimal' : scoreData.score >= 50 ? 'Substandard' : 'Critical Decrease'}
          </div>
        </div>

        {/* Breakdown */}
        <div className="clean-card p-6 col-span-1 md:col-span-2 grid grid-cols-2 gap-4">
          <h3 className="col-span-2 text-[10px] font-bold text-slate-500 border-b border-[#1F2332] pb-3 mb-2 uppercase tracking-widest">Dimension Analytics</h3>

          <div className="bg-[#0B0C10]/50 p-4 rounded-lg border border-[#1F2332] flex items-center gap-4">
            <div className="w-10 h-10 rounded border border-[#1F2332] bg-[#11131A] flex items-center justify-center">
              <Zap className="text-blue-500 w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Volumetric Efficiency</div>
              <div className="text-xl font-bold text-white font-mono">{scoreData.efficiency_score} <span className="text-[10px] text-slate-500 font-sans">/ 25</span></div>
            </div>
          </div>

          <div className="bg-[#0B0C10]/50 p-4 rounded-lg border border-[#1F2332] flex items-center gap-4">
            <div className="w-10 h-10 rounded border border-[#1F2332] bg-[#11131A] flex items-center justify-center">
              <AlertTriangle className="text-rose-500 w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Leak Penalty</div>
              <div className="text-xl font-bold text-white font-mono">{scoreData.leak_score} <span className="text-[10px] text-slate-500 font-sans">/ 25</span></div>
            </div>
          </div>

          <div className="bg-[#0B0C10]/50 p-4 rounded-lg border border-[#1F2332] flex items-center gap-4">
            <div className="w-10 h-10 rounded border border-[#1F2332] bg-[#11131A] flex items-center justify-center">
              <Clock className="text-amber-500 w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Peak Shift Rating</div>
              <div className="text-xl font-bold text-white font-mono">{scoreData.peak_score} <span className="text-[10px] text-slate-500 font-sans">/ 25</span></div>
            </div>
          </div>

          <div className="bg-[#0B0C10]/50 p-4 rounded-lg border border-[#1F2332] flex items-center gap-4">
            <div className="w-10 h-10 rounded border border-[#1F2332] bg-[#11131A] flex items-center justify-center">
              <CloudRain className="text-emerald-500 w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Harvesting Offset</div>
              <div className="text-xl font-bold text-white font-mono">{scoreData.rain_score} <span className="text-[10px] text-slate-500 font-sans">/ 25</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
