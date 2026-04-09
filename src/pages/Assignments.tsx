import Layout from '../components/Layout';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export default function Assignments() {
  const { assignments, submitAssignment, isGrading } = useApp();
  const { user } = useAuth();

  return (
    <Layout>
      <main className="flex-1 lg:ml-[280px] p-8 lg:p-12 space-y-10 animate-in fade-in duration-500">
        <div className="border-b border-slate-100 pb-6">
          <h1 className="text-4xl font-headline font-medium text-slate-900 tracking-tight">Timeline & Tasks</h1>
          <p className="text-slate-500 mt-2">Comprehensive view of all calendar operations.</p>
        </div>

        <section className="relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
          {assignments.map((assignment) => (
            <div key={assignment.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group mb-8">
              <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-white bg-slate-100 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 shadow-sm text-slate-400 group-hover:bg-violet-600 group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-sm">{assignment.status === 'graded' ? 'verified' : 'timer'}</span>
              </div>
              
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-6 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all">
                <div className="flex items-center justify-between space-x-2 mb-2">
                  <span className={`px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest rounded-lg ${assignment.status === 'graded' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>{assignment.status}</span>
                  <time className="text-xs font-bold text-slate-400">{assignment.due_date}</time>
                </div>
                <h3 className="font-bold text-lg text-slate-800">{assignment.title}</h3>
                <p className="text-sm text-slate-500 mt-2 leading-relaxed">{assignment.description}</p>
                
                {user?.role === 'student' && assignment.status === 'pending' && (
                  <button onClick={() => submitAssignment(assignment.id)} disabled={isGrading} className="mt-4 text-violet-600 text-xs font-bold uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all disabled:opacity-50">
                    {isGrading ? 'Processing Submission...' : 'Execute Hand-in'} <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </section>
      </main>
    </Layout>
  );
}
