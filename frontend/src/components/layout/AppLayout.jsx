import Sidebar from './Sidebar.jsx';

export default function AppLayout({ children }) {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-y-auto ml-64" style={{ background: '#FAF8F4' }}>
        {children}
      </div>
    </div>
  );
}
