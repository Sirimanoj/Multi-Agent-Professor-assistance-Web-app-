import { useState } from 'react';
import { useApp } from '../context/AppContext';

interface Question {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  source_reference?: string;
}

export default function QuizTaker({ quizId }: { quizId: string }) {
  const { quizzes, submitQuizAnswers, isGrading, openModal } = useApp();
  const quiz = quizzes.find(q => q.id === quizId);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isFinished, setIsFinished] = useState(false);

  if (!quiz) return null;

  const questions = (quiz.questions as Question[]) || [];
  const currentQuestion = questions[currentQuestionIndex];

  const handleSelect = (index: number) => {
    setAnswers({ ...answers, [currentQuestionIndex]: index.toString() });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleSubmit = async () => {
    await submitQuizAnswers(quizId, answers);
  };

  // 1. COMPLETED VIEW
  if (quiz.completed) {
    return (
      <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-700">
        <div className="w-full max-w-2xl px-8">
          <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-100/50">
            <span className="material-symbols-outlined text-5xl">verified</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Assessment Complete</h2>
          <p className="text-slate-500 text-lg mb-12">Your performance has been analyzed by the Professor AI.</p>
          
          <div className="bg-slate-50 border border-slate-100 rounded-[2.5rem] p-12 mb-12 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="material-symbols-outlined text-9xl">analytics</span>
             </div>
             
             <div className="relative z-10">
                <div className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Total Proficiency</div>
                <div className="text-8xl md:text-9xl font-black text-indigo-600 mb-6 tabular-nums">{quiz.score}%</div>
                <div className="max-w-md mx-auto text-slate-700 leading-relaxed text-lg font-medium mb-12">
                  "{quiz.feedback}"
                </div>

                {/* Pedagogical Breakdown */}
                <div className="space-y-4 text-left max-w-2xl mx-auto mb-12 max-h-[40vh] overflow-y-auto pr-4 scrollbar-hide">
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Pedagogical Breakdown</h4>
                    {questions.map((q: any, idx: number) => {
                      const isCorrect = parseInt((quiz.responses as any)?.[idx] || "-1") === q.correctAnswerIndex;
                      return (
                        <div key={idx} className={`p-6 rounded-3xl border-2 transition-all ${isCorrect ? 'bg-emerald-50/30 border-emerald-100' : 'bg-rose-50/30 border-rose-100'}`}>
                           <div className="flex justify-between items-start gap-4 mb-4">
                              <p className="font-bold text-slate-900 leading-tight">{q.question}</p>
                              <span className={`material-symbols-outlined ${isCorrect ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {isCorrect ? 'check_circle' : 'cancel'}
                              </span>
                           </div>
                           <p className="text-xs text-slate-500 leading-relaxed mb-4 italic">"{q.explanation}"</p>
                           {q.source_reference && (
                             <div className="flex items-start gap-3 p-3 bg-white/50 rounded-xl border border-slate-100">
                               <span className="material-symbols-outlined text-sm text-indigo-500 mt-0.5">verified</span>
                               <p className="text-[10px] font-bold text-slate-600 leading-tight uppercase tracking-tighter decoration-indigo-200">
                                 Confirmed by Material: <span className="normal-case font-medium text-slate-500">"{q.source_reference}"</span>
                               </p>
                             </div>
                           )}
                        </div>
                      )
                    })}
                 </div>
             </div>
          </div>

          <button 
            onClick={() => openModal('none')}
            className="px-12 py-5 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 hover:-translate-y-1 transition-all shadow-xl shadow-slate-200"
          >
            Close & Return to Hub
          </button>
        </div>
      </div>
    );
  }

  // 2. READY TO SUBMIT VIEW
  if (isFinished) {
    return (
      <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-6 text-center animate-in slide-in-from-bottom-12 duration-700">
        <div className="w-full max-w-xl">
           <div className="inline-block px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black uppercase tracking-widest mb-6">Final Review</div>
           <h2 className="text-4xl font-black text-slate-900 mb-6">Ready to Submit?</h2>
           <p className="text-slate-500 mb-12 leading-relaxed">Please review your answers before the AI evaluation begins. Once submitted, your scores will be permanently recorded.</p>
           
           <div className="space-y-3 mb-12 max-h-[40vh] overflow-y-auto px-4 scrollbar-hide">
             {questions.map((q, idx) => (
                <div key={idx} className="flex items-center gap-6 p-5 bg-white border border-slate-100 rounded-3xl shadow-sm hover:border-indigo-100 transition-colors text-left group">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center font-bold text-lg group-hover:bg-indigo-600 group-hover:text-white transition-all">{idx+1}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-widest truncate">{q.question}</div>
                      {q.source_reference && (
                        <div className="flex-shrink-0 flex items-center gap-1 px-1.5 py-0.5 bg-emerald-50 text-[10px] font-bold text-emerald-600 rounded-md border border-emerald-100">
                          <span className="material-symbols-outlined text-[10px]">verified</span>
                          Grounded
                        </div>
                      )}
                    </div>
                    <div className="text-base font-bold text-slate-800">
                      {answers[idx] ? q.options[parseInt(answers[idx])] : <span className="text-rose-500 italic">No answer provided</span>}
                    </div>
                  </div>
                </div>
             ))}
           </div>

           <div className="flex flex-col md:flex-row gap-4">
              <button 
                onClick={() => setIsFinished(false)}
                className="flex-1 px-8 py-5 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">edit</span>
                Modify Answers
              </button>
              <button 
                onClick={handleSubmit}
                disabled={isGrading}
                className="flex-[2] px-8 py-5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:shadow-indigo-200 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isGrading ? (
                   <span className="material-symbols-outlined animate-spin">sync</span>
                ) : (
                   <>
                    <span>Confirm Submission</span>
                    <span className="material-symbols-outlined">rocket_launch</span>
                   </>
                )}
              </button>
           </div>
        </div>
      </div>
    );
  }

  // 3. ACTIVE QUIZ TAKER (FULL SCREEN FOCUS MODE)
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col font-sans overflow-hidden">
      {/* Immersive Header */}
      <div className="absolute top-0 left-0 right-0 p-8 flex justify-between items-center z-20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <span className="material-symbols-outlined">auto_awesome</span>
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Adaptive Assessment</div>
            <div className="text-sm font-bold text-slate-900">{quiz.topic}</div>
          </div>
        </div>
        
        <button 
          onClick={() => { if(confirm("Are you sure you want to exit? Your progress will be lost.")) openModal('none'); }}
          className="w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      {/* Progress Line */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-50 z-30">
        <div 
          className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 transition-all duration-1000 ease-out" 
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col container mx-auto max-w-5xl px-6 relative z-10 pt-32 pb-12">
        {/* Large Index indicator */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden xl:block">
           <div className="rotate-270 text-[10rem] font-black text-slate-50/50 pointer-events-none select-none">
             0{currentQuestionIndex + 1}
           </div>
        </div>

        <div className="flex-1 flex flex-col justify-center">
            {/* Question Card */}
            <div key={currentQuestionIndex} className="animate-in fade-in slide-in-from-right-12 duration-700">
               <div className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-8">
                 Section 01 • Application
               </div>
               
               <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-12 leading-[1.1] tracking-tight max-w-3xl lowercase first-letter:uppercase">
                 {currentQuestion.question}
               </h2>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {currentQuestion.options.map((opt, i) => (
                   <button
                     key={i}
                    onClick={() => handleSelect(i)}
                    className={`p-6 md:p-8 rounded-[2rem] border-2 text-left transition-all duration-300 flex items-start gap-5 relative overflow-hidden group ${
                      answers[currentQuestionIndex] === i.toString() 
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-2xl shadow-indigo-100' 
                      : 'border-slate-50 bg-slate-50/30 hover:bg-white hover:border-slate-200 hover:shadow-xl hover:shadow-slate-100'
                    }`}
                   >
                     <div className={`w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center font-black text-sm transition-all ${
                       answers[currentQuestionIndex] === i.toString() ? 'bg-indigo-600 text-white' : 'bg-white text-slate-400 border border-slate-100 shadow-sm'
                     }`}>
                       {String.fromCharCode(65 + i)}
                     </div>
                     <span className={`text-lg font-bold leading-snug pt-1 ${answers[currentQuestionIndex] === i.toString() ? 'text-indigo-900' : 'text-slate-600'}`}>
                       {opt}
                     </span>
                     
                     {/* Active Indicator */}
                     {answers[currentQuestionIndex] === i.toString() && (
                       <div className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 bg-indigo-600 rounded-full animate-ping opacity-20" />
                     )}
                   </button>
                 ))}
               </div>
            </div>
        </div>

        {/* Immersive Footer Navigation */}
        <div className="mt-12 flex items-center justify-between border-t border-slate-50 pt-12">
            <div>
               <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Completion Status</div>
               <div className="flex gap-1.5 mt-2">
                 {questions.map((_, i) => (
                   <div 
                     key={i} 
                     className={`w-8 h-1.5 rounded-full transition-all duration-500 ${
                       i === currentQuestionIndex ? 'w-12 bg-indigo-500' : (answers[i] ? 'bg-indigo-200' : 'bg-slate-100')
                     }`} 
                   />
                 ))}
               </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex-1))}
                disabled={currentQuestionIndex === 0}
                className="w-16 h-16 rounded-3xl border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-slate-800 transition-all disabled:opacity-0"
              >
                <span className="material-symbols-outlined text-3xl">chevron_left</span>
              </button>
              
              <button 
                onClick={handleNext}
                disabled={!answers[currentQuestionIndex]}
                style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' }}
                className={`group min-w-[200px] h-16 px-10 rounded-3xl font-black text-sm uppercase tracking-[0.1em] transition-all flex items-center justify-center gap-3 shadow-2xl disabled:grayscale disabled:opacity-50 ${
                  answers[currentQuestionIndex] ? 'bg-slate-900 text-white hover:bg-indigo-600 hover:-translate-y-1 shadow-slate-200' : 'bg-slate-100 text-slate-400'
                }`}
              >
                <span>{currentQuestionIndex === questions.length - 1 ? 'Finish Assessment' : 'Continue'}</span>
                <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">east</span>
              </button>
            </div>
        </div>
      </div>

      {/* Aesthetic Accents */}
      <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-indigo-50/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[-5%] right-[-5%] w-[30%] h-[30%] bg-violet-50/40 rounded-full blur-[100px] pointer-events-none" />
    </div>
  );
}
