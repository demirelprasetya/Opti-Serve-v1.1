import React from 'react';
import {
  Layers,
  PlusCircle,
  FileText,
  BarChart3,
  AlertTriangle
} from 'lucide-react';

interface MobilePwaShellProps {
  activeTab: 'new-inspection' | 'inspection-list' | 'supervisor-review' | 'analytics';
  onTabChange: (tab: 'new-inspection' | 'inspection-list' | 'supervisor-review' | 'analytics') => void;
  userRole: 'staff' | 'supervisor' | 'admin';
  pendingReviewCount: number;
  revisionCount: number;
}

export const MobilePwaShell: React.FC<MobilePwaShellProps> = ({
  activeTab,
  onTabChange,
  userRole,
  pendingReviewCount,
  revisionCount
}) => {
  // Haptic Feedback for native tactile feel
  const triggerHaptic = () => {
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(12);
      } catch (err) {
        // ignore if not supported
      }
    }
  };

  const handleTabClick = (tab: 'new-inspection' | 'inspection-list' | 'supervisor-review' | 'analytics') => {
    triggerHaptic();
    onTabChange(tab);
  };

  return (
    <>
      {/* Persistent Mobile Bottom Navigation Bar (Bar Navigasi Native HP) */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 py-2.5 px-3 shadow-2xl pb-safe">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {userRole === 'staff' && (
            <>
              <button
                onClick={() => handleTabClick('new-inspection')}
                className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all ${
                  activeTab === 'new-inspection'
                    ? 'text-blue-400 font-extrabold bg-blue-950/80 border border-blue-800/60 scale-105'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <PlusCircle className="w-5 h-5 mb-0.5" />
                <span className="text-[10px] font-bold">Inspeksi</span>
              </button>

              <button
                onClick={() => handleTabClick('inspection-list')}
                className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all ${
                  activeTab === 'inspection-list'
                    ? 'text-blue-400 font-extrabold bg-blue-950/80 border border-blue-800/60 scale-105'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="w-5 h-5 mb-0.5" />
                <span className="text-[10px] font-bold">Daftar</span>
                {revisionCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded-full animate-pulse shadow-md flex items-center gap-0.5">
                    <AlertTriangle className="w-2.5 h-2.5" />
                    {revisionCount}
                  </span>
                )}
              </button>
            </>
          )}

          {userRole === 'supervisor' && (
            <button
              onClick={() => handleTabClick('supervisor-review')}
              className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all ${
                activeTab === 'supervisor-review'
                  ? 'text-blue-400 font-extrabold bg-blue-950/80 border border-blue-800/60 scale-105'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] font-bold">Peninjauan</span>
              {pendingReviewCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded-full animate-pulse shadow-md">
                  {pendingReviewCount}
                </span>
              )}
            </button>
          )}

          <button
            onClick={() => handleTabClick('analytics')}
            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all ${
              activeTab === 'analytics'
                ? 'text-blue-400 font-extrabold bg-blue-950/80 border border-blue-800/60 scale-105'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-bold">Kinerja</span>
          </button>
        </div>
      </div>
    </>
  );
};
