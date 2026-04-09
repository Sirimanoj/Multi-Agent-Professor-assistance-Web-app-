import { useState } from 'react';
import { useAuth } from './context/AuthContext';

export default function Login() {
  const [selectedRole, setSelectedRole] = useState<'professor' | 'student' | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login, signUp, loginWithGoogle } = useAuth();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;
    setIsLoading(true);
    setErrorMsg(null);
    
    let error = null;
    if (isSignUp) {
      const res = await signUp(email, password, selectedRole, name);
      error = res.error;
    } else {
      const res = await login(email, password);
      error = res.error;
    }

    setIsLoading(false);
    if (error) {
      setErrorMsg(error);
    } else {
      // Redirect occurs automatically via Navigate component in App.tsx or we can force it here
      window.location.href = '/dashboard';
    }
  };

  const handleGoogleAuth = async () => {
    // Optionally store the intended role in local storage to assign upon redirect return
    if (selectedRole) {
      localStorage.setItem('pendingRole', selectedRole);
    }
    await loginWithGoogle();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 relative overflow-hidden font-body">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600/20 rounded-full blur-[120px] mix-blend-multiply"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] mix-blend-multiply"></div>

      <div className="w-full max-w-md bg-white/80 backdrop-blur-2xl p-10 rounded-[2.5rem] shadow-[0_20px_40px_-12px_rgba(93,63,211,0.15)] border border-white relative z-10 transition-all duration-300 hover:shadow-[0_30px_60px_-12px_rgba(93,63,211,0.2)]">
        
        {!selectedRole ? (
          // Step 1: Role Selection
          <div className="space-y-6">
            <div className="text-center mb-10 space-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-violet-400 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0px_10px_20px_rgba(93,63,211,0.3)]">
                <span className="material-symbols-outlined text-3xl">school</span>
              </div>
              <h1 className="text-3xl font-headline font-bold text-slate-900 tracking-tight">Academic Atelier</h1>
              <p className="text-slate-500 text-sm">Select your gateway to enter the academy.</p>
            </div>

            <button 
              onClick={() => {
                setSelectedRole('professor');
                setIsSignUp(true);
              }}
              className="w-full p-6 bg-slate-50/50 border border-slate-100 rounded-3xl hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-5 group hover:bg-white"
            >
               <div className="w-14 h-14 rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center group-hover:bg-violet-600 group-hover:text-white transition-colors shadow-inner">
                 <span className="material-symbols-outlined">assignment_ind</span>
               </div>
               <div className="text-left flex-1">
                 <h3 className="font-bold text-lg text-slate-800">I am a Professor</h3>
                 <p className="text-xs text-slate-500 mt-1">Manage classrooms & curriculum</p>
               </div>
               <span className="material-symbols-outlined text-slate-300 group-hover:text-violet-600 transition-colors">arrow_forward</span>
            </button>

            <button 
              onClick={() => {
                setSelectedRole('student');
                setIsSignUp(true);
              }}
              className="w-full p-6 bg-slate-50/50 border border-slate-100 rounded-3xl hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-5 group hover:bg-white"
            >
               <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors shadow-inner">
                 <span className="material-symbols-outlined">local_library</span>
               </div>
               <div className="text-left flex-1">
                 <h3 className="font-bold text-lg text-slate-800">I am a Student</h3>
                 <p className="text-xs text-slate-500 mt-1">Access coursework & resources</p>
               </div>
               <span className="material-symbols-outlined text-slate-300 group-hover:text-indigo-600 transition-colors">arrow_forward</span>
            </button>
          </div>
        ) : (
          // Step 2: Login Form
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button 
              onClick={() => {
                setSelectedRole(null);
                setErrorMsg(null);
              }}
              className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-slate-700 uppercase tracking-widest transition-colors mb-6"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Change Role
            </button>

            <div className="text-center mb-8 space-y-2">
              <h1 className="text-3xl font-headline font-bold text-slate-900 tracking-tight">
                {selectedRole === 'professor' ? 'Professor ' : 'Student '}
                {isSignUp ? 'Registration' : 'Login'}
              </h1>
              <p className="text-slate-500 text-sm">
                {isSignUp ? 'New account creation for first-time users.' : 'Welcome back! Enter your login details.'}
              </p>
            </div>

            {errorMsg && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium border border-red-100 flex items-center gap-3">
                <span className="material-symbols-outlined text-red-500">error</span>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleAuth} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2 block">Email Address</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl pointer-events-none">mail</span>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                    className="w-full bg-slate-50/50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-4 focus:ring-violet-500/10 focus:bg-white transition-all placeholder:text-slate-300 font-medium text-slate-700 outline-none shadow-inner"
                    placeholder={`you@${selectedRole === 'professor' ? 'university' : 'student'}.edu`}
                  />
                </div>
              </div>

              {isSignUp && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2 block">Full Name</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl pointer-events-none">person</span>
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full bg-slate-50/50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-4 focus:ring-violet-500/10 focus:bg-white transition-all placeholder:text-slate-300 font-medium text-slate-700 outline-none shadow-inner"
                      placeholder="Enter your name"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Password</label>
                  {!isSignUp && <a href="#" className="text-xs font-bold text-violet-600 hover:underline">Forgot?</a>}
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl pointer-events-none">lock</span>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete={isSignUp ? "new-password" : "current-password"}
                    required
                    className="w-full bg-slate-50/50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-4 focus:ring-violet-500/10 focus:bg-white transition-all placeholder:text-slate-300 font-medium text-slate-700 outline-none shadow-inner"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading || !email || !password}
                className={`w-full text-white font-bold rounded-2xl py-4 mt-8 shadow-[0_10px_20px_rgba(99,102,241,0.2)] hover:shadow-[0_15px_30px_rgba(99,102,241,0.3)] hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:pointer-events-none relative overflow-hidden ${selectedRole === 'professor' ? 'bg-gradient-to-br from-violet-600 to-violet-500' : 'bg-gradient-to-br from-indigo-600 to-indigo-500'}`}
              >
                {isLoading ? (
                  <span className="material-symbols-outlined animate-spin">sync</span>
                ) : (
                  <>
                    {isSignUp ? 'Create Account' : 'Secure Login'}
                    <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </>
                )}
                
                {/* Glossy overlay effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-slate-500 select-none">OR</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleAuth}
                className="w-full bg-white border border-slate-200 text-slate-700 font-bold justify-center rounded-2xl py-4 hover:bg-slate-50 hover:shadow-md transition-all flex items-center gap-3 active:scale-95"
              >
                {/* Google Icon SVG */}
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </button>

              <div className="text-center mt-6">
                <button 
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setErrorMsg(null);
                  }}
                  className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
                >
                  {isSignUp ? "Already have an account? Log in" : "Don't have an account? Sign up"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
