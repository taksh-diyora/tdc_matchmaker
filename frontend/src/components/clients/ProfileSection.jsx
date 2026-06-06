export default function ProfileSection({ label, icon: Icon, children }) {
  return (
    <div className="last:border-0" style={{ borderBottom: '1px solid #E8E1D6' }}>
      <div className="flex items-center gap-2 px-5 pt-4 pb-2">
        <Icon size={11} style={{ color: '#9A9088' }} />
        <span className="font-sans text-[9px] font-bold uppercase" style={{ letterSpacing: '0.18em', color: '#9A9088' }}>
          {label}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-3 px-5 pb-4">
        {children}
      </div>
    </div>
  );
}
