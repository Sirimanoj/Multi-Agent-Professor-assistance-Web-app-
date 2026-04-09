import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import QuizTaker from './QuizTaker';

export default function GlobalModals() {
  const { sendMessage, activeModal, activeQuizId, activeCourseId, openModal, joinCourse, createCourse, generateAssignment, generateAdaptiveQuiz, submitLectureSummary, isGeneratingQuiz, isGrading, activeStudentId, profiles, usersList } = useApp();
  const { user } = useAuth();
  const [inputValue, setInputValue] = useState('');
  const [summaryText, setSummaryText] = useState('');
  const [practiceInput, setPracticeInput] = useState('');
  const [hasConfirmedStudy, setHasConfirmedStudy] = useState(false);
  const [isAITyping, setIsAITyping] = useState(false);
  const [practiceMessages, setPracticeMessages] = useState<{role: 'ai'|'user', text: string}[]>([
    { role: 'ai', text: 'Let\'s practice. What is opportunity cost in your own words?' }
  ]);
  const [activeFormatTab, setActiveFormatTab] = useState<'summary'|'audio'|'visual'>('summary');
  const [activePersona, setActivePersona] = useState<'socratic'|'direct'|'eli5'>('socratic');
  const [isPlaying, setIsPlaying] = useState(false);
  
  const podcastText = "Welcome back to your Macro overview. So, imagine the economy as a massive machine. If the engine gets too hot, the central bank steps in like a mechanic using Monetary Policy—they raise interest rates to cool things down.";
  
  const handlePlayPodcast = () => {
    if (isPlaying) {
       window.speechSynthesis.cancel();
       setIsPlaying(false);
    } else {
       const utterance = new SpeechSynthesisUtterance(podcastText);
       utterance.onend = () => setIsPlaying(false);
       window.speechSynthesis.speak(utterance);
       setIsPlaying(true);
    }
  };

  const interventionStudent = activeStudentId ? profiles.find(p => p.user_id === activeStudentId) : null;
  const interventionStudentName = usersList.find(u => u.id === activeStudentId)?.name || 'Student';
  
  if (activeModal === 'none') {
    if (hasConfirmedStudy) setHasConfirmedStudy(false); // Reset for next time
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue) return;

    if (activeModal === 'course') {
      if (user?.role === 'professor') createCourse(inputValue);
      else joinCourse(inputValue);
    } else if (activeModal === 'generate') {
      // If no active course, we choose the first one or alert
      const targetCourseId = activeCourseId || (user?.role === 'professor' ? useApp().courses[0]?.id : null);
      if (targetCourseId) generateAssignment(inputValue, targetCourseId);
      else alert("Please select a classroom first.");
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

        {activeModal === 'summary' && (
          <div className="p-8 space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-2xl">rate_review</span>
            </div>
            <div>
              <h2 className="text-2xl font-headline font-bold text-slate-900">Lecture Summary</h2>
              <p className="text-sm text-slate-500 mt-2">
                Submit your understanding of the latest material. The AI Tutor will analyze it for misconceptions and update your profile context.
              </p>
            </div>
            <div className="space-y-4">
              <textarea 
                value={summaryText}
                onChange={e => setSummaryText(e.target.value)}
                placeholder="What did you learn? Explain in your own words without copying verbatim."
                className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all font-medium h-32 resize-none text-sm"
              />
              <button onClick={() => { submitLectureSummary('c1', summaryText); setSummaryText(''); }} disabled={isGrading} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2">
                {isGrading ? <><span className="material-symbols-outlined animate-spin text-sm">sync</span> Analyzing...</> : <><span className="material-symbols-outlined text-sm">send</span> Submit Summary</>}
              </button>
            </div>
          </div>
        )}

        {activeModal === 'quiz' && (
          <div className="p-8 space-y-6 text-center">
             <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center mb-2 mx-auto shadow-inner">
               <span className="material-symbols-outlined text-3xl">psychology_alt</span>
             </div>
             <div>
               <h2 className="text-2xl font-headline font-bold text-slate-900">Adaptive AI Quiz</h2>
               <p className="text-sm text-slate-500 mt-2">
                 {hasConfirmedStudy 
                   ? 'The AI Tutor wants to test your understanding before progressing. This short quiz adapts its questions dynamically based on your learning speed.'
                   : 'Have you studied the latest material uploaded by your Professor?'
                 }
               </p>
             </div>
             
             {!hasConfirmedStudy ? (
               <div className="flex flex-col gap-3">
                 <button onClick={() => setHasConfirmedStudy(true)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg active:scale-95 transition-all text-sm uppercase tracking-widest">
                   Yes, I have studied
                 </button>
                 <button onClick={() => openModal('none')} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3 px-6 rounded-xl active:scale-95 transition-all text-sm uppercase tracking-widest">
                   Not yet
                 </button>
               </div>
             ) : (
               <button onClick={() => {
                 const targetCourseId = activeCourseId || useApp().courses[0]?.id;
                 if (targetCourseId) generateAdaptiveQuiz('m1', 'Core Concept', targetCourseId);
               }} disabled={isGeneratingQuiz} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl shadow-[0_10px_20px_rgba(79,70,229,0.3)] active:scale-95 transition-all text-sm uppercase tracking-widest flex justify-center items-center gap-2 mx-auto">
                 {isGeneratingQuiz ? <><span className="material-symbols-outlined animate-spin text-sm">sync</span> Generating Quiz...</> : 'Start Assessment'}
               </button>
             )}
          </div>
        )}
        {activeModal === 'infinite_practice' && (
          <div className="flex flex-col h-[600px] w-full bg-slate-50 relative">
            {/* Header */}
            <div className="p-6 bg-white border-b border-slate-100 flex items-center justify-between shadow-sm z-10 shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center">
                  <span className="material-symbols-outlined font-bold text-xl">psychology</span>
                </div>
                <div>
                  <h2 className="text-xl font-headline font-bold text-slate-900">Infinite Practice</h2>
                  <p className="text-xs text-indigo-500 font-bold uppercase tracking-widest mt-0.5">Opportunity Cost • Foundational</p>
                </div>
              </div>
              <div className="bg-slate-100 p-1 rounded-lg flex gap-1">
                 <button onClick={() => setActivePersona('socratic')} className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-md transition-colors ${activePersona === 'socratic' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>Socratic</button>
                 <button onClick={() => setActivePersona('direct')} className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-md transition-colors ${activePersona === 'direct' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>Direct</button>
                 <button onClick={() => setActivePersona('eli5')} className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-md transition-colors ${activePersona === 'eli5' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>ELI5</button>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {practiceMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-5 py-3 text-sm ${msg.role === 'user' ? 'bg-violet-600 text-white rounded-tr-sm shadow-md' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm shadow-sm'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isAITyping && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-2xl px-5 py-3 text-sm bg-white border border-slate-200 text-slate-700 rounded-tl-sm shadow-sm flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-slate-300 animate-bounce"></span>
                    <span className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{animationDelay: '0.1s'}}></span>
                    <span className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{animationDelay: '0.2s'}}></span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <form onSubmit={async (e) => {
                e.preventDefault();
                if (!practiceInput.trim()) return;
                const userInput = practiceInput;
                setPracticeInput('');
                
                const prevMsgs = [...practiceMessages];
                setPracticeMessages(prev => [...prev, {role: 'user', text: userInput}]);
                
                setIsAITyping(true);
                const aiResponse = await sendMessage(userInput, activePersona, prevMsgs);
                setPracticeMessages(prev => [...prev, aiResponse]);
                setIsAITyping(false);
            }} className="p-4 bg-white border-t border-slate-100 flex items-center gap-2 shrink-0">
              <input 
                type="text" 
                value={practiceInput}
                onChange={e => setPracticeInput(e.target.value)}
                placeholder="Type your answer here..."
                className="flex-1 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm font-medium"
              />
              <button type="submit" className="w-12 h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center">
                <span className="material-symbols-outlined">send</span>
              </button>
            </form>
          </div>
        )}

        {activeModal === 'formats' && (
          <div className="p-0 overflow-hidden bg-slate-50 h-[500px] flex flex-col">
            <div className="p-6 bg-white border-b border-slate-100 flex justify-between items-center z-10 shrink-0">
               <div>
                  <h2 className="text-xl font-headline font-bold text-slate-900">Differentiated Material</h2>
                  <p className="text-xs text-orange-500 font-bold uppercase tracking-widest mt-0.5">Syllabus - Macroeconomics.pdf</p>
               </div>
            </div>
            
            <div className="flex border-b border-slate-200 bg-white shrink-0">
              <button onClick={() => setActiveFormatTab('summary')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-colors border-b-2 ${activeFormatTab === 'summary' ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-400 hover:text-slate-700 hover:bg-slate-50'}`}>Summary</button>
              <button onClick={() => setActiveFormatTab('audio')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-colors border-b-2 ${activeFormatTab === 'audio' ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-400 hover:text-slate-700 hover:bg-slate-50'}`}>Audio Script</button>
              <button onClick={() => setActiveFormatTab('visual')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-colors border-b-2 ${activeFormatTab === 'visual' ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-400 hover:text-slate-700 hover:bg-slate-50'}`}>Mind Map</button>
            </div>

            <div className="flex-1 p-6 overflow-y-auto">
               {activeFormatTab === 'summary' && (
                 <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 font-medium text-sm text-slate-700 leading-relaxed">
                   <h3 className="font-bold text-lg text-slate-900">Key Takeaways</h3>
                   <ul className="list-disc pl-5 space-y-2">
                     <li>Macroeconomics focuses on the behavior of the entire economy (e.g., GDP, inflation, unemployment).</li>
                     <li>Monetary Policy is controlled by the central bank to manage money supply and interest rates.</li>
                     <li>Fiscal Policy is controlled by the government to manage taxation and spending.</li>
                   </ul>
                 </div>
               )}
                {activeFormatTab === 'audio' && (
                 <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                   <div className="flex items-center gap-4 mb-4">
                     <button onClick={handlePlayPodcast} className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isPlaying ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30 animate-pulse' : 'bg-orange-100 text-orange-600 hover:bg-orange-600 hover:text-white'}`}>
                       <span className="material-symbols-outlined ml-1">{isPlaying ? 'stop' : 'play_arrow'}</span>
                     </button>
                     <div>
                       <h3 className="font-bold text-slate-900">AI Podcast Generation</h3>
                       <p className="text-xs text-slate-500">2 mins • Foundational Tone</p>
                     </div>
                   </div>
                   <div className="bg-slate-50 p-4 rounded-xl text-sm italic text-slate-600 font-serif border border-slate-100">
                     "...Welcome back to your Macro overview. So, imagine the economy as a massive machine. If the engine gets too hot, the central bank steps in like a mechanic using Monetary Policy—they raise interest rates to cool things down..."
                   </div>
                 </div>
               )}
               {activeFormatTab === 'visual' && (
                 <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center h-full gap-4 text-center">
                   <span className="material-symbols-outlined text-6xl text-orange-200">account_tree</span>
                   <p className="text-sm font-bold text-slate-400">Visual Mind Map generated.</p>
                   <button className="bg-slate-100 px-4 py-2 rounded-lg text-xs font-bold text-slate-600 uppercase tracking-widest hover:bg-slate-200">Export as SVG</button>
                 </div>
               )}
            </div>
          </div>
        )}

        {activeModal === 'quiz' && activeQuizId && (
           <QuizTaker quizId={activeQuizId} />
        )}

        {activeModal === 'intervention' && interventionStudent && (
          <div className="p-8 space-y-6">
             <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
               <span className="material-symbols-outlined text-2xl">monitoring</span>
             </div>
             <div>
               <h2 className="text-2xl font-headline font-bold text-slate-900">{interventionStudentName}'s History</h2>
               <p className="text-sm text-slate-500 mt-2">
                 Deep dive into exactly why this student is struggling with <span className="font-bold text-red-500 uppercase">{interventionStudent.weak_concepts[0] || 'core concepts'}</span>.
               </p>
             </div>
             <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
                <div className="flex justify-between items-center text-sm border-b border-slate-200 pb-2">
                   <strong className="text-slate-700">Quiz 3: Opportunity Cost</strong>
                   <span className="text-red-500 font-bold">2/5</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-slate-200 pb-2">
                   <strong className="text-slate-700">Assignment: Market Analysis</strong>
                   <span className="text-orange-500 font-bold">C-</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                   <strong className="text-slate-700">Lecture Summary</strong>
                   <span className="text-slate-500 italic text-xs">Misconception detected</span>
                </div>
             </div>
             <button onClick={() => openModal('none')} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl shadow-lg active:scale-95 transition-all text-sm uppercase tracking-widest flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-sm">auto_awesome</span> Generate 1-on-1 Plan
             </button>
          </div>
        )}
      </div>
    </div>
  );
}
