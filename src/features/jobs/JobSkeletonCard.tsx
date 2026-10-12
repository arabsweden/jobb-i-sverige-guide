import React from 'react';

interface JobSkeletonCardProps {
  mode?: 'grid' | 'list' | 'compact';
  count?: number;
}

export const JobSkeletonCard: React.FC<JobSkeletonCardProps> = ({ mode = 'grid', count = 1 }) => {
  const skeletons = Array.from({ length: count });

  if (mode === 'compact') {
    return (
      <>
        {skeletons.map((_, i) => (
          <div
            key={i}
            className="p-4 border border-slate-100 rounded-xl bg-white space-y-3 animate-pulse"
          >
            <div className="flex justify-between items-start">
              <div className="flex gap-3 items-center w-full">
                <div className="w-10 h-10 bg-slate-200 rounded-lg shrink-0" />
                <div className="space-y-1.5 w-full">
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                </div>
              </div>
              <div className="h-5 w-16 bg-blue-100/70 rounded shrink-0" />
            </div>
            <div className="flex items-center gap-4 pt-1">
              <div className="h-3 bg-slate-100 rounded w-1/4" />
              <div className="h-3 bg-slate-100 rounded w-1/4" />
              <div className="h-3 bg-slate-100 rounded w-1/4" />
            </div>
          </div>
        ))}
      </>
    );
  }

  if (mode === 'list') {
    return (
      <>
        {skeletons.map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-slate-200 p-5 animate-pulse flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
          >
            <div className="space-y-2.5 w-full md:w-3/4">
              <div className="flex items-center gap-2">
                <div className="h-5 w-20 bg-blue-100 rounded-lg" />
                <div className="h-4 w-12 bg-amber-100 rounded" />
              </div>
              <div className="h-5 bg-slate-200 rounded w-2/3" />
              <div className="flex items-center gap-3">
                <div className="h-3 bg-slate-100 rounded w-24" />
                <div className="h-3 bg-slate-100 rounded w-20" />
                <div className="h-3 bg-slate-100 rounded w-16" />
              </div>
              <div className="h-3 bg-slate-100 rounded w-full max-w-xl" />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
              <div className="h-9 w-24 bg-slate-200 rounded-xl" />
              <div className="h-9 w-24 bg-amber-200 rounded-xl" />
              <div className="h-9 w-28 bg-blue-200 rounded-xl" />
            </div>
          </div>
        ))}
      </>
    );
  }

  // Default Grid Skeleton
  return (
    <>
      {skeletons.map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between gap-4 animate-pulse"
        >
          <div className="space-y-3">
            {/* Source & Bookmark placeholder */}
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <div className="h-5 w-20 bg-blue-100 rounded-lg" />
                <div className="h-4 w-12 bg-slate-100 rounded" />
              </div>
              <div className="h-7 w-7 bg-slate-100 rounded-lg" />
            </div>

            {/* Title & Company */}
            <div className="space-y-2 pt-1">
              <div className="h-5 bg-slate-200 rounded w-4/5" />
              <div className="flex items-center gap-3 pt-0.5">
                <div className="h-3 bg-slate-100 rounded w-24" />
                <div className="h-3 bg-slate-100 rounded w-20" />
              </div>
            </div>

            {/* Description lines */}
            <div className="space-y-1.5 pt-1">
              <div className="h-3 bg-slate-100 rounded w-full" />
              <div className="h-3 bg-slate-100 rounded w-5/6" />
            </div>

            {/* Tags */}
            <div className="flex gap-2 pt-1">
              <div className="h-4 w-14 bg-slate-100 rounded" />
              <div className="h-4 w-14 bg-slate-100 rounded" />
              <div className="h-4 w-16 bg-blue-100/70 rounded" />
            </div>
          </div>

          {/* Action buttons bar */}
          <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
            <div className="h-8 flex-1 bg-slate-100 rounded-xl" />
            <div className="h-8 w-20 bg-amber-100 rounded-xl" />
            <div className="h-8 w-24 bg-blue-100 rounded-xl" />
          </div>
        </div>
      ))}
    </>
  );
};
