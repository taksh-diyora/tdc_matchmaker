export default function MatchCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-5" style={{ border: '1px solid #E8E1D6' }}>
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-full skeleton-shimmer flex-shrink-0" />
        <div className="flex-1">
          <div className="w-32 h-5 rounded skeleton-shimmer" />
          <div className="w-40 h-3 rounded skeleton-shimmer mt-2" />
          <div className="flex gap-2 mt-3">
            <div className="w-16 h-5 rounded-full skeleton-shimmer" />
            <div className="w-16 h-5 rounded-full skeleton-shimmer" />
          </div>
        </div>
        <div className="w-16 h-16 rounded-full skeleton-shimmer flex-shrink-0" />
      </div>
      <div className="flex gap-2 mt-4 pt-4" style={{ borderTop: '1px solid #F0E8DC' }}>
        <div className="flex-1 h-9 rounded-xl skeleton-shimmer" />
        <div className="flex-1 h-9 rounded-xl skeleton-shimmer" />
      </div>
    </div>
  );
}
