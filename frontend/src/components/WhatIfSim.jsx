import React, { useState } from 'react';
import { TreeDeciduous, Droplets, Banknote, ShieldCheck } from 'lucide-react';

export default function WhatIfSim() {
  const [params, setParams] = useState({
    shower_time: 10,
    people: 3,
    watering_freq: 3,
    has_rainwater: false
  });
  
  const SHOWER_LITRES_PER_MIN = 9;
  const GARDEN_LITRES_PER_SESSION = 40;
  const BASE_LITRES_PER_PERSON = 50;
  
  const daily_shower = params.shower_time * SHOWER_LITRES_PER_MIN * params.people;
  const daily_base = BASE_LITRES_PER_PERSON * params.people;
  const daily_garden = (params.watering_freq * GARDEN_LITRES_PER_SESSION) / 7;
  
  let projected_daily = daily_shower + daily_base + daily_garden;
  if (params.has_rainwater) {
    projected_daily -= (daily_garden * 0.8);
  }
  
  const projected_monthly = projected_daily * 30;
  const cost_per_litre = 0.005;
  const projected_cost = projected_monthly * cost_per_litre;
  
  const BASELINE_DAILY = 450;
  const BASELINE_MONTHLY = BASELINE_DAILY * 30;
  const saved_litres = Math.max(0, BASELINE_MONTHLY - projected_monthly);
  let trees = Math.floor(saved_litres / 1000);

  const handleSlider = (e) => {
    setParams({ ...params, [e.target.name]: parseFloat(e.target.value) });
  };

  const handleToggle = () => {
    setParams({ ...params, has_rainwater: !params.has_rainwater });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="border-b border-[#1F2332] pb-6">
        <h2 className="text-2xl font-bold text-white tracking-wide uppercase">Simulation Modeling</h2>
        <p className="text-slate-500 mt-1 font-medium text-sm">Real-time projective computing for utilization scaling.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="clean-card p-8 bg-[#11131A]">
          <h3 className="text-xs font-bold text-slate-400 border-b border-[#1F2332] pb-4 mb-6 uppercase tracking-widest">Control Dimensions</h3>
          
          <div className="space-y-8">
            <div className="space-y-3">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-500 uppercase tracking-widest">Shower Cycle</span>
                <span className="font-bold text-white">{params.shower_time} min</span>
              </div>
              <input 
                type="range" name="shower_time" min="3" max="30" step="1" 
                value={params.shower_time} onChange={handleSlider}
                className="w-full accent-blue-500 h-1.5 bg-[#1F2332] rounded-full appearance-none cursor-pointer"
              />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-500 uppercase tracking-widest">Capita Factor</span>
                <span className="font-bold text-white">{params.people} Pax</span>
              </div>
              <input 
                type="range" name="people" min="1" max="10" step="1" 
                value={params.people} onChange={handleSlider}
                className="w-full accent-blue-500 h-1.5 bg-[#1F2332] rounded-full appearance-none cursor-pointer"
              />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-500 uppercase tracking-widest">Irrigation Cycle</span>
                <span className="font-bold text-white">{params.watering_freq}x / WK</span>
              </div>
              <input 
                type="range" name="watering_freq" min="0" max="7" step="1" 
                value={params.watering_freq} onChange={handleSlider}
                className="w-full accent-blue-500 h-1.5 bg-[#1F2332] rounded-full appearance-none cursor-pointer"
              />
            </div>
            
            <div className="flex items-center justify-between mt-4 p-4 rounded border border-[#1F2332] bg-[#0B0C10]/50">
              <div>
                <span className="text-white text-sm font-bold block tracking-wide">Hydro Harvesting Grid</span>
                <span className="text-[10px] font-semibold text-slate-500 mt-1 uppercase tracking-widest block">Augmenting irrigation supply</span>
              </div>
              <button 
                onClick={handleToggle}
                className={`w-10 h-5 rounded-full transition-colors relative ${params.has_rainwater ? 'bg-blue-500' : 'bg-[#1F2332]'}`}
              >
                <div className={`w-3 h-3 rounded-full bg-white absolute top-1 transition-all ${params.has_rainwater ? 'left-6' : 'left-1'}`}></div>
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4">
             <div className="clean-card p-6 flex flex-col justify-center items-center text-center">
                <Droplets className="text-slate-600 w-6 h-6 mb-3" />
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Volume Forecast</div>
                <div className="text-3xl font-extrabold text-white mt-1 font-mono">{projected_monthly.toFixed(0)} <span className="text-xs text-slate-500 font-sans">L</span></div>
             </div>
             <div className="clean-card p-6 flex flex-col justify-center items-center text-center">
                <Banknote className="text-slate-600 w-6 h-6 mb-3" />
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Financial Yield</div>
                <div className="text-3xl font-extrabold text-white mt-1 font-mono"><span className="text-xs text-slate-500 font-sans">$</span>{projected_cost.toFixed(2)}</div>
             </div>
          </div>
          
          <div className={`clean-card p-6 flex-1 flex flex-col border-t-2 ${saved_litres > 0 ? 'border-t-emerald-500' : 'border-t-rose-500 border-x-rose-500/10 border-b-rose-500/10'}`}>
             <h3 className="text-xs font-bold text-slate-400 flex items-center gap-2 mb-2 uppercase tracking-widest">
                <ShieldCheck className={saved_litres > 0 ? "text-emerald-500 w-4 h-4" : "text-rose-500 w-4 h-4"} />
                Deviation Delta
             </h3>
             
             <div className="flex-1 flex flex-col justify-center mt-2">
                {saved_litres > 0 ? (
                  <div className="flex flex-col gap-3 items-center text-center p-4">
                    <div className="w-12 h-12 rounded-full border border-emerald-500/20 bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-2">
                       <TreeDeciduous className="w-6 h-6" />
                    </div>
                    <div className="text-white text-sm font-medium leading-relaxed max-w-sm">Negative deviation of <span className="font-bold text-emerald-400">-{saved_litres.toFixed(0)}L</span> relative to zone baseline metrics.</div>
                    <div className="text-[10px] font-bold text-emerald-500/70 border border-emerald-500/20 rounded px-3 py-1 uppercase tracking-widest mt-2">
                       Carbon translation: ~{trees} trees
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-4 text-rose-400 p-4 border border-rose-500/20 bg-rose-500/5 rounded">
                    <div className="text-xs font-bold leading-relaxed tracking-wide uppercase">Positive Baseline breach: <br/><span className="text-rose-500 text-lg font-black block mt-1">+{Math.abs(saved_litres).toFixed(0)} L</span></div>
                  </div>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
