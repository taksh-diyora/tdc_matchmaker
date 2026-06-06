import { motion } from 'framer-motion';

export default function StatsCard({ value, label, icon: Icon, iconBg, iconColor }) {
  return (
    <motion.div
      className="bg-white rounded-2xl p-6 flex items-start gap-4 cursor-default shadow-sm"
      style={{ border: '1px solid #E8E1D6', boxShadow: '0 1px 3px rgba(44,36,32,0.07), 0 1px 2px rgba(44,36,32,0.04)' }}
      whileHover={{ y: -2, boxShadow: '0 8px 28px rgba(44,36,32,0.11)' }}
      transition={{ duration: 0.15 }}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: iconBg }}
      >
        <Icon size={20} style={{ color: iconColor }} />
      </div>
      <div>
        <p className="font-serif text-[30px] font-semibold leading-none" style={{ color: '#2C2420' }}>
          {value ?? 0}
        </p>
        <p className="font-sans text-sm mt-1" style={{ color: '#9A9088' }}>{label}</p>
      </div>
    </motion.div>
  );
}
