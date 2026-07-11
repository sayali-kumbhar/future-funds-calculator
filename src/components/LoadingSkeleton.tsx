import { Compass } from 'lucide-react';

export default function LoadingSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-8 animate-pulse">
      {/* Skeleton Header */}
      <div className="space-y-3">
        <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
        <div className="h-8 w-2/3 max-w-lg bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
        <div className="h-4 w-1/2 max-w-md bg-gray-100 dark:bg-gray-900 rounded-lg"></div>
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
        {/* Left column skeleton */}
        <div className="lg:col-span-4 space-y-4">
          <div className="h-48 bg-gray-50 dark:bg-gray-900/40 border border-gray-150 dark:border-gray-900 rounded-2xl p-5 space-y-3">
            <div className="h-3 w-16 bg-gray-200 dark:bg-gray-800 rounded"></div>
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
            <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
            <div className="h-4 w-4/5 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
          </div>
        </div>

        {/* Right column skeleton */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-850 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-emerald-100 dark:bg-emerald-950/50 rounded-xl flex items-center justify-center">
                <Compass className="h-4 w-4 text-emerald-500 animate-spin" />
              </div>
              <div className="h-5 w-40 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
            </div>
            
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="h-3.5 w-24 bg-gray-200 dark:bg-gray-800 rounded"></div>
                  <div className="h-10 bg-gray-100 dark:bg-gray-900 rounded-xl"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-3.5 w-24 bg-gray-200 dark:bg-gray-800 rounded"></div>
                  <div className="h-10 bg-gray-100 dark:bg-gray-900 rounded-xl"></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="h-3.5 w-24 bg-gray-200 dark:bg-gray-800 rounded"></div>
                <div className="h-20 bg-gray-100 dark:bg-gray-900 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
