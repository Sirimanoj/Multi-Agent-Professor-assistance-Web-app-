import { Link } from 'react-router-dom';
import Layout from './components/Layout';
import { useApp } from './context/AppContext';
import { useAuth } from './context/AuthContext';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

export default function StudentDashboard() {
  const { assignments, submitAssignment, isGrading, profiles, openModal, usersList, isLoading: isAppLoading } = useApp();
  const { user } = useAuth();
  
  if (isAppLoading || !user) {
    return (
      <Layout>
        <div className="flex-1 flex flex-col items-center justify-center lg:ml-[280px]">
          <span className="material-symbols-outlined animate-spin text-4xl text-violet-600">sync</span>
          <p className="text-slate-500 mt-4 font-bold uppercase tracking-widest text-xs">Synchronizing Knowledge Profile...</p>
        </div>
      </Layout>
    );
  }

  const myProfile = profiles.find(p => p.user_id === user.id) || profiles[0];
  
  if (!myProfile) {
     return (
        <Layout>
          <div className="flex-1 flex flex-col items-center justify-center lg:ml-[280px]">
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Preparing your scholarship...</p>
          </div>
        </Layout>
     );
  }

  const peerMentors = usersList.filter(u => 
    u.role === 'student' && 
    u.id !== user.id && 
    profiles.find(p => p.user_id === u.id)?.strong_concepts.some(c => myProfile.weak_concepts.includes(c))
  );

  const radarData = Object.entries(myProfile.understanding_level).map(([subject, level]) => ({
    subject,
    mastery: level,
    fullMark: 100,
  }));

  return (
    <Layout>
      <main className="flex-1 lg:ml-[280px] p-8 lg:p-12 space-y-12 animate-in fade-in duration-500">
        {/* Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-4">
            <h1 className="text-6xl font-headline text-on-surface leading-tight font-medium">
              Good morning, <br/><span className="italic text-violet-600 font-bold">{user.name}.</span>
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

        {/* Learning Profile Overview */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-4">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-50 relative overflow-hidden group">
            <h3 className="font-headline font-bold text-2xl mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-violet-600">psychology_alt</span>
              Learning Profile
            </h3>
            <div className="space-y-4">
              {/* Gamification Strip */}
              <div className="flex flex-wrap items-center gap-3 mb-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="flex items-center gap-1 text-orange-600 font-bold text-xs uppercase tracking-widest bg-orange-100/50 px-3 py-1.5 rounded-lg border border-orange-200/50">
                  🔥 {myProfile.current_streak} Day Streak
                </div>
                <div className="flex flex-wrap gap-2">
                  {myProfile.badges?.map(b => (
                    <span key={b} className="text-xs bg-white border border-slate-200 px-2 py-1.5 rounded-md shadow-[0_2px_4px_rgba(0,0,0,0.02)] font-bold text-slate-600 uppercase tracking-wider">{b}</span>
                  ))}
                </div>
              </div>

              {/* Radar Chart */}
              <div className="h-48 w-full -ml-4 my-2">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                    <PolarGrid stroke="#f1f5f9" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 800 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name="Student" dataKey="mastery" stroke="#7c3aed" strokeWidth={2} fill="#8b5cf6" fillOpacity={0.3} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Strong Concepts</span>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {myProfile.strong_concepts.map(c => <span key={c} className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-md text-[9px] font-bold uppercase truncate max-w-full">{c}</span>)}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Needs Focus</span>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {myProfile.weak_concepts.map(c => <span key={c} className="px-2 py-1 bg-orange-50 text-orange-600 rounded-md text-[9px] font-bold uppercase truncate max-w-full">{c}</span>)}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between pt-5 border-t border-slate-50">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Pace: <strong className="text-slate-700 ml-1">{myProfile.learning_speed}</strong></span>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Format: <strong className="text-slate-700 ml-1">{myProfile.preferred_format}</strong></span>
            </div>

            {/* Peer Mentoring */}
            {peerMentors.length > 0 && (
              <div className="mt-6 pt-5 border-t border-slate-50">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-3 block">Suggested Tutors based on your missing concepts</span>
                <div className="space-y-3">
                  {peerMentors.map(mentor => (
                    <div key={mentor.id} className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-3">
                        <img src={mentor.avatar} alt={mentor.name} className="w-8 h-8 rounded-full" />
                        <span className="text-sm font-bold text-slate-700">{mentor.name}</span>
                      </div>
                      <button className="bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-violet-50 hover:text-violet-600 hover:border-violet-200 transition-colors">
                        Message
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-violet-50 p-8 rounded-[2rem] shadow-sm border border-violet-100 flex flex-col justify-center">
            <h3 className="font-headline font-bold text-2xl mb-2 text-indigo-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-indigo-500">auto_awesome</span>
              AI Tutor Recommendation
            </h3>
            <p className="text-indigo-800/80 leading-relaxed text-sm mb-6 max-w-sm">
              Based on your recent adaptive quizzes, I recommend focusing on <strong className="text-indigo-600">{myProfile.weak_concepts[0] || 'core concepts'}</strong>. 
              I've prepared a foundational {myProfile.preferred_format} session for you.
            </p>
            <button onClick={() => openModal('infinite_practice')} className="self-start bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20 active:scale-95 duration-200">
              Start Infinite Practice
            </button>
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
                  <span className="text-xs font-bold text-slate-400">{assignment.due_date}</span>
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
                "{user.name}, your analysis of market volatility shows a sophisticated grasp of historical patterns. The way you integrated AI-generated data sets was particularly impressive."
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
