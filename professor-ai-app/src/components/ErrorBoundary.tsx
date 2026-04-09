import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
          <div className="bg-white p-12 rounded-[40px] shadow-2xl border border-slate-100 max-w-xl w-full">
            <div className="w-20 h-20 bg-red-100 text-red-600 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <span className="material-symbols-outlined text-4xl">warning</span>
            </div>
            <h1 className="text-3xl font-headline font-bold text-slate-800 mb-4">Something went wrong</h1>
            <p className="text-slate-500 mb-8 leading-relaxed">
              The application encountered an synchronization error. This is usually due to missing environment variables or a connection timeout.
            </p>
            <div className="bg-slate-50 p-4 rounded-2xl text-left mb-8 overflow-auto max-h-40">
              <code className="text-xs text-red-500 font-mono">
                {this.state.error?.message}
              </code>
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-violet-600 text-white px-8 py-3 rounded-2xl font-bold uppercase tracking-widest text-sm shadow-xl shadow-violet-600/20 hover:scale-105 transition-transform"
            >
              Refresh Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
