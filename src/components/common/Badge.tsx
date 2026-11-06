import React from 'react';

interface BadgeProps {
  status: string;
  size?: 'sm' | 'md';
  className?: string;
}

export const StatusBadge: React.FC<BadgeProps> = ({ status, size = 'sm', className = '' }) => {
  const getBadgeStyle = () => {
    switch (status) {
      // Program status
      case '모집중':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case '모집예정':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case '모집마감':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case '운영중':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case '운영종료':
        return 'bg-zinc-100 text-zinc-600 border-zinc-200';

      // Plan / Report Review Status
      case '승인완료':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case '신청완료':
      case '제출완료':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case '검토중':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case '보완요청':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case '반려':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case '임시저장':
      case '작성중':
        return 'bg-slate-100 text-slate-600 border-slate-200';

      // Student Status
      case '선정':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case '대기':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case '이수완료':
        return 'bg-teal-50 text-teal-800 border-teal-200 font-semibold';
      case '미이수':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case '취소':
        return 'bg-zinc-100 text-zinc-500 border-zinc-200';

      // Attendance
      case '출석':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case '지각':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case '결석':
        return 'bg-rose-50 text-rose-700 border-rose-200';

      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium';

  return (
    <span
      className={`inline-flex items-center rounded-md border font-medium ${sizeClass} ${getBadgeStyle()} ${className}`}
    >
      {status}
    </span>
  );
};
