import { useLocation, useNavigate } from 'react-router-dom';
import { Users, Send, LogOut, MoreHorizontal } from 'lucide-react';
import useAuthStore from '../../store/authStore.js';

const navItems = [
  { label: 'My Clients', icon: Users, path: '/dashboard' },
  { label: 'Match History', icon: Send, path: '/history' },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { matchmaker, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = matchmaker?.initials || 'MM';

  return (
    <div className="flex flex-col w-64 h-screen fixed left-0 top-0 z-40 select-none" style={{ background: '#1B3A2C' }}>
      {/* Logo area */}
      <div className="px-5 py-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#C8973F' }}>
            <span className="font-serif text-white text-sm font-bold tracking-wide">TDC</span>
          </div>
          <div>
            <p className="font-serif text-white text-[15px] font-semibold">The Date Crew</p>
            <p className="font-sans text-[11px]" style={{ color: '#4C9469' }}>Matchmaker Portal</p>
          </div>
        </div>
        <div className="mt-4 mx-1" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }} />
      </div>

      {/* Navigation */}
      <div className="px-3 mt-4">
        <p className="font-sans text-[9px] font-bold uppercase px-3 mb-2" style={{ letterSpacing: '0.18em', color: '#4C9469' }}>
          WORKSPACE
        </p>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path ||
            (item.path === '/dashboard' && location.pathname.startsWith('/clients'));
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-sans font-medium cursor-pointer my-0.5 transition-all duration-150
                ${isActive
                  ? 'border-l-2 pl-[10px]'
                  : 'hover:text-white/90'
                }`}
              style={isActive
                ? { background: 'rgba(200,151,63,0.15)', color: '#C8973F', borderLeftColor: '#C8973F' }
                : { color: 'rgba(255,255,255,0.6)', background: 'transparent' }
              }
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Account section */}
      <div className="mt-auto px-3">
        <p className="font-sans text-[9px] font-bold uppercase px-3 mb-2" style={{ letterSpacing: '0.18em', color: '#4C9469' }}>
          ACCOUNT
        </p>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-sans font-medium cursor-pointer my-0.5 transition-all duration-150"
          style={{ color: 'rgba(255,255,255,0.6)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
            e.currentTarget.style.color = 'rgba(255,255,255,0.9)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
          }}
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>

      {/* User footer */}
      <div className="px-4 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: '#C8973F' }}>
            <span className="font-serif text-white text-sm font-semibold">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-sans text-white text-sm font-medium truncate">
              {matchmaker?.name}
            </p>
            <p className="font-sans text-xs" style={{ color: '#4C9469' }}>
              {matchmaker?.designation || 'Matchmaker'}
            </p>
          </div>
          <MoreHorizontal size={16} className="cursor-pointer flex-shrink-0" style={{ color: 'rgba(255,255,255,0.3)' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
          />
        </div>
      </div>
    </div>
  );
}
