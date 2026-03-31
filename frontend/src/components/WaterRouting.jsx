import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CloudRain, ArrowRightLeft, AlignVerticalSpaceAround } from 'lucide-react';

export default function WaterRouting() {
  const [weather, setWeather] = useState(null);
  const [tankLevel, setTankLevel] = useState(65);

  const sources = [
    { id: 'municipal', name: 'Municipal Grid', level: 100, cost: '$0.005/L', color: 'blue' },
    { id: 'tank', name: 'Local Reservoir', level: tankLevel, cost: '$0.000/L', color: 'cyan' },
    { id: 'rain', name: 'Catchment Output', level: weather?.will_rain ? 90 : 30, cost: '$0.000/L', color: 'emerald' },
  ];

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await axios.get('https://aquawatch1.onrender.com/api/weather');
        setWeather(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchWeather();
    const interval = setInterval(fetchWeather, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!weather) return <div className="text-center p-20 text-slate-500 font-mono text-sm uppercase tracking-widest">Querying meteorological endpoints...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="border-b border-[#1F2332] pb-6">
        <h2 className="text-2xl font-bold text-white tracking-wide uppercase">Topology Logic</h2>
        <p className="text-slate-500 mt-1 font-medium text-sm">Automated logic enforcing physical routing constraints.</p>
      </div>

      {weather.will_rain ? (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CloudRain className="w-5 h-5 text-emerald-500" />
            <span className="font-bold text-emerald-400 text-sm tracking-wide uppercase">Weather Override ({weather.expected_rain_mm}mm precipitation incoming)</span>
          </div>
        </div>
      ) : (
        <div className="bg-[#11131A] border border-[#1F2332] rounded p-4 flex items-center justify-between">
          <div className="flex items-center gap-3 text-slate-400">
            <CloudRain className="w-5 h-5" />
            <span className="font-bold font-mono text-xs uppercase tracking-widest">Sky clear. Utilizing stored volume.</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="clean-card p-6">
          <h3 className="text-xs font-bold text-slate-500 border-b border-[#1F2332] pb-4 mb-6 flex items-center gap-2 uppercase tracking-widest">
            <AlignVerticalSpaceAround className="w-4 h-4 text-slate-400" /> Intake Capacity
          </h3>

          <div className="space-y-6">
            {sources.map(src => (
              <div key={src.id} className="p-4 rounded border border-[#1F2332] bg-[#0B0C10]/50 relative">
                <div className="flex justify-between mb-3 text-sm">
                  <div className="font-bold text-slate-300 tracking-wide uppercase">{src.name}</div>
                  <div className={`font-mono font-bold text-${src.color}-400`}>{src.level}%</div>
                </div>

                <div className="h-1.5 w-full bg-[#1F2332] rounded overflow-hidden">
                  <div
                    className={`h-full rounded bg-${src.color}-500 transition-all duration-1000`}
                    style={{ width: `${src.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-4 border-t border-[#1F2332]">
            <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-3 uppercase tracking-widest">
              <span>Simulate Local Fill</span>
              <span className="text-white font-mono">{tankLevel}%</span>
            </div>
            <input
              type="range" min="0" max="100"
              value={tankLevel} onChange={(e) => setTankLevel(parseInt(e.target.value))}
              className="w-full accent-cyan-500 h-1.5 bg-[#1F2332] rounded appearance-none cursor-pointer"
            />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="clean-card p-6 flex-1">
            <h3 className="text-xs font-bold text-slate-500 flex items-center gap-2 mb-6 border-b border-[#1F2332] pb-4 uppercase tracking-widest">
              <ArrowRightLeft className="w-4 h-4 text-slate-400" /> Directive Matrices
            </h3>

            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-[#0B0C10]/80 p-4 rounded border border-[#1F2332]">
                <div className="w-32 text-slate-400 font-bold text-[10px] uppercase tracking-widest">Potable Zone</div>
                <ArrowRightLeft className="w-4 h-4 text-slate-600" />
                <div className="flex-1 text-blue-400 text-xs font-bold uppercase tracking-widest text-right">
                  Municipal Strict
                </div>
              </div>

              <div className="flex items-center gap-4 bg-[#0B0C10]/80 p-4 rounded border border-[#1F2332]">
                <div className="w-32 text-slate-400 font-bold text-[10px] uppercase tracking-widest">Wash Systems</div>
                <ArrowRightLeft className="w-4 h-4 text-slate-600" />
                <div className="flex-1 text-cyan-400 text-xs font-bold uppercase tracking-widest text-right flex flex-col items-end">
                  Local Reservoir <span className="text-[9px] text-slate-600">(Failover: Grid)</span>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-[#0B0C10]/80 p-4 rounded border border-[#1F2332]">
                <div className="w-32 text-slate-400 font-bold text-[10px] uppercase tracking-widest">Irrigation Grid</div>
                <ArrowRightLeft className="w-4 h-4 text-slate-600" />
                {weather.will_rain ? (
                  <div className="flex-1 text-slate-600 text-xs font-bold uppercase tracking-widest text-right flex flex-col items-end">
                    <span className="line-through decoration-rose-500/50">Catchment</span>
                    <span className="text-[9px] text-rose-500/70">Hard Lock: Rain</span>
                  </div>
                ) : (
                  <div className="flex-1 text-emerald-400 text-xs font-bold uppercase tracking-widest text-right flex flex-col items-end">
                    Catchment <span className="text-[9px] text-slate-600">(Failover: Reservoir)</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
