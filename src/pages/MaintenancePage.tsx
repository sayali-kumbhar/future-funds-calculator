import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Wrench, RefreshCw, Home, CheckCircle2, ShieldCheck, Mail } from 'lucide-react';

export default function MaintenancePage() {
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleCheckStatus = () => {
    setCheckingStatus(true);
    setStatusMessage(null);
    setTimeout(() => {
      setCheckingStatus(false);
      setStatusMessage('All calculation systems are operating normally! You can return to the calculators.');
    }, 1200);
  };

  return (
    <div className="min-h-[80vh] py-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto flex flex-col justify-center text-center">
      <div className="space-y-6">
        {/* Maintenance Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-400 border border-amber-300 dark:border-amber-800">
          <Wrench className="h-4 w-4" />
          <span>503 — SYSTEM UPGRADE & MAINTENANCE</span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Upgrading Calculation <span className="text-amber-600 dark:text-amber-400">Models</span>
        </h1>

        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-xl mx-auto leading-relaxed">
          FutureFund is currently undergoing routine system updates to optimize our financial algorithms, add new tax bracket rules, and enhance compounding performance.
        </p>

        {/* Status Check Card */}
        <div className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 max-w-lg mx-auto space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Core Offline Calculators: Available
            </span>
            <span className="text-gray-400 font-mono">v2.4.0-update</span>
          </div>

          {statusMessage && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2 text-left">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>{statusMessage}</span>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleCheckStatus}
              disabled={checkingStatus}
              className="inline-flex items-center space-x-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold px-4 py-2 text-xs transition-colors cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${checkingStatus ? 'animate-spin' : ''}`} />
              <span>{checkingStatus ? 'Checking Status...' : 'Check System Status'}</span>
            </button>

            <Link
              to="/calculators"
              className="inline-flex items-center space-x-2 rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-950 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold px-4 py-2 text-xs transition-colors"
            >
              <Home className="h-3.5 w-3.5 text-emerald-600" />
              <span>Try Local Calculators</span>
            </Link>
          </div>
        </div>

        {/* Contact Note */}
        <div className="pt-4 text-xs text-gray-400 flex items-center justify-center gap-2">
          <Mail className="h-3.5 w-3.5" />
          <span>Need immediate support? Contact us at <Link to="/contact" className="text-emerald-600 underline">support@futurefund.app</Link></span>
        </div>
      </div>
    </div>
  );
}
