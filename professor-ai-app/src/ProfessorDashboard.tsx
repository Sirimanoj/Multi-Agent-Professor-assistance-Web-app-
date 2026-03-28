import { useRef } from 'react';
import { Link } from 'react-router-dom';
import Layout from './components/Layout';
import { useApp } from './context/AppContext';

export default function ProfessorDashboard() {
  const { courses, assignments, uploadMaterial, isGeneratingAssignment, openModal } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadMaterial(file);
    }
  };

  return (
    <Layout>
      <main className="flex-1 lg:ml-[280px] mr-0 xl:mr-[400px] p-8 lg:p-12 space-y-12 animate-in fade-in duration-500">
        {/* Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-4">
            <h1 className="text-6xl font-headline text-on-surface leading-tight font-medium">
              Good morning, <br/><span className="italic text-violet-600 font-bold">Dr. Thorne.</span>
            </h1>
            <p className="text-xl text-slate-500 max-w-xl leading-relaxed">Your Syllabus and Grading Agents have summarized overnight activity. You have 3 pending tasks.</p>
          </div>
          
          {/* Quick Stats */}
          <div className="lg:col-span-4 bg-white p-10 rounded-[2.5rem] shadow-[0_10px_30px_-5px_rgba(93,63,211,0.1)] flex flex-col items-center justify-center text-center space-y-4 relative overflow-hidden group border border-slate-50 hover:shadow-[0_20px_40px_-5px_rgba(93,63,211,0.15)] transition-all">
            <div className="absolute inset-0 bg-violet-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <span className="text-6xl font-headline font-bold text-violet-600 drop-shadow-md">84%</span>
            <h3 className="font-bold text-xs uppercase tracking-[0.2em] text-slate-400 relative z-10">Class Average</h3>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Upload Materials */}
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 hover:-translate-y-1 hover:shadow-xl transition-all relative overflow-hidden group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".pdf,.doc,.docx" />
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                <span className="material-symbols-outlined">upload_file</span>
              </div>
            </div>
            <h4 className="text-2xl font-headline font-bold mb-3">Upload Materials</h4>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">Syllabus Agent will automatically parse and distribute uploaded PDFs.</p>
            <button className="text-indigo-500 font-bold text-xs uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
              Initialize Upload <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>

          {/* Generate Assignment */}
          <div onClick={() => openModal('generate')} className="bg-gradient-to-br from-violet-600 to-indigo-600 text-white p-8 rounded-[2rem] shadow-[0_10px_20px_rgba(99,102,241,0.2)] hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(99,102,241,0.3)] transition-all relative overflow-hidden group cursor-pointer">
            <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-125 group-hover:-rotate-12 transition-transform duration-700">
              <span className="material-symbols-outlined text-[10rem]">auto_fix_high</span>
            </div>
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center">
                {isGeneratingAssignment ? <span className="material-symbols-outlined animate-spin">sync</span> : <span className="material-symbols-outlined">design_services</span>}
              </div>
            </div>
            <h4 className="text-2xl font-headline font-bold mb-3 relative z-10">Generate Assignment</h4>
            <p className="text-indigo-100 text-sm leading-relaxed mb-6 relative z-10">
              {isGeneratingAssignment ? 'Knowledge Agent is compiling rigorous rubrics...' : 'Knowledge Agent will create adaptive rubrics based on recent curriculum updates.'}
            </p>
            <button disabled={isGeneratingAssignment} className="bg-white text-violet-600 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg relative z-10 active:scale-95 transition-transform">
              {isGeneratingAssignment ? 'Generating...' : 'Start Creation'} <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </section>

        {/* Active Classrooms & Submissions */}
        <section className="space-y-8">
          <div className="flex justify-between items-end">
            <h2 className="text-3xl font-headline font-bold">Active Classrooms</h2>
            <Link to="/assignments" className="text-violet-600 font-bold hover:underline text-sm flex items-center gap-1 group cursor-pointer">
              View All <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
              <div key={course.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-[10px] font-black uppercase tracking-widest text-violet-600 bg-violet-50 px-2 py-1 rounded-md">{course.code}</span>
                <h3 className="font-bold text-lg mt-3 text-slate-800">{course.name}</h3>
                <p className="text-sm text-slate-500 mt-1">{course.term}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-8 pb-12">
          <h2 className="text-3xl font-headline font-bold">Recent Assignments Output</h2>
          <div className="space-y-4">
            {assignments.map(assignment => (
              <div key={assignment.id} className="bg-white p-6 rounded-3xl border border-slate-100 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-5">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${assignment.status === 'graded' ? 'bg-emerald-50 text-emerald-500' : 'bg-orange-50 text-orange-500'}`}>
                    <span className="material-symbols-outlined">{assignment.status === 'graded' ? 'check_circle' : 'pending_actions'}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">{assignment.title}</h4>
                    <p className="text-xs text-slate-500 lg:w-[400px] truncate">{assignment.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block text-sm font-bold text-slate-700">{assignment.status.toUpperCase()}</span>
                  <span className="text-xs text-slate-400">Due: {assignment.dueDate}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </Layout>
  );
}
