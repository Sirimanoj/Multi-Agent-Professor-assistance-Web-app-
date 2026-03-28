import { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export default function CourseDetail() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const { courses, assignments, announcements, usersList, postAnnouncement } = useApp();
  
  const [activeTab, setActiveTab] = useState<'stream' | 'classwork' | 'people' | 'grades'>('stream');
  const [announcementText, setAnnouncementText] = useState('');

  const course = courses.find(c => c.id === courseId);

  if (!course) {
    return <Navigate to="/classrooms" replace />;
  }

  const courseAssignments = assignments.filter(a => a.courseId === courseId);
  const courseAnnouncements = announcements.filter(a => a.courseId === courseId);
  const courseStudents = usersList.filter(u => u.role === 'student'); // Mock all students enrolled
  const courseTeacher = usersList.find(u => u.name === course.instructor) || usersList.find(u => u.role === 'professor');

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementText.trim() || !user) return;
    postAnnouncement(course.id, announcementText, user.name);
    setAnnouncementText('');
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
      <main className="flex-1 lg:ml-[280px] mr-0 xl:mr-[400px] animate-in fade-in duration-500">
        
        {/* Course Hero Banner */}
        <section className="bg-gradient-to-br from-violet-600 to-indigo-700 text-white p-8 lg:p-12 relative overflow-hidden min-h-[240px] flex flex-col justify-end">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 backdrop-blur-3xl rounded-full transform translate-x-32 -translate-y-32"></div>
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
          
          <div className="relative z-10">
            <h1 className="text-4xl lg:text-5xl font-headline font-bold drop-shadow-md">{course.name}</h1>
            <p className="text-violet-100 font-medium mt-2 drop-shadow-sm">{course.term} • {course.instructor}</p>
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
                      <p className="text-xs text-slate-500 font-bold mb-1">{a.dueDate}</p>
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
                          {an.authorName[0]}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{an.authorName}</p>
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
              {['Week 1: Fundamentals', 'Midterms', 'Uncategorized'].map(topicGroup => {
                const topicAssignments = courseAssignments.filter(a => (a.topic || 'Uncategorized') === topicGroup);
                if (topicAssignments.length === 0) return null;

                return (
                  <div key={topicGroup}>
                    <h2 className="text-2xl font-headline font-bold text-violet-600 border-b-2 border-slate-100 pb-3 mb-6 flex justify-between items-end">
                      {topicGroup}
                    </h2>
                    <div className="space-y-4">
                      {topicAssignments.map(assignment => (
                        <div key={assignment.id} className="bg-white group p-6 rounded-2xl shadow-sm hover:shadow-lg border border-slate-100 hover:border-violet-200 transition-all flex justify-between items-center cursor-pointer">
                          <div className="flex items-center gap-5">
                            <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                              <span className="material-symbols-outlined text-xl">assignment</span>
                            </div>
                            <div>
                              <h4 className="font-bold text-lg text-slate-800 group-hover:text-violet-600 transition-colors">{assignment.title}</h4>
                              <p className="text-xs text-slate-400 font-medium flex items-center gap-2 mt-1">
                                <span className="material-symbols-outlined text-[12px]">schedule</span> Due {assignment.dueDate}
                              </p>
                            </div>
                          </div>
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${getUrgencyColor(assignment.urgency)}`}>
                            {assignment.urgency}
                          </span>
                        </div>
                      ))}
                    </div>
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
                  {courseStudents.map(student => (
                    <div key={student.id} className="flex items-center gap-4 py-4 px-2 hover:bg-slate-50 rounded-xl transition-colors border-b border-slate-50 last:border-0 cursor-pointer">
                      <img src={student.avatar} alt={student.name} className="w-10 h-10 rounded-full object-cover" />
                      <span className="font-bold text-sm text-slate-700">{student.name}</span>
                    </div>
                  ))}
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
                  {courseStudents.map(student => (
                    <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-5 sticky left-0 bg-white border-r border-slate-100 z-10">
                        <div className="flex items-center gap-3">
                          <img src={student.avatar} alt={student.name} className="w-8 h-8 rounded-full" />
                          <span className="text-sm font-bold text-slate-700">{student.name}</span>
                        </div>
                      </td>
                      {courseAssignments.map((a, idx) => (
                        <td key={a.id} className="p-5 text-center text-sm">
                          {/* Pseudo-random grades based on ID and assignment index */}
                          {a.status === 'graded' || idx === 1 ? (
                            <span className="font-bold text-slate-700">{(85 + (idx*5) + parseInt(student.id.replace('u',''))).toString()}/100</span>
                          ) : (
                            <span className="text-slate-300 italic text-xs">Missing</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </main>
    </Layout>
  );
}
