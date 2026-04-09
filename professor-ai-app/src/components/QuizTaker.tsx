import { useState } from 'react';
import { useApp } from '../context/AppContext';

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

export default function QuizTaker({ quizId }: { quizId: string }) {
  const { quizzes, submitQuizAnswers, isGrading } = useApp();
  const quiz = quizzes.find(q => q.id === quizId);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isFinished, setIsFinished] = useState(false);

  if (!quiz) return null;

  const questions = (quiz.questions as Question[]) || [];
  const currentQuestion = questions[currentQuestionIndex];

  const handleSelect = (option: string) => {
    setAnswers({ ...answers, [currentQuestionIndex]: option });
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

  if (quiz.completed) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-glow-green">
          <span className="material-symbols-outlined text-5xl">verified</span>
        </div>
        <h2 className="text-3xl font-headline font-bold text-slate-900 mb-2">Assessment Completed</h2>
        <div className="text-5xl font-black text-indigo-600 mb-4">{quiz.score}%</div>
        <p className="text-slate-600 max-w-md mb-8 leading-relaxed">
          {quiz.feedback}
        </p>
        <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="text-xs font-bold text-slate-400 uppercase mb-1">Total Questions</div>
            <div className="text-xl font-bold text-slate-800">{questions.length}</div>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="text-xs font-bold text-slate-400 uppercase mb-1">Difficulty</div>
            <div className="text-xl font-bold text-slate-800 capitalize">{quiz.difficulty}</div>
          </div>
        </div>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="p-12 text-center animate-in slide-in-from-bottom-8 duration-500">
        <h2 className="text-3xl font-headline font-bold text-slate-900 mb-4">Ready to Submit?</h2>
        <p className="text-slate-500 mb-10">Your answers have been compiled. The Evaluating Agent is ready to grade your performance.</p>
        
        <div className="space-y-4 max-w-md mx-auto mb-10">
          {questions.map((q, idx) => (
             <div key={idx} className="flex items-center gap-4 text-left p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex-shrink-0 flex items-center justify-center font-bold text-sm">{idx+1}</div>
                <div className="flex-1 overflow-hidden">
                  <div className="text-xs text-slate-400 truncate">{q.question}</div>
                  <div className="text-sm font-bold text-slate-700 truncate">{answers[idx] || 'No answer'}</div>
                </div>
                {answers[idx] ? (
                   <span className="material-symbols-outlined text-green-500 text-sm">check_circle</span>
                ) : (
                   <span className="material-symbols-outlined text-amber-500 text-sm">warning</span>
                )}
             </div>
          ))}
        </div>

        <button 
          onClick={handleSubmit}
          disabled={isGrading}
          className="w-full max-w-xs bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2 group"
        >
          {isGrading ? (
            <span className="material-symbols-outlined animate-spin">sync</span>
          ) : (
            <>
              Submit for Grading
              <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">send</span>
            </>
          )}
        </button>
        <button onClick={() => setIsFinished(false)} className="mt-4 text-slate-400 font-bold text-xs uppercase hover:text-slate-600 transition-colors">Go Back</button>
      </div>
    );
  }

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="p-8 md:p-12 relative overflow-hidden h-full flex flex-col">
      {/* Background patterns */}
      <div className="absolute top-0 right-0 p-4">
        <span className="text-slate-50 font-black text-9xl select-none uppercase tracking-tighter">AI</span>
      </div>

      <div className="relative z-10 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div className="space-y-1">
            <h3 className="text-2xl font-headline font-bold text-slate-900 tracking-tight">Adaptive Knowledge Check</h3>
            <p className="text-slate-400 text-sm">Answering for <span className="font-bold text-indigo-500">{quiz.topic}</span></p>
          </div>
          <div className="text-right">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Question</div>
            <div className="text-2xl font-headline font-black text-indigo-600">{currentQuestionIndex + 1}<span className="text-slate-300 font-medium">/{questions.length}</span></div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-slate-100 rounded-full mb-12 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-700 ease-out" style={{ width: `${progress}%` }}></div>
        </div>

        {/* Question Area */}
        <div className="flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full">
           <div className="animate-in fade-in slide-in-from-right-8 duration-500 key={currentQuestionIndex}">
              <h2 className="text-2xl font-bold text-slate-800 leading-tight mb-10">
                {currentQuestion.question}
              </h2>

              <div className="grid grid-cols-1 gap-4">
                {currentQuestion.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelect(opt)}
                    className={`p-6 rounded-2xl border-2 text-left transition-all duration-300 flex items-center justify-between group ${
                      answers[currentQuestionIndex] === opt 
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-md' 
                      : 'border-slate-100 bg-white hover:border-slate-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm transition-colors ${
                        answers[currentQuestionIndex] === opt ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-400'
                      }`}>
                        {String.fromCharCode(65 + i)}
                      </div>
                      <span className={`font-medium ${answers[currentQuestionIndex] === opt ? 'text-indigo-900' : 'text-slate-600'}`}>{opt}</span>
                    </div>
                    {answers[currentQuestionIndex] === opt && (
                      <span className="material-symbols-outlined text-indigo-600 animate-in zoom-in duration-300">check_circle</span>
                    )}
                  </button>
                ))}
              </div>
           </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-12 flex justify-between items-center">
            <button 
              onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex-1))}
              disabled={currentQuestionIndex === 0}
              className="text-slate-400 font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:text-indigo-600 transition-colors disabled:opacity-30"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Previous
            </button>
            <button 
              onClick={handleNext}
              disabled={!answers[currentQuestionIndex]}
              className={`px-10 py-4 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:grayscale ${
                answers[currentQuestionIndex] ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:-translate-y-0.5' : 'bg-slate-200 text-slate-400'
              }`}
            >
              {currentQuestionIndex === questions.length - 1 ? 'Finish Assessment' : 'Next Question'}
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
        </div>
      </div>
    </div>
  );
}
