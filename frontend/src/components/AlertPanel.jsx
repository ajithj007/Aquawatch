import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertCircle, X, CheckCircle2 } from 'lucide-react';

export default function AlertPanel({ isMainView = true }) {
  const [alerts, setAlerts] = useState([]);

  const fetchAlerts = async () => {
    try {
      const res = await axios.get('https://aquawatch1.onrender.com/api/alerts');
      setAlerts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 5000);
    return () => clearInterval(interval);
  }, []);

  const dismissAlert = async (id) => {
    try {
      await axios.post(`https://aquawatch1.onrender.com/api/alerts/dismiss/${id}`);
      fetchAlerts();
    } catch (err) {
      console.error(err);
    }
  };

  if (!isMainView && alerts.length === 0) return null;

  const content = (
    <div className="space-y-3">
      {alerts.length === 0 ? (
        <div className="text-center p-12 bg-[#11131A] border border-[#1F2332] rounded-xl">
          <CheckCircle2 className="w-10 h-10 mx-auto mb-4 text-emerald-500/50" />
          <h3 className="font-bold text-slate-300 uppercase tracking-wide text-sm">System Secure</h3>
          <p className="text-slate-500 text-xs mt-2">Zero active faults registered.</p>
        </div>
      ) : (
        alerts.map(alert => (
          <div key={alert.id} className={`p-5 rounded-xl border relative shadow-none ${alert.severity === 'critical'
              ? 'bg-[#1A1215] border-rose-500/30'
              : 'bg-[#171511] border-amber-500/30'
            }`}>
            <button
              onClick={() => dismissAlert(alert.id)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white bg-[#0B0C10] p-1.5 rounded-md border border-[#1F2332]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <div className="flex gap-4">
              <div className="mt-1">
                <AlertCircle className={`w-5 h-5 ${alert.severity === 'critical' ? 'text-rose-500' : 'text-amber-500'}`} />
              </div>
              <div className="flex-1 pr-8">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-widest border ${alert.severity === 'critical' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                    {alert.severity}
                  </span>
                  <span className="text-xs font-medium text-slate-500 font-mono">
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <h4 className="font-semibold text-white text-base leading-snug">{alert.message}</h4>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );

  return isMainView ? (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="border-b border-[#1F2332] pb-6">
        <h2 className="text-2xl font-bold text-white tracking-wide uppercase">Incidents</h2>
        <p className="text-slate-500 mt-1 font-medium text-sm">Review queued system warnings and operational faults.</p>
      </div>
      {content}
    </div>
  ) : (
    <div className="bg-[#11131A] border border-[#1F2332] rounded-xl shadow-2xl flex flex-col max-h-[350px]">
      <div className="p-3 border-b border-[#1F2332] flex justify-between items-center bg-[#151821] rounded-t-xl">
        <h3 className="font-bold text-slate-300 flex items-center gap-2 text-[10px] uppercase tracking-widest">
          <AlertCircle className="w-3.5 h-3.5 text-rose-500" /> Anomalies ({alerts.length})
        </h3>
      </div>
      <div className="p-4 overflow-y-auto flex-1 custom-scrollbar">
        {content}
      </div>
    </div>
  );
}
