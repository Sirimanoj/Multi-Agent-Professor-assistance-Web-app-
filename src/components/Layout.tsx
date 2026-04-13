import type { ReactNode } from 'react';
import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import AIChat from './AIChat';
import GlobalModals from './GlobalModals';

export default function Layout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const { notifications, theme, toggleTheme, markNotificationRead, openModal } = useApp();
  const navigate = useNavigate();
  
  const [showNotifs, setShowNotifs] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const navClass = ({ isActive }: { isActive: boolean }) => 
    `font-manrope font-semibold tracking-tight transition-all cursor-pointer ${isActive ? 'text-violet-600 border-b-2 border-violet-500 pb-1' : 'text-slate-500 hover:text-slate-800'}`;

  const sideNavClass = ({ isActive }: { isActive: boolean }) => 
    `flex items-center gap-3 px-4 py-3 rounded-2xl font-medium text-sm transition-all cursor-pointer ${isActive ? 'bg-gradient-to-br from-violet-600 to-indigo-500 text-white shadow-[0px_10px_20px_rgba(93,63,211,0.3)] active:scale-95' : 'text-slate-500 hover:bg-slate-100 hover:translate-x-1'}`;

  const mobileNavClass = ({ isActive }: { isActive: boolean }) => 
    `flex flex-col items-center cursor-pointer ${isActive ? 'text-violet-600' : 'text-slate-400'}`;

  return (
    <>
      {/* Top NavBar */}
      <header className="sticky top-0 w-full z-40 bg-white/70 backdrop-blur-xl shadow-[0px_4px_20px_rgba(44,47,49,0.04)] h-16 px-8 flex justify-center items-center">
        <div className="flex justify-between items-center w-full max-w-[1440px]">
          <div className="flex items-center gap-12">
            <Link to="/dashboard" className="text-2xl font-black tracking-tighter text-slate-900 cursor-pointer">Academia</Link>
            <nav className="hidden md:flex gap-8">
              <NavLink to="/dashboard" className={navClass}>Dashboard</NavLink>
              <NavLink to="/classrooms" className={navClass}>Classrooms</NavLink>
              <NavLink to="/materials" className={navClass}>Materials</NavLink>
            </nav>
          </div>
          <div className="flex items-center gap-6 relative">
            
            {/* Notifications Toggle */}
            <div onClick={() => setShowNotifs(!showNotifs)} className="relative group cursor-pointer p-2 hover:bg-slate-100/50 rounded-lg transition-all">
              <span className="material-symbols-outlined text-slate-500">notifications</span>
              {unreadCount > 0 && <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>}
            </div>

            {/* AI Chat Toggle (Visible on < lg) */}
            <div onClick={() => setShowChat(!showChat)} className="lg:hidden cursor-pointer p-2 hover:bg-slate-100/50 rounded-lg transition-all">
              <span className="material-symbols-outlined text-slate-500">smart_toy</span>
            </div>

            {/* Notifications Dropdown */}
            {showNotifs && (
              <div className="absolute top-12 right-12 w-80 bg-white rounded-2xl shadow-2xl border border-slate-50 py-4 px-2 animate-in fade-in slide-in-from-top-4 z-50">
                <h3 className="px-4 font-bold text-slate-800 mb-2">Activity</h3>
                <div className="space-y-1 max-h-[300px] overflow-y-auto">
                  {notifications.map(n => (
                    <div key={n.id} onClick={() => markNotificationRead(n.id)} className={`p-4 rounded-xl cursor-pointer transition-colors ${n.read ? 'hover:bg-slate-50 opacity-60' : 'bg-indigo-50/50 hover:bg-indigo-50'}`}>
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-sm text-slate-900">{n.title}</span>
                        <span className="text-[10px] uppercase font-bold text-slate-400">{n.time}</span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Settings Toggle */}
            <span onClick={() => setShowSettings(true)} className="material-symbols-outlined text-slate-500 cursor-pointer p-2 hover:bg-slate-100/50 rounded-lg transition-all">settings</span>
            <img 
              onClick={() => setShowSettings(true)}
              alt="User profile" 
              className="w-9 h-9 rounded-full object-cover ring-2 ring-violet-500/10 hover:ring-violet-500/30 transition-all cursor-pointer" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDutkjfweHkmLvZ0uKOGWo5VWue4OoBhVlxHgmQeHVJvinfGAmFvQsWeG6Pwapq71jEkbpEQ-rFly0cT7kg1e-7pvLZdxRy5l4jTeWiYQDztY0KebTYOKB9JcUIAdq1o-_Gnba59mqmfluXKJl5stJAXrpIxYCR5P7FGcczjyDz1oZcM6xdSUImhLkqXAOeAQdKsAbPUDwnBhYkK0LYUS1oOWf0lvuBOQQJPNKfTaLEWTkA3VUEN4fQgn-j_oaKq8cNPTAvHD5AJWy4" 
            />
          </div>
        </div>
      </header>

      {/* Settings Modal (Overlay) */}
      {showSettings && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-2xl font-headline font-bold text-slate-800">Preferences</h2>
              <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-slate-800">Visual Theme</h4>
                  <p className="text-xs text-slate-500">Toggle dark mode interface.</p>
                </div>
                <button onClick={toggleTheme} className={`w-12 h-6 rounded-full transition-colors relative ${theme === 'dark' ? 'bg-violet-600' : 'bg-slate-200'}`}>
                  <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${theme === 'dark' ? 'translate-x-6' : ''}`}></div>
                </button>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-slate-800">Email Alerts</h4>
                  <p className="text-xs text-slate-500">Receive agent summaries.</p>
                </div>
                <button className={`w-12 h-6 rounded-full transition-colors relative bg-violet-600`}>
                  <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform translate-x-6`}></div>
                </button>
              </div>
            </div>
            <div className="p-6 bg-slate-50 flex justify-end">
              <button onClick={() => setShowSettings(false)} className="bg-violet-600 text-white px-6 py-2 rounded-xl text-sm font-bold active:scale-95 transition-transform">Done</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex min-h-screen">
        {/* Side NavBar */}
        <aside className="hidden lg:flex flex-col fixed left-4 top-20 bottom-4 w-64 bg-white/80 backdrop-blur-2xl rounded-3xl shadow-[0px_10px_30px_rgba(93,63,211,0.15)] p-4 space-y-6 z-30 overflow-hidden">
          <div className="px-4 py-2">
            <h2 className="font-bold text-lg text-slate-900">Luminous Academy</h2>
            <p className="font-manrope font-medium text-[10px] text-slate-400 uppercase tracking-widest">
              {user?.role === 'professor' ? (
                <span className="text-indigo-600 font-bold">Professor View</span>
              ) : (
                <span className="text-emerald-600 font-bold">Student View</span>
              )}
            </p>
          </div>
          <nav className="flex-1 space-y-2">
            <NavLink to="/dashboard" className={sideNavClass}>
              <span className="material-symbols-outlined">dashboard</span>
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/classrooms" className={sideNavClass}>
              <span className="material-symbols-outlined">school</span>
              <span>Classrooms</span>
            </NavLink>
            <NavLink to="/materials" className={sideNavClass}>
              <span className="material-symbols-outlined">book_5</span>
              <span>Materials</span>
            </NavLink>
            <NavLink to="/assignments" className={sideNavClass}>
              <span className="material-symbols-outlined">calendar_month</span>
              <span>Timeline</span>
            </NavLink>

          </nav>
          <button 
            onClick={() => user?.role === 'professor' ? openModal('course') : navigate('/classrooms')}
            className="bg-gradient-to-br from-violet-600 to-indigo-600 text-white mx-2 py-4 rounded-2xl font-bold text-sm shadow-[0px_10px_20px_rgba(99,102,241,0.2)] flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">{user?.role === 'professor' ? 'add_circle' : 'group_add'}</span>
            {user?.role === 'professor' ? 'Create Class' : 'View Classes'}
          </button>
          <div className="pt-4 border-t border-slate-100 space-y-1">
            <a onClick={() => openModal('help')} className="flex items-center gap-3 px-4 py-2 text-slate-500 hover:text-slate-800 rounded-xl transition-colors text-sm font-medium cursor-pointer">
              <span className="material-symbols-outlined text-sm">help</span>
              <span>Help Center</span>
            </a>
            <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-2 text-slate-500 hover:text-red-500 rounded-xl transition-colors text-sm font-medium cursor-pointer">
              <span className="material-symbols-outlined text-sm">logout</span>
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Dynamic Main Content Injected Here */}
        {children}

        {/* AI Chat Sidebar */}
        <AIChat isOpen={showChat} onClose={() => setShowChat(false)} />

        {/* Floating AI Bubble */}
        <button 
          onClick={() => setShowChat(!showChat)}
          className={`fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-full flex items-center justify-center text-white shadow-[0px_10px_30px_rgba(93,63,211,0.4)] hover:scale-110 active:scale-95 transition-all z-[90] group ${showChat ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
        >
          <span className="material-symbols-outlined text-3xl group-hover:rotate-12 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-violet-500 border-2 border-white"></span>
          </span>
        </button>
      </div>

      <GlobalModals />

      {/* Mobile Nav */}
      <nav className="lg:hidden fixed bottom-4 left-4 right-4 h-16 bg-white/80 backdrop-blur-xl flex justify-around items-center rounded-2xl shadow-[0_20px_40px_-12px_rgba(0,0,0,0.08)] border border-slate-100 z-50">
        <NavLink to="/dashboard" className={mobileNavClass}><span className="material-symbols-outlined">dashboard</span><span className="text-[9px] font-black uppercase">Home</span></NavLink>
        <NavLink to="/classrooms" className={mobileNavClass}><span className="material-symbols-outlined">school</span><span className="text-[9px] font-black uppercase">Class</span></NavLink>
        <NavLink to="/assignments" className={mobileNavClass}><span className="material-symbols-outlined">calendar_month</span><span className="text-[9px] font-black uppercase">Timeline</span></NavLink>
        <button onClick={logout} className="flex flex-col items-center text-slate-400 cursor-pointer"><span className="material-symbols-outlined">logout</span><span className="text-[9px] font-black uppercase">Logout</span></button>
      </nav>
    </>
  );
}
