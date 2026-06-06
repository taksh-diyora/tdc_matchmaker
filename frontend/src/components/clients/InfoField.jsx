export default function InfoField({ label, value, fullWidth = false }) {
  return (
    <div className={fullWidth ? 'col-span-2' : 'col-span-1'}>
      <p className="font-sans text-[9px] font-semibold uppercase" style={{ letterSpacing: '0.12em', color: '#9A9088' }}>
        {label}
      </p>
      <p className="font-sans text-sm font-medium mt-0.5 break-words" style={{ color: '#2C2420' }}>
        {value || <span style={{ color: '#C8BDB0' }}>—</span>}
      </p>
    </div>
  );
}
