import { Menu } from 'lucide-react';
import { useLayout } from './AppLayout.jsx';

export default function PageHeader({ title, children }) {
  const layout = useLayout();
  const setSidebarOpen = layout ? layout.setSidebarOpen : () => {};

  return (
    <div className="sticky top-0 z-10 flex items-center justify-between px-4 lg:px-8 py-4 lg:py-5" style={{ background: '#FAF8F4', borderBottom: '1px solid #E8E1D6' }}>
      <div className="flex items-center gap-3">
        <button className="lg:hidden p-1 rounded-md shrink-0" onClick={() => setSidebarOpen(true)}>
          <Menu size={20} style={{ color: '#2C2420' }} />
        </button>
        <h1 className="font-serif text-xl lg:text-[26px] font-semibold flex-shrink-0" style={{ color: '#2C2420' }}>{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        {children}
      </div>
    </div>
  );
}
