import { createContext, useContext, useState } from 'react';
import Sidebar from './Sidebar.jsx';

export const LayoutContext = createContext();
export const useLayout = () => useContext(LayoutContext);

export default function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <LayoutContext.Provider value={{ sidebarOpen, setSidebarOpen }}>
      <div className="flex h-screen w-full overflow-hidden">
        {/* Mobile Backdrop */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex flex-1 flex-col overflow-y-auto lg:ml-64 w-full" style={{ background: '#FAF8F4' }}>
          {children}
        </div>
      </div>
    </LayoutContext.Provider>
  );
}
