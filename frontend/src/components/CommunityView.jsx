import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, BarChart3, AlertCircle, LocateFixed } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function CommunityView() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        const res = await axios.get('https://aquawatch1.onrender.com/api/community');
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCommunity();
    const interval = setInterval(fetchCommunity, 10000);
    return () => clearInterval(interval);
  }, []);

  if (data.length === 0) return <div className="text-center p-20 text-slate-500 font-mono text-sm uppercase tracking-widest">Polling sector grid...</div>;

  const avg = data.reduce((acc, curr) => acc + curr.daily_usage, 0) / data.length;
  const flaggedThreshold = avg * 1.25;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="border-b border-[#1F2332] pb-6">
        <h2 className="text-2xl font-bold text-white tracking-wide uppercase">Macro View</h2>
        <p className="text-slate-500 mt-1 font-medium text-sm">Neighborhood density mapping and comparative flow analysis.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="clean-card p-8 lg:col-span-2">
          <div className="flex justify-between items-center mb-6 border-b border-[#1F2332] pb-4">
            <h3 className="text-xs font-bold text-slate-400 flex items-center gap-2 uppercase tracking-widest">
              <BarChart3 className="text-blue-500 w-4 h-4" /> Load Distribution Array
            </h3>
            <div className="text-[10px] bg-blue-500/10 text-blue-400 px-3 py-1 rounded font-bold border border-blue-500/20 tracking-widest uppercase">
              Mean: {avg.toFixed(1)} L/D
            </div>
          </div>

          <div className="h-80 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} barSize={32}>
                <XAxis dataKey="house_name" stroke="#64748b" tick={{ fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: '#1F2332' }}
                  contentStyle={{ backgroundColor: '#0B0C10', borderColor: '#30364C', borderRadius: '4px', border: '1px solid #1F2332' }}
                  itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                />
                <Bar dataKey="daily_usage" radius={[2, 2, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.daily_usage > flaggedThreshold ? '#ef4444' : '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="clean-card p-6 h-full flex flex-col">
            <h3 className="text-xs font-bold text-slate-400 flex items-center gap-2 mb-4 border-b border-[#1F2332] pb-3 uppercase tracking-widest">
              <LocateFixed className="text-slate-500 w-4 h-4" /> Outlier Matrix
            </h3>
            <ul className="space-y-2 mt-2 flex-1">
              {data.map((house) => {
                const isFlagged = house.daily_usage > flaggedThreshold;
                return (
                  <li key={house.id} className="flex justify-between items-center p-3 rounded bg-[#0B0C10]/50 border border-[#1F2332]">
                    <span className="text-slate-300 font-medium text-xs tracking-wide">{house.house_name}</span>
                    {isFlagged ? (
                      <span className="flex items-center gap-1.5 text-rose-500 font-bold bg-rose-500/10 px-2 py-0.5 rounded text-[10px] tracking-widest border border-rose-500/20 uppercase">
                        <AlertCircle className="w-3 h-3" /> Flagged
                      </span>
                    ) : (
                      <span className="text-slate-500 font-bold text-[10px] tracking-widest uppercase">Nominal</span>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
