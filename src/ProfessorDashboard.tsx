import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from './components/Layout';
import { useApp } from './context/AppContext';
import { useAuth } from './context/AuthContext';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from './lib/supabase';

export default function ProfessorDashboard() {
  const { courses, assignments, uploadMaterial, addLinkMaterial, isUploading, isGeneratingAssignment, generateQuizAssignment, generateProjectAssignment, openModal, openInterventionModal, profiles, usersList, notifications, markClassAttended } = useApp();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingLink, setIsUploadingLink] = useState(false);
  const [targetCourseId, setTargetCourseId] = useState<string | null>(null);

  const getUserName = (id: string) => usersList.find(u => u.id === id)?.name || id;
  const strugglingStudents = profiles.filter(p => p.weak_concepts.length > 0);
  const topPerformers = profiles.filter(p => p.weak_concepts.length === 0 && p.strong_concepts.length > 0);

  const classAverageData = [
    { grade: 'A', students: 12 },
    { grade: 'B', students: 8 },
    { grade: 'C', students: 4 },
    { grade: 'D', students: 2 },
    { grade: 'F', students: 1 },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && targetCourseId) {
      uploadMaterial(file, targetCourseId);
    }
    setTargetCourseId(null);
  };

  const triggerUpload = (courseId: string) => {
    setTargetCourseId(courseId);
    fileInputRef.current?.click();
  };

  const handleLinkUpload = async (courseId: string) => {
    const url = prompt("Enter the Google Slides or Resource URL:");
    if (url) {
      setIsUploadingLink(true);
      await addLinkMaterial(url, courseId);
      setIsUploadingLink(false);
    }
  };

  const handleAssignQuiz = async (courseId: string) => {
    const topic = prompt("Enter the topic or chapter for this Quiz (e.g., 'Thermodynamics'):");
    if (topic) {
      // Fetch some materials for selection
      const { data: mats } = await supabase.from('materials').select('id, title').eq('course_id', courseId).limit(5);
      const matList = mats?.map((m, i) => `${i+1}. ${m.title}`).join('\n') || "No materials found";
      const choice = prompt(`Select grounding material index (1-${mats?.length || 1}) or click Cancel for auto-search:\n${matList}`);
      
      const selectedMaterialId = (choice && mats?.[parseInt(choice)-1]) ? mats[parseInt(choice)-1].id : undefined;
      
      await generateQuizAssignment(topic, courseId, selectedMaterialId);
      alert(`Quiz for "${topic}" generated and assigned!`);
    }
  };

  const handleAssignProject = async (courseId: string) => {
    const topic = prompt("Enter the focus area for this Project:");
    if (topic) {
      await generateProjectAssignment(topic, courseId);
      alert(`Project for "${topic}" generated and assigned!`);
    }
  };

  return (
    <Layout>
      <main className="flex-1 lg:ml-[280px] p-8 lg:p-12 space-y-12 animate-in fade-in duration-500">
        {/* Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-4">
            <h1 className="text-6xl font-headline text-on-surface leading-tight font-medium">
              Good morning, <br/><span className="italic text-violet-600 font-bold">{user?.name || 'Professor'}.</span>
            </h1>
            <p className="text-xl text-slate-500 max-w-xl leading-relaxed">Your Syllabus and Grading Agents have summarized overnight activity. You have 3 pending tasks.</p>
          </div>
          
          {/* Quick Stats */}
          <div className="lg:col-span-4 bg-white p-8 rounded-[2.5rem] shadow-[0_10px_30px_-5px_rgba(93,63,211,0.1)] flex flex-col items-center justify-center text-center space-y-2 relative overflow-hidden group border border-slate-50 hover:shadow-[0_20px_40px_-5px_rgba(93,63,211,0.15)] transition-all">
            <div className="absolute inset-0 bg-violet-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <span className="text-5xl font-headline font-bold text-violet-600 drop-shadow-md">84%</span>
            <h3 className="font-bold text-xs uppercase tracking-[0.2em] text-slate-400 relative z-10 mb-2">Class Average</h3>
            <div className="w-full h-24 relative z-10 pt-2">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={classAverageData}>
                   <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: '1px solid #f1f5f9', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                   <Bar dataKey="students" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                   <XAxis dataKey="grade" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} />
                 </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Quick Actions (Simplified) */}
        <section>
          <div 
            onClick={() => openModal('course')} 
            className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 hover:-translate-y-1 hover:shadow-xl transition-all relative overflow-hidden group cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-3xl bg-violet-50 text-violet-600 flex items-center justify-center group-hover:bg-violet-600 group-hover:text-white transition-all transform group-hover:rotate-6">
                <span className="material-symbols-outlined text-3xl">add_circle</span>
              </div>
              <div>
                <h4 className="text-2xl font-headline font-bold mb-1">Create New Classroom</h4>
                <p className="text-slate-500 text-sm">Initialize a new secure academic environment.</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-slate-300 group-hover:text-violet-600 transition-colors">arrow_forward_ios</span>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".pdf,.doc,.docx" />

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

        {/* Class Insights & Demographics */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-4">
          {/* Early Warning System */}
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-red-100 relative overflow-hidden group">
            <h3 className="font-headline font-bold text-xl mb-4 flex items-center gap-2 text-slate-800">
              <span className="material-symbols-outlined text-red-500">warning</span>
              Early Warning System
            </h3>

            {notifications?.filter(n => n.title === 'Early Warning').map(n => (
              <div key={n.id} className="mb-4 bg-red-50 p-3 rounded-xl border border-red-100 text-sm animate-in fade-in slide-in-from-top-2">
                <span className="font-bold text-red-700 block mb-1">Automated Alert</span>
                <span className="text-red-600 line-clamp-3 text-xs leading-snug">{n.message}</span>
              </div>
            ))}

            <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-3 mt-5">Struggling Track</h4>
            <ul className="space-y-3">
              {strugglingStudents?.map(p => (
                <li key={p.user_id} onClick={() => openInterventionModal(p.user_id)} className="flex justify-between items-center text-sm border border-red-200 bg-red-50 p-3 rounded-xl cursor-pointer hover:bg-white hover:border-red-300 hover:shadow-sm transition-all group">
                  <span className="font-bold text-red-700 truncate mr-2 flex items-center gap-2"><span className="material-symbols-outlined text-sm text-red-400 group-hover:text-red-500 animate-pulse">priority_high</span> {getUserName(p.user_id)}</span>
                  <div className="flex gap-2">
                     <span className="text-[10px] bg-red-100 text-red-800 border border-red-200 px-2 py-1 rounded-md font-bold uppercase truncate max-w-[120px]">Score &lt; 30%</span>
                     <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-1 rounded-md font-bold uppercase truncate max-w-[120px] hidden md:inline-block">{p.weak_concepts[0] || 'Multiple'}</span>
                  </div>
                </li>
              ))}
              {(strugglingStudents?.length === 0) && <p className="text-xs text-slate-400 font-bold italic">No students currently flagged.</p>}
            </ul>
          </div>

          {/* Top Performers */}
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-50 relative overflow-hidden group">
            <h3 className="font-headline font-bold text-xl mb-4 flex items-center gap-2 text-slate-800">
              <span className="material-symbols-outlined text-emerald-500">verified</span>
              Top Performers
            </h3>
            <ul className="space-y-3">
              {topPerformers?.map(p => (
                <li key={p.user_id} className="flex justify-between items-center text-sm border-b border-slate-50 pb-3 h-10 line-clamp-1">
                   <span className="font-bold text-slate-700 truncate mr-2">{getUserName(p.user_id)}</span>
                   <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-1 rounded-md font-bold uppercase truncate max-w-[120px]">{p.strong_concepts[0] || 'All'}</span>
                </li>
              ))}
              {(topPerformers?.length === 0) && <p className="text-xs text-slate-400 font-bold italic">No students currently flagged.</p>}
            </ul>
          </div>

          {/* AI Teaching Suggestion */}
          <div className="bg-gradient-to-br from-indigo-50 to-violet-50 p-8 rounded-[2rem] shadow-sm border border-violet-100 flex flex-col justify-center">
            <h3 className="font-headline font-bold text-xl mb-2 text-indigo-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-indigo-500">tips_and_updates</span>
              AI Teaching Insight
            </h3>
            <p className="text-indigo-800/80 leading-relaxed text-sm mb-4">
              {strugglingStudents?.length > 0 ? `Multiple students are struggling with ${strugglingStudents[0].weak_concepts[0]}. Consider scheduling a supplementary interactive session on this topic.` : `The class is performing exceptionally well. Consider advancing to the next module.`}
            </p>
            <button className="self-start bg-white text-indigo-600 border border-indigo-100 px-4 py-2 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-indigo-50 transition-colors shadow-sm">
              Generate Lesson Plan
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
            {courses?.map(course => (
              <div key={course.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-black uppercase tracking-widest text-violet-600 bg-violet-50 px-2.5 py-1.5 rounded-xl border border-violet-100">{course.code}</span>
                    <button onClick={() => markClassAttended(course.id)} className="w-8 h-8 rounded-full hover:bg-violet-50 text-slate-300 hover:text-violet-600 transition-colors flex items-center justify-center">
                       <span className="material-symbols-outlined text-xl">verified</span>
                    </button>
                  </div>
                  <h3 className="font-bold text-xl mt-4 text-slate-800 group-hover:text-violet-600 transition-colors">{course.name}</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">{course.term}</p>
                  
                  <div className="mt-8 grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => triggerUpload(course.id)}
                      disabled={isUploading}
                      className="w-full flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 border border-slate-100 text-slate-600 hover:bg-white hover:border-violet-200 hover:text-violet-600 transition-all font-bold text-[9px] uppercase tracking-widest group/btn disabled:opacity-50 gap-2 h-20"
                    >
                      <span className={`material-symbols-outlined text-2xl opacity-70 group-hover/btn:opacity-100 transition-opacity ${isUploading ? 'animate-spin' : ''}`}>
                        {isUploading ? 'sync' : 'upload_file'}
                      </span>
                      {isUploading ? 'Uploading...' : 'Material'}
                    </button>

                    <button 
                      onClick={() => handleLinkUpload(course.id)}
                      disabled={isUploadingLink}
                      className="w-full flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 border border-slate-100 text-slate-600 hover:bg-white hover:border-violet-200 hover:text-violet-600 transition-all font-bold text-[9px] uppercase tracking-widest group/btn gap-2 h-20"
                    >
                      <span className={`material-symbols-outlined text-2xl opacity-70 group-hover/btn:opacity-100 transition-opacity ${isUploadingLink ? 'animate-spin' : ''}`}>
                        {isUploadingLink ? 'sync' : 'link'}
                      </span>
                      {isUploadingLink ? 'Adding...' : 'Resource Link'}
                    </button>
                    
                    <button 
                      onClick={() => handleAssignQuiz(course.id)}
                      className="w-full flex flex-col items-center justify-center p-3 rounded-2xl bg-violet-50 border border-violet-100 text-violet-600 hover:bg-violet-600 hover:border-violet-600 hover:text-white transition-all font-bold text-[9px] uppercase tracking-widest group/btn gap-2 h-20 shadow-sm"
                    >
                      <span className="material-symbols-outlined text-2xl opacity-90 transition-opacity">
                        quiz
                      </span>
                      Assign Quiz
                    </button>
                    
                    <button 
                      onClick={() => handleAssignProject(course.id)}
                      className="w-full flex flex-col items-center justify-center p-3 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 hover:bg-indigo-600 hover:border-indigo-600 hover:text-white transition-all font-bold text-[9px] uppercase tracking-widest group/btn gap-2 h-20 shadow-sm"
                    >
                      <span className="material-symbols-outlined text-2xl opacity-90 transition-opacity">
                        assignment_turned_in
                      </span>
                      Assign Project
                    </button>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between text-[9px] font-black text-slate-300 uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    Active Node
                  </div>
                  <span>Agent Sync: Daily</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-8 pb-12">
          <h2 className="text-3xl font-headline font-bold">Recent Assignments Output</h2>
          <div className="space-y-4">
            {assignments?.map(assignment => (
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
                  <span className="text-xs text-slate-400">Due: {assignment.due_date}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </Layout>
  );
}
