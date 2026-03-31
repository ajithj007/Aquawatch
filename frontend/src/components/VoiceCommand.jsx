import React, { useState } from 'react';
import { Mic, Send, MessageSquare } from 'lucide-react';
import axios from 'axios';

export default function VoiceCommand() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'system', content: 'Voice Assistant Online. How can I help?' }
  ]);

  const handleCommand = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.toLowerCase();
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setInput('');
    
    // Rule-based matching
    let response = "I didn't understand that command. Try 'how much water today' or 'show leaks'.";
    
    if (userMsg.includes('water today') || userMsg.includes('usage today')) {
       try {
         const res = await axios.get('http://localhost:5001/api/budget/today');
         response = `Today's usage is ${res.data.current_usage?.toFixed(1) || 0}L out of your ${res.data.daily_limit_litres || 150}L budget.`;
       } catch (e) {
         response = "Couldn't fetch today's usage.";
       }
    } else if (userMsg.includes('turn off garden')) {
       try {
         await axios.post('http://localhost:5001/api/demo/override', { rain: true }); // triggers rain response for garden
         response = "Garden supply scheduled for shutdown. Diverting logic to rain mode.";
       } catch (e) {
         response = "Failed to communicate with Garden Node.";
       }
    } else if (userMsg.includes('show leaks') || userMsg.includes('alert')) {
       response = "Navigating to alerts panel...";
       // In a real app we'd dispatch an event to change tabs.
    } else if (userMsg.includes('score') || userMsg.includes('credit')) {
       try {
         const res = await axios.get('http://localhost:5001/api/credit-score');
         response = `Your current Water Credit Score is ${res.data.score}/100. Keep up the efficiency!`;
       } catch (e) {
         response = "Couldn't fetch your credit score.";
       }
    }

    setTimeout(() => {
       setMessages(prev => [...prev, { role: 'system', content: response }]);
    }, 600);
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 flex items-center justify-center hover:bg-cyan-500/40 transition-colors shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)]"
      >
         <Mic className="w-5 h-5" />
      </button>
      
      {open && (
        <div className="absolute top-14 right-0 w-80 glass-panel rounded-2xl border border-cyan-500/30 overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-50 flex flex-col h-96">
           <div className="bg-cyan-900/50 p-4 border-b border-cyan-500/20 flex items-center justify-between">
              <h3 className="font-bold text-cyan-400 flex items-center gap-2">
                 <MessageSquare className="w-4 h-4" /> AI Assistant
              </h3>
           </div>
           
           <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                   <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                     m.role === 'user' 
                      ? 'bg-cyan-500 text-black rounded-tr-sm font-medium' 
                      : 'bg-black/50 text-gray-200 border border-white/10 rounded-tl-sm'
                   }`}>
                      {m.content}
                   </div>
                </div>
              ))}
           </div>
           
           <form onSubmit={handleCommand} className="p-3 bg-black/40 border-t border-white/10 flex items-center gap-2">
              <input 
                type="text" 
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask something..."
                className="flex-1 bg-transparent border border-white/20 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50"
              />
              <button type="submit" className="w-10 h-10 rounded-xl bg-cyan-500 flex items-center justify-center text-black hover:bg-cyan-400">
                 <Send className="w-4 h-4" />
              </button>
           </form>
        </div>
      )}
    </div>
  );
}
