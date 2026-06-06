export default function ClientCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-5" style={{ border: '1px solid #E8E1D6' }}>
      <div className="flex items-start justify-between mb-3">
        <div className="w-12 h-12 rounded-full skeleton-shimmer" />
        <div className="w-20 h-6 rounded-full skeleton-shimmer" />
      </div>
      <div className="w-28 h-4 rounded skeleton-shimmer mt-3" />
      <div className="w-36 h-3 rounded skeleton-shimmer mt-2" />
      <div className="flex items-center gap-2 mt-3">
        <div className="w-16 h-5 rounded-full skeleton-shimmer" />
        <div className="w-16 h-5 rounded-full skeleton-shimmer" />
      </div>
      <div className="w-24 h-3 rounded skeleton-shimmer mt-3 pt-3" style={{ borderTop: '1px solid #F0E8DC' }} />
    </div>
  );
}
