import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';

interface AIChatProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AIChat({ isOpen, onClose }: AIChatProps) {
  const { messages, sendMessage, isAITyping } = useApp();
  const [input, setInput] = useState('');
  const [activePersona, setActivePersona] = useState('direct');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isAITyping]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isAITyping) return;
    
    const textToSend = input;
    setInput('');
    await sendMessage(textToSend, activePersona, messages);
  };

  const personas = [
    { id: 'direct', name: 'Analytic', icon: 'psychology' },
    { id: 'socratic', name: 'Socratic', icon: 'question_mark' },
    { id: 'eli5', name: 'ELI5', icon: 'child_care' },
  ];

  return (
    <aside 
      className={`flex flex-col fixed inset-y-0 right-0 w-full md:w-[450px] bg-white/95 backdrop-blur-xl shadow-[-20px_0_50px_-10px_rgba(0,0,0,0.1)] border-l border-slate-100 z-[100] transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1) transform ${
        isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'
      }`}
    >
      {/* Premium Header */}
      <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-gradient-to-r from-violet-600 to-indigo-700 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-16 translate-x-16"></div>
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner group">
             <span className="material-symbols-outlined text-white text-2xl animate-pulse group-hover:scale-110 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
          </div>
          <div>
            <h2 className="font-headline font-bold text-xl tracking-tight">Scholarly Assistant</h2>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Neural Engine Online</p>
            </div>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center cursor-pointer group"
        >
          <span className="material-symbols-outlined text-white transition-transform group-hover:rotate-90">close</span>
        </button>
      </div>

      {/* Mode Selector */}
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex justify-between gap-1 overflow-x-auto scrollbar-hide">
        {personas.map(p => (
          <button
            key={p.id}
            onClick={() => setActivePersona(p.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer whitespace-nowrap ${
              activePersona === p.id 
                ? 'bg-white text-violet-600 shadow-sm border border-violet-100 ring-2 ring-violet-500/10' 
                : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'
            }`}
          >
            <span className={`material-symbols-outlined text-sm ${activePersona === p.id ? 'text-violet-500' : ''}`}>{p.icon}</span>
            {p.name}
          </button>
        ))}
      </div>

      {/* Messages Feed */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth scrollbar-hide bg-slate-50/50"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 animate-in fade-in zoom-in duration-1000">
             <div className="w-20 h-20 rounded-[2.5rem] bg-indigo-50 flex items-center justify-center mb-6 shadow-sm border border-white">
                <span className="material-symbols-outlined text-4xl text-indigo-400">forum</span>
             </div>
             <h3 className="font-bold text-slate-800 text-lg">Knowledge Inquiry</h3>
             <p className="text-slate-400 text-sm mt-2 max-w-[240px] leading-relaxed">I am synchronized with your course materials. Ask me to explain concepts, generate practice problems, or summarize lectures.</p>
          </div>
        )}

        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} animate-in slide-in-from-${msg.sender === 'user' ? 'right' : 'left'}-4 duration-500`}
          >
            <div className={`text-[9px] mb-2 font-black uppercase tracking-widest opacity-40 px-1 ${msg.sender === 'user' ? 'text-slate-500' : 'text-violet-600'}`}>
              {msg.sender === 'user' ? 'Knowledge Seeker' : 'Assistant Neural'}
            </div>
            <div className={`max-w-[90%] rounded-[1.5rem] px-5 py-4 shadow-sm border ${
              msg.sender === 'user' 
                ? 'bg-violet-600 text-white rounded-tr-none border-violet-500' 
                : 'bg-white text-slate-700 rounded-tl-none border-slate-100'
            }`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
            </div>
            <div className={`text-[8px] mt-1.5 font-bold text-slate-300 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}

        {isAITyping && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-white border border-slate-100 rounded-[1.5rem] rounded-tl-none px-6 py-4 shadow-sm">
               <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-400">Generating Analysis...</span>
               </div>
            </div>
          </div>
        )}
      </div>

      {/* Luxury Input Bar */}
      <div className="p-6 bg-white border-t border-slate-100 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.02)]">
        <form onSubmit={handleSend} className="relative group">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Inquire with the Neural Engine..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 pr-16 text-sm focus:outline-none focus:ring-4 focus:ring-violet-500/5 focus:border-violet-500 transition-all resize-none min-h-[120px] leading-relaxed group-hover:border-slate-300 outline-none"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isAITyping}
            className={`absolute bottom-3 right-3 w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-lg shadow-violet-600/20 active:scale-90 cursor-pointer ${
              input.trim() && !isAITyping 
                ? 'bg-gradient-to-br from-violet-600 to-indigo-700 text-white' 
                : 'bg-slate-200 text-white grayscale pointer-events-none'
            }`}
          >
            <span className="material-symbols-outlined text-sm">send</span>
          </button>
        </form>
        <p className="text-[9px] text-center text-slate-400 mt-4 leading-relaxed font-medium uppercase tracking-[0.1em]">
          Powered by Gemini 1.5 Pro • Analysis may incur latency
        </p>
      </div>
    </aside>
  );
}
