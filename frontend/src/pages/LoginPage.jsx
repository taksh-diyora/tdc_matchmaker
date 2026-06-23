import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { loginApi } from '../services/api.js';
import useAuthStore from '../store/authStore.js';

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const [email, setEmail] = useState('admin1@test.com');
  const [password, setPassword] = useState('testpassword1');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const res = await loginApi({ email, password });
      login(res.data.matchmaker);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full overflow-hidden">
      <div
        className="hidden lg:flex lg:w-[55%] min-h-screen flex-col items-center px-16 relative"
        style={{ background: '#1B3A2C' }}
      >
        {/* Gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 30% 20%, rgba(200,151,63,0.12) 0%, transparent 50%),
                              radial-gradient(circle at 70% 80%, rgba(74,148,105,0.10) 0%, transparent 50%)`,
          }}
        />

        {/* Centered branding area */}
        <div className="flex-1 flex items-center justify-center w-full">
          <div className="relative z-10 flex flex-col items-center text-center">
            {/* TDC Emblem */}
            <div className="w-[72px] h-[72px] rounded-full flex items-center justify-center" style={{ background: '#C8973F' }}>
              <span className="font-serif text-white text-2xl font-bold tracking-widest">TDC</span>
            </div>

            {/* Wordmark */}
            <h1 className="font-serif text-white text-4xl font-semibold mt-6">The Date Crew</h1>

            {/* Tagline */}
            <p className="font-serif italic text-lg mt-3" style={{ color: '#E3C47A' }}>
              Where Hearts Find Their Match
            </p>

            {/* Divider */}
            <div className="my-8" style={{ width: '64px', borderTop: '1px solid rgba(200,151,63,0.4)' }} />

            {/* Feature list */}
            <div className="space-y-1.5">
              {['Verified Profiles', 'Intelligent Matching', 'Trusted Process'].map((f) => (
                <div key={f} className="flex items-center gap-3 font-sans text-sm" style={{ color: '#B5D9C8' }}>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#C8973F' }} />
                  {f}
                </div>
              ))}
            </div>

            {/* Quote */}
            <p className="font-serif italic text-sm text-center max-w-xs mt-12" style={{ color: '#4C9469' }}>
              "Every match made here changes lives forever."
            </p>
          </div>
        </div>

        {/* Copyright */}
        <p className="font-sans text-xs pb-6 relative z-10" style={{ color: '#2D6448' }}>
          © {new Date().getFullYear()} The Date Crew. All rights reserved.
        </p>
      </div>

      {/* Right panel */}
      <div className="flex flex-1 items-center justify-center px-6 py-12" style={{ background: '#FAF8F4' }}>
        <motion.div
          className="bg-white rounded-3xl w-full max-w-md p-10"
          style={{ boxShadow: '0 16px 48px rgba(44,36,32,0.13), 0 8px 16px rgba(44,36,32,0.06)' }}
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="font-serif text-[32px] font-semibold" style={{ color: '#2C2420' }}>
            Welcome back
          </h2>
          <p className="font-sans text-sm mt-1 mb-8" style={{ color: '#9A9088' }}>
            Sign in to your Matchmaker Dashboard
          </p>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="mb-5">
              <label className="font-sans text-[10px] font-semibold uppercase mb-1.5 block" style={{ letterSpacing: '0.12em', color: '#9A9088' }}>
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#9A9088' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="matchmaker@thedatecrew.com"
                  required
                  className="w-full rounded-xl pl-10 pr-4 py-3 text-sm font-sans outline-none transition-all"
                  style={{ border: '1px solid #E8E1D6', background: '#FAF8F4', color: '#2C2420' }}
                  onFocus={(e) => {
                    e.target.style.boxShadow = '0 0 0 2px #C8973F';
                    e.target.style.borderColor = 'transparent';
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = 'none';
                    e.target.style.borderColor = '#E8E1D6';
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-2">
              <label className="font-sans text-[10px] font-semibold uppercase mb-1.5 block" style={{ letterSpacing: '0.12em', color: '#9A9088' }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-xl px-4 py-3 text-sm font-sans outline-none transition-all pr-10"
                  style={{ border: '1px solid #E8E1D6', background: '#FAF8F4', color: '#2C2420' }}
                  onFocus={(e) => {
                    e.target.style.boxShadow = '0 0 0 2px #C8973F';
                    e.target.style.borderColor = 'transparent';
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = 'none';
                    e.target.style.borderColor = '#E8E1D6';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                  style={{ color: '#9A9088' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-3 flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm"
                  style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#B91C1C' }}
                >
                  <AlertCircle size={14} />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-xl text-white font-sans text-sm font-semibold mt-8 flex items-center justify-center gap-2 disabled:opacity-60"
              style={{ background: '#1B3A2C' }}
              whileHover={{ scale: 1.01, background: '#22503D' }}
              whileTap={{ scale: 0.99 }}
              onMouseEnter={(e) => { if (!isLoading) e.currentTarget.style.background = '#22503D'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#1B3A2C'; }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  &nbsp;Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </motion.button>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 rounded-xl border border-dashed text-xs font-sans" style={{ borderColor: '#E8E1D6', background: '#FAF8F4', color: '#6B6055' }}>
              <div className="font-semibold mb-1" style={{ color: '#2C2420' }}>Demo Credentials:</div>
              <div className="flex justify-between items-center mb-1">
                <span>Email: <span className="font-mono select-all font-medium">admin1@test.com</span></span>
              </div>
              <div className="flex justify-between items-center">
                <span>Password: <span className="font-mono select-all font-medium">testpassword1</span></span>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
