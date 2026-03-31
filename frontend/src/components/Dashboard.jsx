import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Activity, Droplets, Thermometer, FlaskConical, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { LineChart, Line, Tooltip, ResponsiveContainer } from 'recharts';

const StatusIcon = ({ status }) => {
  if (status === 'critical') return <AlertTriangle className="text-rose-500 w-5 h-5" />;
  if (status === 'warning') return <AlertTriangle className="text-amber-500 w-5 h-5" />;
  return <CheckCircle2 className="text-emerald-500 w-5 h-5 opacity-50" />;
};

const NodeCard = ({ data, history }) => {
  const chartData = history.map(h => ({
    time: new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    flow: h.flow_rate,
    pressure: h.pressure
  }));

  const isAlert = data.status === 'critical' || data.status === 'warning';
  const alertClasses = isAlert ? 'border-amber-500/30 shadow-[inset_0_0_20px_rgba(245,158,11,0.05)]' : '';

  return (
    <div className={`clean-card p-6 flex flex-col gap-5 ${alertClasses}`}>
      <div className="flex justify-between items-center pb-4 border-b border-[#1F2332]">
        <h3 className="text-base font-bold text-white flex items-center gap-3 uppercase tracking-wide">
          {data.node_id === 'Main Line' ? <Activity className="text-blue-500 w-4 h-4" /> : <Droplets className="text-sky-500 w-4 h-4" />}
          {data.node_id}
        </h3>
        <StatusIcon status={data.status} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#0B0C10]/50 p-4 rounded-lg border border-[#1F2332]">
          <div className="text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5" /> Flow
          </div>
          <div className="text-2xl font-bold text-white font-mono">{data.flow_rate.toFixed(1)} <span className="text-xs font-medium text-slate-500 font-sans">L/m</span></div>
        </div>
        <div className="bg-[#0B0C10]/50 p-4 rounded-lg border border-[#1F2332]">
          <div className="text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest flex items-center gap-1.5">
            <Thermometer className="w-3.5 h-3.5" /> Pres
          </div>
          <div className="text-2xl font-bold text-white font-mono">{data.pressure.toFixed(2)} <span className="text-xs font-medium text-slate-500 font-sans">bar</span></div>
        </div>
        
        {data.node_id !== 'Main Line' && (
          <>
            <div className="bg-[#0B0C10]/50 p-4 rounded-lg border border-[#1F2332]">
              <div className="text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest flex items-center gap-1.5">
                <FlaskConical className="w-3.5 h-3.5" /> pH Quality
              </div>
              <div className={`text-xl font-bold font-mono ${data.ph > 8.5 || data.ph < 6.5 ? 'text-amber-500' : 'text-white'}`}>
                {data.ph.toFixed(1)}
              </div>
            </div>
            <div className="bg-[#0B0C10]/50 p-4 rounded-lg border border-[#1F2332]">
              <div className="text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5" /> Turbidity
              </div>
              <div className={`text-xl font-bold font-mono ${data.turbidity > 4 ? 'text-amber-500' : 'text-white'}`}>
                {data.turbidity.toFixed(1)} <span className="text-xs font-medium text-slate-500 font-sans">NTU</span>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="h-28 w-full mt-2 bg-[#0B0C10]/50 rounded-lg p-3 border border-[#1F2332]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <Tooltip 
              contentStyle={{ backgroundColor: '#11131A', border: '1px solid #1F2332', borderRadius: '6px', color: '#fff' }}
              itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
              labelStyle={{ color: '#64748b', fontSize: '10px', textTransform: 'uppercase' }}
            />
            <Line type="monotone" dataKey="flow" stroke="#3b82f6" strokeWidth={2} dot={false} isAnimationActive={false} />
            <Line type="monotone" dataKey="pressure" stroke="#64748b" strokeWidth={1} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const [sensors, setSensors] = useState([]);
  const [history, setHistory] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/sensors');
        setSensors(res.data);
        
        const histData = {};
        for (const node of res.data) {
          const histRes = await axios.get(`http://localhost:5001/api/sensors/history/${node.node_id}`);
          histData[node.node_id] = histRes.data.reverse(); 
        }
        setHistory(histData);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      }
    };
    
    fetchData();
    const int = setInterval(fetchData, 5000);
    return () => clearInterval(int);
  }, []);

  if (sensors.length === 0) return <div className="text-center p-20 text-slate-500 font-mono text-sm uppercase tracking-widest">Polling endpoints...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white uppercase tracking-wide">Monitoring</h2>
        <p className="text-slate-500 mt-1 font-medium text-sm">Real-time status of connected utility endpoints.</p>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {sensors.map((sensor) => (
          <NodeCard key={sensor.node_id} data={sensor} history={history[sensor.node_id] || []} />
        ))}
      </div>
    </div>
  );
}
