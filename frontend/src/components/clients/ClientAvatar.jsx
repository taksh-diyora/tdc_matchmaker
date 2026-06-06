const sizeMap = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-12 h-12 text-sm',
  lg: 'w-16 h-16 text-lg',
  xl: 'w-20 h-20 text-2xl',
};

export default function ClientAvatar({ initials, stageBg, stageColor, size = 'md' }) {
  return (
    <div
      className={`${sizeMap[size]} rounded-full flex items-center justify-center font-serif font-semibold flex-shrink-0 uppercase`}
      style={{ background: stageBg, color: stageColor }}
    >
      {(initials || '??').slice(0, 2)}
    </div>
  );
}
