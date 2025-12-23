import React from 'react';

interface SkeletonProps {
  width?: string;
  height?: string;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  width = '100%', 
  height = '20px', 
  className = '' 
}) => {
  return (
    <div 
      className={`animate-pulse bg-gray-700 rounded ${className}`}
      style={{ width, height }}
    />
  );
};

export const JobCardSkeleton: React.FC = () => (
  <div className="glass-card p-6 rounded-lg">
    <Skeleton height="24px" width="60%" className="mb-3" />
    <Skeleton height="16px" width="40%" className="mb-2" />
    <Skeleton height="14px" width="80%" className="mb-4" />
    <div className="flex gap-2 mb-4">
      <Skeleton height="24px" width="80px" />
      <Skeleton height="24px" width="100px" />
    </div>
    <Skeleton height="36px" width="120px" />
  </div>
);

export const CourseCardSkeleton: React.FC = () => (
  <div className="glass-card p-6 rounded-lg">
    <Skeleton height="28px" width="70%" className="mb-3" />
    <Skeleton height="16px" width="50%" className="mb-2" />
    <Skeleton height="14px" width="90%" className="mb-4" />
    <div className="flex justify-between items-center">
      <Skeleton height="20px" width="80px" />
      <Skeleton height="32px" width="100px" />
    </div>
  </div>
);

export const ProfileSkeleton: React.FC = () => (
  <div className="glass-card p-6 rounded-lg">
    <div className="flex items-center gap-4 mb-6">
      <Skeleton height="80px" width="80px" className="rounded-full" />
      <div className="flex-1">
        <Skeleton height="24px" width="200px" className="mb-2" />
        <Skeleton height="16px" width="150px" />
      </div>
    </div>
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="text-center">
        <Skeleton height="32px" width="60px" className="mx-auto mb-2" />
        <Skeleton height="14px" width="40px" className="mx-auto" />
      </div>
      <div className="text-center">
        <Skeleton height="32px" width="60px" className="mx-auto mb-2" />
        <Skeleton height="14px" width="40px" className="mx-auto" />
      </div>
      <div className="text-center">
        <Skeleton height="32px" width="60px" className="mx-auto mb-2" />
        <Skeleton height="14px" width="40px" className="mx-auto" />
      </div>
    </div>
  </div>
);