export default function StatsCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 flex items-start gap-4" style={{ border: '1px solid #E8E1D6' }}>
      <div className="w-11 h-11 rounded-xl skeleton-shimmer flex-shrink-0" />
      <div className="flex-1">
        <div className="w-16 h-7 rounded-lg skeleton-shimmer mt-1" />
        <div className="w-16 md:w-24 h-3.5 rounded skeleton-shimmer mt-2" />
      </div>
    </div>
  );
}
