import { Link } from 'react-router-dom';
import Layout from './components/Layout';
import { useApp } from './context/AppContext';

export default function StudentDashboard() {
  const { assignments, submitAssignment, isGrading } = useApp();

  return (
    <Layout>
      <main className="flex-1 lg:ml-[280px] mr-0 xl:mr-[400px] p-8 lg:p-12 space-y-12 animate-in fade-in duration-500">
        {/* Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-4">
            <h1 className="text-6xl font-headline text-on-surface leading-tight font-medium">
              Good morning, <br/><span className="italic text-violet-600 font-bold">Julianne.</span>
            </h1>
            <p className="text-xl text-slate-500 max-w-xl leading-relaxed">Your research on Renaissance perspective is 85% complete. Your scholarly assistants are refining your bibliography.</p>
          </div>
          
          <div className="lg:col-span-4 bg-white p-10 rounded-[2.5rem] shadow-[0_10px_30px_-5px_rgba(93,63,211,0.1)] flex flex-col items-center justify-center text-center space-y-4 relative overflow-hidden group border border-slate-50">
            <div className="absolute inset-0 bg-violet-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle className="text-slate-100" cx="72" cy="72" fill="transparent" r="64" stroke="currentColor" strokeWidth="12" />
                <circle className="text-violet-600 drop-shadow-[0_0_8px_rgba(99,102,241,0.4)]" cx="72" cy="72" fill="transparent" r="64" stroke="currentColor" strokeDasharray="402" strokeDashoffset="32" strokeLinecap="round" strokeWidth="12" />
              </svg>
              <span className="absolute text-4xl font-headline font-extrabold text-slate-800">92%</span>
            </div>
            <h3 className="font-bold text-xs uppercase tracking-[0.2em] text-slate-400 relative z-10">Overall Grade</h3>
          </div>
        </section>

        {/* Deadlines Map from Database */}
        <section className="space-y-8">
          <div className="flex justify-between items-end">
            <h2 className="text-3xl font-headline font-bold">Upcoming Deadlines</h2>
            <Link to="/assignments" className="text-violet-600 font-bold hover:underline text-sm flex items-center gap-1 group cursor-pointer">
              View All Calendar 
              <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {assignments.filter(a => a.status === 'pending').map((assignment, idx) => (
              <div key={assignment.id} className={`bg-white p-8 rounded-[2rem] shadow-sm border-t-8 ${idx === 0 ? 'border-orange-500' : 'border-violet-600'} hover:-translate-y-1 hover:shadow-xl transition-all relative overflow-hidden`}>
                <div className="flex justify-between items-start mb-6">
                  <span className={`px-4 py-1.5 text-[10px] font-extrabold rounded-full uppercase tracking-widest ${idx === 0 ? 'bg-orange-50 text-orange-600' : 'bg-violet-50 text-violet-600'}`}>
                    {assignment.urgency}
                  </span>
                  <span className="text-xs font-bold text-slate-400">{assignment.dueDate}</span>
                </div>
                <h4 className="text-2xl font-headline font-bold mb-3">{assignment.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">{assignment.description}</p>
                <button 
                  onClick={() => submitAssignment(assignment.id)}
                  disabled={isGrading}
                  className="text-violet-600 font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all disabled:opacity-50"
                >
                  {isGrading ? 'Grading Assistant Analyzing...' : 'Submit Task'} <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Feedback Logic */}
        <section className="space-y-8 pb-12">
          <h2 className="text-3xl font-headline font-bold">Recent Feedback</h2>
          <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-[0_10px_30px_-5px_rgba(93,63,211,0.1)] flex flex-col md:flex-row border border-slate-50">
            <div className="p-10 flex-1 space-y-8 border-r border-slate-50">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl">psychology</span>
                </div>
                <div>
                  <h4 className="font-bold text-lg text-slate-800">Grading System</h4>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Macroeconomics • Automated Response</p>
                </div>
              </div>
              <p className="text-2xl italic font-headline text-slate-600 leading-relaxed">
                "Julianne, your analysis of market volatility shows a sophisticated grasp of historical patterns. The way you integrated AI-generated data sets was particularly impressive."
              </p>
            </div>
            <div className="bg-violet-600/5 p-12 flex flex-col items-center justify-center min-w-[240px]">
              <span className="text-[10px] text-violet-600 font-black uppercase tracking-[0.3em] mb-4">Final Grade</span>
              <span className="text-8xl font-headline font-bold text-violet-600 drop-shadow-md">A+</span>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
