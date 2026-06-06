export default function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: '#F5F0E8' }}>
        <Icon size={28} style={{ color: '#9A9088' }} />
      </div>
      <h3 className="font-serif text-lg font-semibold" style={{ color: '#2C2420' }}>{title}</h3>
      <p className="font-sans text-sm mt-1 max-w-xs" style={{ color: '#9A9088' }}>{description}</p>
    </div>
  );
}
