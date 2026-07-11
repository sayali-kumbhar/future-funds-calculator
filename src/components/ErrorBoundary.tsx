import React, { ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, RotateCcw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
  }

  private handleReset = () => {
    // Clear potentially corrupted local storage items
    try {
      const keysToKeep = ['darkMode'];
      const preservedValues: Record<string, string | null> = {};
      
      keysToKeep.forEach(key => {
        preservedValues[key] = localStorage.getItem(key);
      });
      
      localStorage.clear();
      
      keysToKeep.forEach(key => {
        if (preservedValues[key] !== null) {
          localStorage.setItem(key, preservedValues[key]!);
        }
      });
    } catch (e) {
      console.error('Failed to clear localStorage on reset:', e);
    }
    
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div id="error-boundary-screen" className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 text-center">
          <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl space-y-6">
            <div className="mx-auto h-12 w-12 bg-red-100 dark:bg-red-950/40 text-red-600 rounded-2xl flex items-center justify-center">
              <AlertOctagon className="h-6 w-6" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Something went wrong
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                We encountered an unexpected runtime error while computing calculations. This might be due to outdated browser caches or abnormal parameters.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-red-50/50 dark:bg-red-950/10 border border-red-150 dark:border-red-900/30 rounded-xl text-left">
                <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider block mb-1">
                  Diagnostics
                </span>
                <code className="text-[10px] font-mono text-red-600 dark:text-red-400 break-all leading-normal line-clamp-3 block">
                  {this.state.error.message}
                </code>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={this.handleReset}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2.5 text-xs transition-colors cursor-pointer shadow-md shadow-emerald-500/10"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset & Reload App</span>
              </button>
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.href = '/';
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 rounded-xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold px-4 py-2.5 text-xs transition-colors cursor-pointer"
              >
                <Home className="h-3.5 w-3.5" />
                <span>Go to Homepage</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
