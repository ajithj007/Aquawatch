import React, { useState } from 'react';
import axios from 'axios';
import { PowerOff } from 'lucide-react';

export default function EmergencyMode({ onStatusChange }) {
  const [countdown, setCountdown] = useState(null);
  const [active, setActive] = useState(false);

  const activateEmergency = () => {
    let timer = 5;
    setCountdown(timer);
    const int = setInterval(() => {
      timer -= 1;
      setCountdown(timer);
      if (timer <= 0) {
        clearInterval(int);
        setCountdown(null);
        executeShutdown();
      }
    }, 1000);
  };

  const executeShutdown = async () => {
    try {
      await axios.post('https://aquawatch-1.onrender.com', { status: true });
      setActive(true);
      if (onStatusChange) onStatusChange(true);
    } catch (e) {
      console.error(e);
    }
  };

  const cancelEmergency = async () => {
    setCountdown(null);
    try {
      await axios.post('https://aquawatch-1.onrender.com', { status: false });
      setActive(false);
      if (onStatusChange) onStatusChange(false);
    } catch (e) {
      console.error(e);
    }
  };

  if (active) {
    return (
      <button
        onClick={cancelEmergency}
        className="bg-rose-500 hover:bg-rose-600 text-white text-[10px] py-2 px-4 rounded font-bold uppercase tracking-widest flex items-center gap-2 border border-rose-600"
      >
        <PowerOff className="w-3.5 h-3.5" /> Resume Grid Operations
      </button>
    );
  }

  if (countdown !== null) {
    return (
      <button
        onClick={cancelEmergency}
        className="bg-amber-500 text-[#0B0C10] text-[10px] py-2 px-4 rounded font-bold uppercase tracking-widest flex items-center gap-2 border border-amber-600"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#0B0C10] animate-pulse"></span>
        Abort Halt ({countdown}s)
      </button>
    );
  }

  return (
    <button
      onClick={activateEmergency}
      className="bg-[#11131A] hover:bg-rose-500/10 text-rose-500 hover:border-rose-500/30 text-[10px] py-2 px-4 rounded font-bold uppercase tracking-widest border border-[#1F2332] transition-colors"
    >
      Hard Halt
    </button>
  );
}
