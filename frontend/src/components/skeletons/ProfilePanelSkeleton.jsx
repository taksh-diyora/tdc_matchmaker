export default function ProfilePanelSkeleton() {
  return (
    <div className="rounded-3xl overflow-hidden" style={{ background: '#1B3A2C' }}>
      <div className="flex flex-col items-center px-6 pt-6 pb-8 gap-3">
        <div className="w-20 h-20 rounded-full skeleton-shimmer opacity-30" />
        <div className="w-32 h-5 rounded-lg skeleton-shimmer opacity-30" />
        <div className="w-24 h-3 rounded skeleton-shimmer opacity-20" />
        <div className="w-20 h-6 rounded-full skeleton-shimmer opacity-20" />
      </div>
      <div className="p-5 space-y-4" style={{ background: '#FAF8F4' }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="w-16 h-2.5 rounded skeleton-shimmer" />
            <div className="grid grid-cols-2 gap-3">
              <div className="h-8 rounded-lg skeleton-shimmer" />
              <div className="h-8 rounded-lg skeleton-shimmer" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
