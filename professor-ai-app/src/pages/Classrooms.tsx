import Layout from '../components/Layout';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

export default function Classrooms() {
  const { courses, openModal } = useApp();
  const navigate = useNavigate();

  return (
    <Layout>
      <main className="flex-1 lg:ml-[280px] mr-0 xl:mr-[400px] p-8 lg:p-12 space-y-12 animate-in fade-in duration-500">
        <div className="flex justify-between items-end border-b border-slate-100 pb-6">
          <h1 className="text-4xl font-headline font-medium text-slate-900 tracking-tight">Active Classrooms</h1>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map(course => (
            <div key={course.id} onClick={() => navigate(`/classrooms/${course.id}`)} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative cursor-pointer">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-[100px] -z-0 group-hover:scale-110 transition-transform"></div>
              
              <div className="relative z-10">
                <span className="text-xs font-black uppercase tracking-widest text-violet-600 bg-violet-600/10 px-3 py-1.5 rounded-xl">{course.code}</span>
                <h3 className="font-bold text-2xl mt-5 text-slate-800 leading-tight">{course.name}</h3>
                <p className="text-sm font-medium text-slate-400 mt-2 flex justify-between items-center">
                  <span>{course.term}</span>
                  <span className="text-violet-600 flex items-center group-hover:translate-x-1 transition-transform">Enter <span className="material-symbols-outlined text-[1rem]">arrow_forward</span></span>
                </p>
              </div>
            </div>
          ))}
          
          <div onClick={() => openModal('course')} className="bg-slate-50 border-2 border-dashed border-slate-200 p-8 rounded-3xl flex flex-col items-center justify-center text-center hover:border-violet-400 hover:bg-violet-50/50 transition-colors cursor-pointer text-slate-500 hover:text-violet-600 min-h-[220px]">
            <span className="material-symbols-outlined text-4xl mb-4">add_circle</span>
            <h3 className="font-bold text-lg">Create New Course</h3>
            <p className="text-xs mt-1">Initialize Syllabus Agent setup</p>
          </div>
        </section>
      </main>
    </Layout>
  );
}
