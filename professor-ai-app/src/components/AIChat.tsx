import { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';

export default function AIChat() {
  const { messages, isAITyping, sendMessage } = useApp();
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAITyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput('');
  };

  return (
    <aside className="hidden xl:flex flex-col fixed right-4 top-20 bottom-4 w-[360px] bg-white rounded-3xl shadow-[0_20px_40px_-12px_rgba(0,0,0,0.08)] border border-slate-50 overflow-hidden z-20">
      <div className="p-8 border-b border-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-[0_0_20px_rgba(99,102,241,0.15)]">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
          </div>
          <div>
            <h3 className="font-bold text-sm tracking-tight">Scholarly Assistant</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
              <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest">Luminous Engine V.4</span>
            </div>
          </div>
        </div>
        <button className="text-slate-300 hover:text-slate-600 p-2 hover:bg-slate-50 rounded-xl transition-all">
          <span className="material-symbols-outlined">more_horiz</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className={`space-y-4 flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`flex items-center gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <span className={`text-[9px] font-black uppercase tracking-widest ${msg.sender === 'user' ? 'text-slate-300' : 'text-violet-600'}`}>
                {msg.sender === 'user' ? 'You' : 'Assistant'}
              </span>
            </div>
            <div className={`p-5 text-sm leading-relaxed max-w-[90%] ${
              msg.sender === 'user' 
                ? 'bg-slate-50 rounded-2xl rounded-tr-none text-slate-600 border border-white shadow-sm' 
                : 'text-slate-700 bg-transparent text-lg font-headline pr-4'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}

        {isAITyping && (
          <div className="flex gap-2 items-center py-4 bg-violet-600/5 rounded-2xl px-6 border border-violet-600/10 w-fit">
            <div className="flex gap-1.5">
              <div className="w-1.5 h-1.5 bg-violet-600 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
              <div className="w-1.5 h-1.5 bg-violet-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              <div className="w-1.5 h-1.5 bg-violet-600 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
            </div>
            <span className="text-[9px] text-violet-600 font-black uppercase tracking-widest ml-4">Generating Analysis...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="p-8 pt-2">
        <div className="relative group">
          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            className="w-full bg-slate-50 border-none rounded-2xl p-5 pr-14 text-sm focus:ring-4 focus:ring-violet-600/5 transition-all min-h-[120px] resize-none placeholder:text-slate-300 shadow-inner outline-none" 
            placeholder="Ask your Atelier assistant..."
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim()}
            className="absolute bottom-5 right-5 w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-[0_0_20px_rgba(99,102,241,0.15)] hover:scale-110 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
          >
            <span className="material-symbols-outlined text-sm">send</span>
          </button>
        </div>
        <div className="mt-5 flex justify-between items-center text-[9px] text-slate-400 font-bold uppercase tracking-widest">
          <div className="flex gap-4">
            <button className="flex items-center gap-1.5 hover:text-violet-600 transition-colors"><span className="material-symbols-outlined text-sm">attach_file</span> Attach</button>
            <button className="flex items-center gap-1.5 hover:text-violet-600 transition-colors"><span className="material-symbols-outlined text-sm">mic</span> Voice</button>
          </div>
          <span className="px-2 py-0.5 bg-slate-100 rounded">2.4k Tokens</span>
        </div>
      </div>
    </aside>
  );
}
