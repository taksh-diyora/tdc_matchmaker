export default function NoteItemSkeleton() {
  return (
    <div className="flex gap-3 px-6 py-3">
      <div className="w-8 h-8 rounded-full skeleton-shimmer flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="w-24 h-3 rounded skeleton-shimmer" />
        <div className="w-full h-12 rounded-lg skeleton-shimmer" />
        <div className="w-20 h-2.5 rounded skeleton-shimmer" />
      </div>
    </div>
  );
}
