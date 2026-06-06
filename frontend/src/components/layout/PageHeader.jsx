export default function PageHeader({ title, children }) {
  return (
    <div className="sticky top-0 z-10 flex items-center justify-between px-8 py-5" style={{ background: '#FAF8F4', borderBottom: '1px solid #E8E1D6' }}>
      <h1 className="font-serif text-[26px] font-semibold" style={{ color: '#2C2420' }}>{title}</h1>
      {children}
    </div>
  );
}
