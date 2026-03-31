import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LayoutDashboard, Bell, Activity, Users, Settings2, ShieldAlert, Navigation, Droplets } from 'lucide-react';

import Dashboard from './components/Dashboard';
import AlertPanel from './components/AlertPanel';
import CreditScore from './components/CreditScore';
import CommunityView from './components/CommunityView';
import WhatIfSim from './components/WhatIfSim';
import WaterRouting from './components/WaterRouting';
import EmergencyMode from './components/EmergencyMode';
import DemoControls from './components/DemoControls';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [budgetData, setBudgetData] = useState({ current_usage: 0, daily_limit_litres: 150 });
  const isDemo = window.location.search.includes('demo=true');
  const [systemOffline, setSystemOffline] = useState(false);

  useEffect(() => {

    const fetchBudget = async () => {
      try {
        const res = await axios.get('https://aquawatch-1.onrender.com/api/budget/today');
        setBudgetData(res.data);
      } catch (err) {
        console.error('Error fetching budget:', err);
      }
    };
    fetchBudget();
    const interval = setInterval(fetchBudget, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleOfflineMode = (offline) => {
    setSystemOffline(offline);
  };

  const navItems = [
    { id: 'dashboard', label: 'Monitor', icon: LayoutDashboard },
    { id: 'alerts', label: 'Incidents', icon: Bell },
    { id: 'credit', label: 'Credit', icon: Activity },
    { id: 'community', label: 'Macro', icon: Users },
    { id: 'sim', label: 'Simulation', icon: Settings2 },
    { id: 'routing', label: 'Topology', icon: Navigation }
  ];

  return (
    <div className={`flex flex-col h-screen w-full bg-[#0B0C10] overflow-hidden ${systemOffline ? 'ring-4 ring-rose-500/50 inset-0 absolute' : ''}`}>

      {/* Top Navbar Pattern */}
      <header className="flex-none bg-[#0B0C10] border-b border-[#1F2332] z-20">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center">
              <Droplets className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-wide ml-2">AquaWatch</h1>
          </div>

          <nav className="hidden lg:flex h-full ml-10">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-5 h-full ${activeTab === item.id ? 'nav-item-active' : 'nav-item-inactive'
                  }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="text-sm font-semibold tracking-wide">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">System State</span>
              <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest ${systemOffline ? 'text-rose-400' : 'text-emerald-400'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${systemOffline ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                {systemOffline ? 'HALTED' : 'NOMINAL'}
              </div>
            </div>
            <div className="h-8 w-px bg-[#1F2332]"></div>
            <EmergencyMode onStatusChange={handleOfflineMode} />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto relative p-6 lg:p-10">
        {systemOffline && (
          <div className="absolute inset-0 z-50 bg-[#0B0C10]/95 backdrop-blur-sm pointer-events-none flex items-center justify-center">
            <div className="border border-rose-500/30 bg-[#11131A] p-10 rounded-xl text-center shadow-2xl max-w-md">
              <ShieldAlert className="w-16 h-16 text-rose-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-wide">Facility Halted</h2>
              <p className="text-slate-400 text-sm leading-relaxed">Infrastructure physically isolated. Clear errors to resume nominal operations.</p>
            </div>
          </div>
        )}

        <div className="max-w-[1400px] mx-auto h-full space-y-8">

          {/* Mobile Nav Fallback */}
          <div className="lg:hidden flex overflow-x-auto pb-4 gap-2 mb-4 border-b border-[#1F2332]">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-4 py-2 whitespace-nowrap text-sm font-bold tracking-wide rounded ${activeTab === item.id ? 'bg-[#1F2332] text-white' : 'text-slate-500'
                  }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Active View */}
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'alerts' && <AlertPanel isMainView={true} />}
          {activeTab === 'credit' && <CreditScore />}
          {activeTab === 'community' && <CommunityView />}
          {activeTab === 'sim' && <WhatIfSim />}
          {activeTab === 'routing' && <WaterRouting />}

          {/* Global Budget Banner inserted naturally at bottom of view */}
          {activeTab !== 'alerts' && (
            <div className="mt-12 bg-[#11131A] border border-[#1F2332] p-5 rounded-xl flex items-center justify-between gap-6">
              <div className="flex items-center gap-4 min-w-max">
                <Activity className="w-5 h-5 text-blue-500" />
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Daily Quota limit</div>
                  <div className="text-lg font-bold text-white mt-0.5">{Math.round(budgetData.current_usage || 0)} <span className="text-sm text-slate-500">/ {budgetData.daily_limit_litres || 150} L</span></div>
                </div>
              </div>
              <div className="flex-1 max-w-xl mx-auto h-1.5 bg-[#1F2332] rounded-full overflow-hidden">
                <div
                  className={`h-full bg-blue-500 ${((budgetData.current_usage || 0) / (budgetData.daily_limit_litres || 1)) > 0.85 ? 'bg-amber-500' : ''}`}
                  style={{ width: `${Math.min(((budgetData.current_usage || 0) / (budgetData.daily_limit_litres || 1)) * 100, 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mini Alert Panel absolute in bottom corner for other tabs */}
      {activeTab !== 'alerts' && (
        <div className="fixed bottom-6 right-6 w-96 z-40">
          <AlertPanel isMainView={false} />
        </div>
      )}

      {isDemo && <DemoControls />}
    </div>
  );
}

export default App;
