import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export default function GlobalModals() {
  const { activeModal, openModal, joinCourse, createCourse, generateAssignment } = useApp();
  const { user } = useAuth();
  const [inputValue, setInputValue] = useState('');

  if (activeModal === 'none') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue) return;

    if (activeModal === 'course') {
      if (user?.role === 'professor') createCourse(inputValue);
      else joinCourse(inputValue);
    } else if (activeModal === 'generate') {
      generateAssignment(inputValue);
    }

    setInputValue('');
    openModal('none');
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 relative">
        <button onClick={() => openModal('none')} className="absolute top-6 right-6 text-slate-400 hover:text-slate-800 transition-colors">
          <span className="material-symbols-outlined">close</span>
        </button>

        {activeModal === 'course' && (
          <div className="p-8 space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-2xl">school</span>
            </div>
            <div>
              <h2 className="text-2xl font-headline font-bold text-slate-900">{user?.role === 'professor' ? 'Create Classroom' : 'Join Classroom'}</h2>
              <p className="text-sm text-slate-500 mt-2">
                {user?.role === 'professor' 
                  ? 'Initialize a new environment for the Syllabus Agent to track.' 
                  : 'Enter the 6-digit access code provided by your Professor.'}
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input 
                type="text" 
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder={user?.role === 'professor' ? 'e.g., Intro to Literature' : 'e.g., X8B9L2'}
                className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all font-medium"
                autoFocus
              />
              <button type="submit" className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-violet-600/20 active:scale-95 transition-all">
                {user?.role === 'professor' ? 'Initialize Environment' : 'Verify & Join'}
              </button>
            </form>
          </div>
        )}

        {activeModal === 'generate' && (
          <div className="p-8 space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-2xl">auto_fix_high</span>
            </div>
            <div>
              <h2 className="text-2xl font-headline font-bold text-slate-900">Task Generation</h2>
              <p className="text-sm text-slate-500 mt-2">
                Provide a core topic. The Knowledge Agent will construct a rigorous rubric and distribute it immediately.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input 
                type="text" 
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder="e.g., Quantum Mechanics Quiz"
                className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all font-medium"
                autoFocus
              />
              <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-sm">bolt</span> Synthesize Task
              </button>
            </form>
          </div>
        )}

        {activeModal === 'help' && (
          <div className="p-8 space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-2xl">support_agent</span>
            </div>
            <div>
              <h2 className="text-2xl font-headline font-bold text-slate-900">Help Center</h2>
              <p className="text-sm text-slate-500 mt-2">How can we assist you today?</p>
            </div>
            <div className="space-y-2">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 font-medium text-sm text-slate-700 hover:bg-violet-50 transition-colors cursor-pointer">
                How do I reset my grading parameters?
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 font-medium text-sm text-slate-700 hover:bg-violet-50 transition-colors cursor-pointer">
                Exporting Data to CSV
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 font-medium text-sm text-slate-700 hover:bg-violet-50 transition-colors cursor-pointer">
                Contact Human Support
              </div>
            </div>
            <button onClick={() => openModal('none')} className="w-full text-slate-400 font-bold py-3 rounded-xl active:scale-95 transition-all outline-none">
              Dismiss
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
