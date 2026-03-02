import React from 'react';

interface LoadingSkeletonProps {
  type?: 'card' | 'list' | 'dashboard' | 'game';
  count?: number;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  type = 'card', 
  count = 1 
}) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className="bg-[#162031] rounded-2xl p-6 border border-white/5 animate-pulse">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-[#0b1221] rounded-xl" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-[#0b1221] rounded w-3/4" />
                <div className="h-3 bg-[#0b1221] rounded w-1/2" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-[#0b1221] rounded" />
              <div className="h-3 bg-[#0b1221] rounded w-5/6" />
            </div>
          </div>
        );

      case 'list':
        return (
          <div className="bg-[#162031] rounded-2xl p-4 border border-white/5 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#0b1221] rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-[#0b1221] rounded w-2/3" />
                <div className="h-2 bg-[#0b1221] rounded w-1/3" />
              </div>
              <div className="w-16 h-8 bg-[#0b1221] rounded-lg" />
            </div>
          </div>
        );

      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-[#162031] rounded-2xl p-6 border border-white/5 animate-pulse">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-[#0b1221] rounded-xl" />
                    <div className="h-3 w-16 bg-[#0b1221] rounded" />
                  </div>
                  <div className="h-8 bg-[#0b1221] rounded w-20 mb-2" />
                  <div className="h-2 bg-[#0b1221] rounded w-24" />
                </div>
              ))}
            </div>

            {/* Main Content */}
            <div className="bg-[#162031] rounded-2xl p-8 border border-white/5 animate-pulse">
              <div className="h-6 bg-[#0b1221] rounded w-48 mb-6" />
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-20 bg-[#0b1221] rounded-xl" />
                ))}
              </div>
            </div>
          </div>
        );

      case 'game':
        return (
          <div className="space-y-6">
            {/* Progress Bar */}
            <div className="bg-[#162031] rounded-2xl p-6 border border-white/5 animate-pulse">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#0b1221] rounded-xl" />
                  <div className="space-y-2">
                    <div className="h-4 bg-[#0b1221] rounded w-32" />
                    <div className="h-3 bg-[#0b1221] rounded w-24" />
                  </div>
                </div>
              </div>
              <div className="h-4 bg-[#0b1221] rounded-full" />
            </div>

            {/* Question Card */}
            <div className="bg-[#162031] rounded-3xl p-12 border border-white/5 animate-pulse">
              <div className="text-center space-y-6">
                <div className="h-8 bg-[#0b1221] rounded w-64 mx-auto" />
                <div className="h-16 bg-[#0b1221] rounded-2xl w-full max-w-md mx-auto" />
                <div className="h-14 bg-[#0b1221] rounded-xl w-48 mx-auto" />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {[...Array(count)].map((_, index) => (
        <div key={index} className={count > 1 ? 'mb-4' : ''}>
          {renderSkeleton()}
        </div>
      ))}
    </>
  );
};

export default LoadingSkeleton;
