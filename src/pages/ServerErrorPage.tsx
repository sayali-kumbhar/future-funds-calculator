import React from 'react';
import { AlertOctagon, RotateCcw, Home, LifeBuoy, ShieldAlert } from 'lucide-react';

interface ServerErrorPageProps {
  errorMessage?: string;
}

export default function ServerErrorPage({ errorMessage }: ServerErrorPageProps) {
  const handleResetAndClear = () => {
    try {
      const darkMode = localStorage.getItem('darkMode');
      localStorage.clear();
      if (darkMode !== null) {
        localStorage.setItem('darkMode', darkMode);
      }
    } catch (e) {
      console.error('Error clearing local storage cache:', e);
    }
    window.location.href = '/';
  };

  return (
    <div className="min-h-[80vh] py-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto flex flex-col justify-center text-center">
      <div className="space-y-6">
        {/* Error Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-800">
          <AlertOctagon className="h-4 w-4" />
          <span>500 — INTERNAL SERVER / APPLICATION ERROR</span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Something went wrong <span className="text-rose-600 dark:text-rose-400">on our end.</span>
        </h1>

        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-xl mx-auto leading-relaxed">
          An unexpected calculation or rendering error occurred. This is usually caused by corrupted cached parameters in your browser storage or a temporary network glitch.
        </p>

        {/* Optional Error Diagnostics Block */}
        {errorMessage && (
          <div className="max-w-lg mx-auto text-left bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 rounded-2xl p-4 space-y-1">
            <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider block">
              Error Diagnostics Log
            </span>
            <code className="text-xs font-mono text-rose-700 dark:text-rose-300 break-all leading-normal block">
              {errorMessage}
            </code>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <button
            onClick={handleResetAndClear}
            className="inline-flex items-center space-x-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2.5 text-xs shadow-md transition-colors cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset Cache & Reload App</span>
          </button>

          <a
            href="/"
            className="inline-flex items-center space-x-2 rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-850 text-gray-700 dark:text-gray-200 font-semibold px-5 py-2.5 text-xs shadow-sm transition-colors"
          >
            <Home className="h-4 w-4 text-emerald-600" />
            <span>Return to Homepage</span>
          </a>

          <a
            href="/contact"
            className="inline-flex items-center space-x-2 rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-850 text-gray-700 dark:text-gray-200 font-semibold px-5 py-2.5 text-xs shadow-sm transition-colors"
          >
            <LifeBuoy className="h-4 w-4 text-blue-600" />
            <span>Report Issue</span>
          </a>
        </div>

        {/* Notice */}
        <div className="mt-12 p-6 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-850 text-left space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-900 dark:text-white">
            <ShieldAlert className="h-4 w-4 text-amber-500" />
            <span>Privacy Notice</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            FutureFund operates 100% client-side in your browser. None of your personal financial inputs are sent to or stored on external remote servers.
          </p>
        </div>
      </div>
    </div>
  );
}
