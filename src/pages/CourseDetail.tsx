import { useState, useRef, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export default function CourseDetail() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const { 
    courses, assignments, announcements, usersList, materials, studiedMaterials, 
    markMaterialStudied, generateAdaptiveQuiz, quizzes, isGeneratingQuiz, 
    openModal, setCourseContext, postAnnouncement,
    uploadMaterial, addLinkMaterial, submitAssignment, profiles, setActiveStudentId 
  } = useApp();
  
  const [activeTab, setActiveTab] = useState<'stream' | 'classwork' | 'people' | 'grades'>('stream');
  const [announcementText, setAnnouncementText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [assignmentFiles, setAssignmentFiles] = useState<Record<string, File>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (courseId) {
      setCourseContext(courseId);
    }
    return () => setCourseContext(null);
  }, [courseId]);

  const course = courses.find(c => c.id === courseId);

  if (!course) {
    return <Navigate to="/classrooms" replace />;
  }

  const courseAssignments = assignments.filter(a => a.course_id === courseId);
  const courseAnnouncements = announcements.filter(a => a.course_id === courseId);
  const courseStudents = usersList.filter(u => u.role === 'student'); 
  const courseTeacher = usersList.find(u => u.name === course.instructor_id) || usersList.find(u => u.role === 'professor');

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementText.trim() || !user) return;
    postAnnouncement(course.id, announcementText, user.name);
    setAnnouncementText('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && courseId) {
      uploadMaterial(file, courseId);
    }
  };

  const handleAddLink = () => {
    if (linkUrl.trim() && courseId) {
      addLinkMaterial(linkUrl, courseId);
      setLinkUrl('');
      setIsAddingLink(false);
    }
  };

  const getUrgencyColor = (u: string) => {
    if (u === 'high') return 'bg-red-50 text-red-600';
    if (u === 'medium') return 'bg-orange-50 text-orange-600';
    return 'bg-blue-50 text-blue-600';
  };

  const activeTabClass = (tabId: string) => 
    `px-6 py-4 font-bold text-sm transition-all border-b-4 ${activeTab === tabId ? 'border-violet-600 text-violet-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`;

  return (
    <Layout>
      <main className="flex-1 lg:ml-[280px] animate-in fade-in duration-500">
        
        {/* Course Hero Banner */}
        <section className="bg-gradient-to-br from-violet-600 to-indigo-700 text-white p-8 lg:p-12 relative overflow-hidden min-h-[240px] flex flex-col justify-end">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 backdrop-blur-3xl rounded-full transform translate-x-32 -translate-y-32"></div>
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
          
          <div className="relative z-10">
            <h1 className="text-4xl lg:text-5xl font-headline font-bold drop-shadow-md">{course.name}</h1>
            <p className="text-violet-100 font-medium mt-2 drop-shadow-sm">{course.term} • {course.instructor_id}</p>
            <div className="mt-4 font-mono bg-white/20 backdrop-blur-md px-3 py-1 rounded inline-block text-xs font-bold tracking-widest shadow-lg">
              Class Code: {course.code}
            </div>
          </div>
        </section>

        {/* Local Navigation Tabs */}
        <div className="border-b border-slate-200 bg-white sticky top-0 z-20 shadow-sm flex overflow-x-auto">
          <button className={activeTabClass('stream')} onClick={() => setActiveTab('stream')}>Stream</button>
          <button className={activeTabClass('classwork')} onClick={() => setActiveTab('classwork')}>Classwork</button>
          <button className={activeTabClass('people')} onClick={() => setActiveTab('people')}>People</button>
          {user?.role === 'professor' && (
            <button className={activeTabClass('grades')} onClick={() => setActiveTab('grades')}>Grades</button>
          )}
        </div>

        {/* Tab Content Rendering */}
        <div className="p-8 lg:p-12 max-w-5xl mx-auto">
          
          {/* STREAM VIEW */}
          {activeTab === 'stream' && (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Upcoming Mini-Sidebar */}
              <div className="w-full lg:w-64 shrink-0 space-y-4 hidden md:block">
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                  <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-violet-600 text-sm">event</span> Upcoming
                  </h3>
                  {courseAssignments.filter(a => a.status === 'pending').slice(0,3).map(a => (
                    <div key={a.id} className="mb-3 last:mb-0">
                      <p className="text-xs text-slate-500 font-bold mb-1">{a.due_date}</p>
                      <p className="text-sm text-slate-700 font-medium truncate">{a.title}</p>
                    </div>
                  ))}
                  {courseAssignments.filter(a => a.status === 'pending').length === 0 && (
                    <p className="text-xs text-slate-400 font-medium">No work due soon!</p>
                  )}
                  <button onClick={() => setActiveTab('classwork')} className="w-full text-right text-xs font-bold text-violet-600 mt-4 hover:underline">View all</button>
                </div>
              </div>

              {/* Feed Content */}
              <div className="flex-1 space-y-6">
                
                {/* Create Post Field */}
                {user?.role === 'professor' && (
                  <form onSubmit={handlePost} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm group hover:shadow-md transition-shadow">
                    <textarea 
                      value={announcementText}
                      onChange={e => setAnnouncementText(e.target.value)}
                      placeholder="Announce something to your class..."
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-4 resize-none outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-500 transition-all text-sm font-medium"
                      rows={3}
                    />
                    <div className="flex justify-end">
                      <button type="submit" disabled={!announcementText.trim()} className="bg-violet-600 text-white px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-violet-600/20 active:scale-95 transition-transform disabled:opacity-50">Post</button>
                    </div>
                  </form>
                )}

                {/* Feed Items */}
                {courseAnnouncements.map(an => (
                  <div key={an.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center font-bold text-sm">
                          {an.author_name[0]}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{an.author_name}</p>
                          <p className="text-xs font-medium text-slate-400">{an.timestamp}</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{an.content}</p>
                  </div>
                ))}
                {courseAnnouncements.length === 0 && (
                  <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-3xl">
                    <p className="text-slate-500 font-medium">This is where you can talk to your class.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* CLASSWORK VIEW */}
          {activeTab === 'classwork' && (
            <div className="space-y-12">
              
              {/* Professor Action Hub */}
              {user?.role === 'professor' && (
                <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 lg:p-10 shadow-2xl relative overflow-hidden group mb-12">
                   <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/20 rounded-full blur-3xl -translate-y-32 translate-x-32"></div>
                   <div className="relative z-10">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-violet-600 flex items-center justify-center">
                          <span className="material-symbols-outlined text-2xl">electric_bolt</span>
                        </div>
                        <div>
                          <h2 className="text-2xl font-headline font-bold">Professor Action Hub</h2>
                          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Deploy Knowledge Assets & Assessments</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <button 
                          onClick={() => fileInputRef.current?.click()}
                          className="flex flex-col items-center justify-center p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 hover:border-violet-500/50 transition-all group/btn"
                        >
                          <span className="material-symbols-outlined text-3xl text-violet-400 mb-3 group-hover/btn:scale-110 transition-transform">upload_file</span>
                          <span className="font-bold text-xs uppercase tracking-widest">Upload Doc</span>
                          <p className="text-[10px] text-slate-500 mt-2">PDF Analysis Engine</p>
                        </button>

                        <button 
                          onClick={() => setIsAddingLink(true)}
                          className="flex flex-col items-center justify-center p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 hover:border-indigo-500/50 transition-all group/btn"
                        >
                          <span className="material-symbols-outlined text-3xl text-indigo-400 mb-3 group-hover/btn:scale-110 transition-transform">add_link</span>
                          <span className="font-bold text-xs uppercase tracking-widest">Assign Topic</span>
                          <p className="text-[10px] text-slate-500 mt-2">Study Goals & Resources</p>
                        </button>

                        <button 
                          onClick={() => {
                            const courseMaterials = materials.filter(m => m.course_id === courseId);
                            const latestMaterial = courseMaterials[0];
                            if (latestMaterial) generateAdaptiveQuiz(latestMaterial.id, latestMaterial.title, courseId!);
                            else alert("Please upload a PDF or add a link to this classroom first so I can generate an adaptive quiz from it.");
                          }}
                          className="flex flex-col items-center justify-center p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 hover:border-emerald-500/50 transition-all group/btn"
                        >
                          <span className="material-symbols-outlined text-3xl text-emerald-400 mb-3 group-hover/btn:scale-110 transition-transform">quiz</span>
                          <span className="font-bold text-xs uppercase tracking-widest">Assign Quiz</span>
                          <p className="text-[10px] text-slate-500 mt-2">Adaptive AI Evaluation</p>
                        </button>

                        <button 
                          onClick={() => openModal('generate')}
                          className="flex flex-col items-center justify-center p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 hover:border-orange-500/50 transition-all group/btn"
                        >
                          <span className="material-symbols-outlined text-3xl text-orange-400 mb-3 group-hover/btn:scale-110 transition-transform">assignment_turned_in</span>
                          <span className="font-bold text-xs uppercase tracking-widest">Assign Assignment</span>
                          <p className="text-[10px] text-slate-500 mt-2">Generative Task Creator</p>
                        </button>
                      </div>
                   </div>
                </div>
              )}

              {/* Materials Section */}
              <div className="mb-10">
                <h2 className="text-2xl font-headline font-bold text-indigo-600 border-b-2 border-slate-100 pb-3 mb-6 flex justify-between items-end">
                  Course Materials
                  {user?.role === 'professor' && (
                    <div className="flex gap-2">
                       <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileUpload} 
                        className="hidden" 
                        accept=".pdf" 
                      />
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-violet-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-violet-700 transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-sm">upload</span> Upload PDF
                      </button>
                      <button 
                        onClick={() => setIsAddingLink(!isAddingLink)}
                        className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-sm">link</span> Add Link
                      </button>
                    </div>
                  )}
                </h2>

                {isAddingLink && (
                  <div className="mb-6 bg-slate-50 p-4 rounded-2xl flex gap-2 animate-in slide-in-from-top-2 duration-300">
                    <input 
                      type="url" 
                      placeholder="Enter material URL..." 
                      className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-100"
                      value={linkUrl}
                      onChange={e => setLinkUrl(e.target.value)}
                    />
                    <button onClick={handleAddLink} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest">Add</button>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {materials.filter(m => m.course_id === courseId).map(material => {
                     const isStudied = studiedMaterials.has(material.id);
                     const quiz = quizzes.find(q => q.material_id === material.id);
                     
                     return (
                       <div key={material.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center group-hover:bg-violet-600 group-hover:text-white transition-colors">
                                <span className="material-symbols-outlined">{material.type === 'link' ? 'link' : 'description'}</span>
                              </div>
                              <div>
                                <h4 className="font-bold text-slate-800">{material.title}</h4>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{material.type} • {material.date_added.split('T')[0]}</p>
                              </div>
                            </div>
                            {material.url && (
                              <a href={material.url} target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-violet-600 transition-colors">
                                <span className="material-symbols-outlined">open_in_new</span>
                              </a>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2 mt-2">
                             {!isStudied && user?.role === 'student' ? (
                               <button 
                                 onClick={() => markMaterialStudied(material.id)}
                                 className="flex-1 bg-violet-100 text-violet-700 font-bold text-xs py-2 rounded-lg hover:bg-violet-600 hover:text-white transition-all uppercase tracking-widest"
                               >
                                 Mark as Studied
                               </button>
                             ) : (!quiz && user?.role === 'student') ? (
                               <button 
                                 onClick={() => generateAdaptiveQuiz(material.id, material.title, courseId!)}
                                 disabled={isGeneratingQuiz}
                                 className="flex-1 bg-indigo-600 text-white font-bold text-xs py-2 rounded-lg hover:bg-indigo-700 transition-all uppercase tracking-widest flex items-center justify-center gap-2"
                               >
                                 {isGeneratingQuiz ? <span className="material-symbols-outlined animate-spin text-sm">sync</span> : <span className="material-symbols-outlined text-sm">auto_awesome</span>}
                                 Request AI Quiz
                               </button>
                             ) : (quiz && !quiz.completed && user?.role === 'student') ? (
                               <button 
                                 onClick={() => openModal('quiz', quiz.id)}
                                 className="flex-1 bg-emerald-600 text-white font-bold text-xs py-2 rounded-lg hover:bg-emerald-700 transition-all uppercase tracking-widest flex items-center justify-center gap-2"
                               >
                                 <span className="material-symbols-outlined text-sm">play_circle</span>
                                 Start Assessment
                               </button>
                             ) : (
                               <div className="flex-1 bg-slate-50 text-slate-500 font-bold text-xs py-2 px-4 rounded-lg flex items-center justify-between">
                                 <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm text-green-500">check_circle</span> Grade: {quiz?.score}%</span>
                                  <button onClick={() => quiz && openModal('quiz', quiz.id)} className="text-indigo-600 hover:underline">Review</button>
                               </div>
                             )}
                          </div>
                       </div>
                     );
                  })}
                  {materials.filter(m => m.course_id === courseId).length === 0 && (
                    <p className="text-slate-400 text-sm italic col-span-2">No materials posted yet.</p>
                  )}
                </div>
              </div>

              {['Week 1: Fundamentals', 'Midterms', 'Uncategorized'].map(topicGroup => {
                const topicAssignments = courseAssignments.filter(a => (a.topic || 'Uncategorized') === topicGroup);
                if (topicAssignments.length === 0) return null;

                const mustDo = topicAssignments.filter(a => a.type === 'must-do');
                const mayDo = topicAssignments.filter(a => a.type === 'may-do');

                return (
                  <div key={topicGroup} className="mb-10">
                    <h2 className="text-2xl font-headline font-bold text-violet-600 border-b-2 border-slate-100 pb-3 mb-6 flex justify-between items-end">
                      {topicGroup}
                    </h2>
                    
                    {mustDo.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500"></span> Core Requirements (Must-Do)</h3>
                        <div className="space-y-3">
                          {mustDo.map(assignment => (
                            <div key={assignment.id} className="bg-white group p-5 rounded-2xl shadow-sm hover:shadow-lg border border-slate-100 hover:border-violet-200 transition-all flex justify-between items-center cursor-pointer">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                  <span className="material-symbols-outlined text-lg">assignment</span>
                                </div>
                                <div>
                                  <h4 className="font-bold text-slate-800 group-hover:text-violet-600 transition-colors">{assignment.title}</h4>
                                  <p className="text-xs text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                                    <span className="material-symbols-outlined text-[12px]">schedule</span> Due {assignment.due_date}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                {user?.role === 'student' && assignment.status === 'pending' && (
                                  <div className="flex items-center gap-2">
                                    <label className="bg-slate-50 hover:bg-slate-100 text-slate-500 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest cursor-pointer border border-dashed border-slate-200 transition-colors">
                                      <span className="material-symbols-outlined text-xs align-middle mr-1">attach_file</span>
                                      {assignmentFiles[assignment.id] ? assignmentFiles[assignment.id].name : 'Attach File'}
                                      <input 
                                        type="file" 
                                        className="hidden" 
                                        onChange={(e) => {
                                          const file = e.target.files?.[0];
                                          if (file) setAssignmentFiles({...assignmentFiles, [assignment.id]: file});
                                        }}
                                      />
                                    </label>
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        submitAssignment(assignment.id, assignmentFiles[assignment.id]);
                                      }}
                                      className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-700 transition-all cursor-pointer shadow-md shadow-emerald-600/10"
                                    >
                                      Submit
                                    </button>
                                  </div>
                                )}
                                <span className={`px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${getUrgencyColor(assignment.urgency)}`}>
                                  {assignment.urgency}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {mayDo.length > 0 && (
                      <div>
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2 mt-6"><span className="w-2 h-2 rounded-full bg-emerald-400"></span> Exploration (May-Do)</h3>
                        <div className="space-y-3">
                          {mayDo.map(assignment => (
                            <div key={assignment.id} className="bg-slate-50 group p-5 rounded-2xl shadow-none hover:bg-white hover:shadow-md border border-transparent hover:border-emerald-200 transition-all flex justify-between items-center cursor-pointer border-dashed">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                  <span className="material-symbols-outlined text-lg">explore</span>
                                </div>
                                <div>
                                  <h4 className="font-bold text-slate-700 group-hover:text-emerald-700 transition-colors">{assignment.title}</h4>
                                  <p className="text-xs text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                                    <span className="material-symbols-outlined text-[12px]">star</span> Extra Credit & Deep Dive
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* PEOPLE VIEW */}
          {activeTab === 'people' && (
            <div className="space-y-10 max-w-3xl mx-auto">
              <div>
                <h2 className="text-3xl font-headline font-medium text-violet-600 border-b border-violet-200 pb-4 mb-6 flex justify-between items-end">
                  Teachers
                </h2>
                {courseTeacher && (
                  <div className="flex items-center gap-4 py-4 px-2 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer">
                    <img src={courseTeacher.avatar} alt="Professor" className="w-12 h-12 rounded-full object-cover" />
                    <span className="font-bold text-slate-800">{courseTeacher.name}</span>
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-3xl font-headline font-medium text-violet-600 border-b border-violet-200 pb-4 mb-6 flex justify-between items-end">
                  Students <span className="text-sm font-bold text-violet-400 bg-violet-50 px-3 py-1 rounded-full">{courseStudents.length} students</span>
                </h2>
                 <div className="space-y-2">
                  {courseStudents.map(student => {
                    const studentProfile = profiles.find(p => p.user_id === student.id);
                    const hasRedFlags = studentProfile && studentProfile.weak_concepts.length > 0;

                    return (
                      <div key={student.id} className="group flex items-center justify-between py-4 px-4 hover:bg-slate-50 rounded-2xl transition-all border-b border-slate-50 last:border-0 cursor-pointer">
                        <div className="flex items-center gap-4">
                          <img src={student.avatar} alt={student.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-transparent group-hover:ring-violet-500/20 transition-all" />
                          <div>
                            <span className="font-bold text-sm text-slate-800 block">{student.name}</span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Student ID: ...{student.id.slice(-4)}</span>
                          </div>
                        </div>
                        
                        {user?.role === 'professor' && (
                          <div className="flex items-center gap-3">
                            {hasRedFlags && (
                              <div className="flex items-center gap-1.5 bg-red-50 text-red-600 px-3 py-1.5 rounded-full border border-red-100 animate-pulse">
                                <span className="material-symbols-outlined text-sm">warning</span>
                                <span className="text-[10px] font-black uppercase tracking-widest">Red Flag</span>
                              </div>
                            )}
                            <button 
                              onClick={() => {
                                setActiveStudentId(student.id);
                                openModal('intervention');
                              }}
                              className="opacity-0 group-hover:opacity-100 bg-white border border-slate-200 text-slate-600 px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-violet-600 hover:text-white hover:border-violet-600 transition-all"
                            >
                              Intervene
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* GRADES VIEW (Professor Only) */}
          {activeTab === 'grades' && user?.role === 'professor' && (
            <div className="overflow-x-auto bg-white rounded-3xl shadow-sm border border-slate-100">
              <table className="w-full text-left font-medium">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="p-5 font-bold text-slate-600 sticky left-0 bg-slate-50 z-10 border-r border-slate-100 min-w-[200px]">Student</th>
                    {courseAssignments.map(a => (
                      <th key={a.id} className="p-5 text-center flex-1 min-w-[150px]">
                        <p className="font-bold text-sm text-slate-800 truncate">{a.title}</p>
                        <p className="text-[10px] uppercase font-bold text-slate-400 mt-1">out of 100</p>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {courseStudents.map(student => {
                    const studentProfile = profiles.find(p => p.user_id === student.id);
                    const redFlagCount = studentProfile?.weak_concepts.length || 0;

                    return (
                      <tr key={student.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="p-5 sticky left-0 bg-white border-r border-slate-100 z-10">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <img src={student.avatar} alt={student.name} className="w-8 h-8 rounded-full" />
                              {redFlagCount > 0 && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>}
                            </div>
                            <span className="text-sm font-bold text-slate-700">{student.name}</span>
                          </div>
                        </td>
                        {courseAssignments.map((a) => (
                          <td key={a.id} className="p-5 text-center text-sm">
                            {a.status === 'graded' ? (
                              <span className="font-bold text-slate-700 group-hover:text-violet-600 transition-colors">88%</span>
                            ) : (
                              <span className="text-slate-300 italic text-xs">Pending</span>
                            )}
                          </td>
                        ))}
                        {quizzes.filter(q => q.course_id === courseId).map(q => (
                          <td key={q.id} className="p-5 text-center text-sm">
                            {q.completed ? (
                              <span className={`font-bold ${q.score < 50 ? 'text-red-500' : 'text-indigo-600'}`}>{q.score}%</span>
                            ) : (
                              <span className="text-amber-500 text-xs">In Progress</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </main>
    </Layout>
  );
}
