import React, { useState } from 'react';
import axios from 'axios';
import { Settings, Bug, Droplets, CloudRain, Star, ShieldAlert } from 'lucide-react';

export default function DemoControls() {
  const [open, setOpen] = useState(false);

  const setOverride = async (key, val) => {
    try {
      await axios.post('http://localhost:5001/api/demo/override', { [key]: val });
    } catch (e) {
      console.error(e);
    }
  };

  const buttons = [
    { label: "Micro Leak", icon: Droplets, action: () => setOverride('leak', true), cancel: () => setOverride('leak', false) },
    { label: "Rupture", icon: ShieldAlert, action: () => setOverride('burst', true), cancel: () => setOverride('burst', false) },
    { label: "Bypass", icon: Bug, action: () => setOverride('theft', true), cancel: () => setOverride('theft', false) },
    { label: "Degrade", icon: Star, action: () => setOverride('low_credit', true), cancel: () => setOverride('low_credit', false) },
    { label: "Storm Emit", icon: CloudRain, action: () => setOverride('rain', true), cancel: () => setOverride('rain', false) }
  ];

  if (!open) {
    return (
      <button 
        onClick={() => setOpen(true)}
        className="fixed bottom-6 left-6 z-50 bg-[#1F2332] hover:bg-[#30364C] text-white p-3 rounded shadow-xl border border-[#30364C] transition-all"
      >
        <Settings className="w-5 h-5 animate-spin-slow" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 left-6 z-50 bg-[#0B0C10] border border-[#1F2332] rounded-lg p-5 shadow-2xl w-80">
      <div className="flex justify-between items-center mb-4 pb-3 border-b border-[#1F2332]">
        <h3 className="font-bold text-slate-300 text-[10px] uppercase tracking-widest flex items-center gap-2">
           <Settings className="w-3.5 h-3.5 text-slate-500" /> CLI Diagnostics
        </h3>
        <button onClick={() => setOpen(false)} className="text-slate-500 hover:text-white">&times;</button>
      </div>
      
      <div className="space-y-2">
         {buttons.map((btn, i) => (
           <div key={i} className="flex gap-2">
             <button 
               onClick={btn.action}
               className="flex-1 bg-[#11131A] hover:bg-[#1A1E29] text-white font-bold tracking-wide text-[10px] uppercase px-3 py-2.5 rounded border border-[#1F2332] flex items-center gap-2"
             >
                <btn.icon className="w-3.5 h-3.5 text-blue-500" /> {btn.label}
             </button>
             <button 
               onClick={btn.cancel}
               className="bg-[#11131A] hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 font-bold uppercase tracking-widest text-[10px] px-3 py-2.5 rounded border border-[#1F2332]"
             >
               Reset
             </button>
           </div>
         ))}
      </div>
    </div>
  );
}
