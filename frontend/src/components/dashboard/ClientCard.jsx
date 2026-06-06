import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import ClientAvatar from '../clients/ClientAvatar.jsx';
import StageBadge from '../clients/StageBadge.jsx';

export default function ClientCard({ client }) {
  const navigate = useNavigate();
  const pm = client.platformMetadata || {};
  const initials = (client.firstName?.[0] || '') + (client.lastName?.[0] || '');

  return (
    <motion.div
      className="bg-white rounded-2xl p-5 cursor-pointer"
      style={{
        border: '1px solid #E8E1D6',
        boxShadow: '0 1px 3px rgba(44,36,32,0.07), 0 1px 2px rgba(44,36,32,0.04)',
      }}
      whileHover={{ y: -2, boxShadow: '0 8px 28px rgba(44,36,32,0.11)' }}
      transition={{ duration: 0.15 }}
      onClick={() => navigate(`/clients/${client.id}`)}
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-3">
        <ClientAvatar
          initials={initials}
          stageBg={pm.stageBg || '#F5F0E8'}
          stageColor={pm.stageColor || '#5C5248'}
          size="md"
        />
        <StageBadge
          stage={pm.stage || 'Unknown'}
          stageBg={pm.stageBg || '#F5F0E8'}
          stageColor={pm.stageColor || '#5C5248'}
        />
      </div>

      {/* Name */}
      <p className="font-serif text-base font-semibold" style={{ color: '#2C2420' }}>
        {client.fullName || `${client.firstName} ${client.lastName}`}
      </p>

      {/* Age + Location */}
      <p className="font-sans text-sm mt-0.5" style={{ color: '#9A9088' }}>
        {client.age} yrs · {client.city}, {client.state}
      </p>

      {/* Tags */}
      <div className="flex items-center gap-2 mt-3 flex-wrap">
        {client.religion && (
          <span
            className="text-[11px] font-sans font-medium px-2.5 py-1 rounded-full"
            style={{ background: '#F5F0E8', color: '#5C5248' }}
          >
            {client.religion}
          </span>
        )}
        {pm.verified && (
          <span
            className="text-[11px] font-sans font-semibold px-2.5 py-1 rounded-full flex items-center gap-1"
            style={{ background: '#EBF6F0', color: '#166534' }}
          >
            <CheckCircle2 size={11} /> Verified
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="mt-3 pt-3" style={{ borderTop: '1px solid #F0E8DC' }}>
        <p className="font-sans text-xs" style={{ color: '#9A9088' }}>
          Last active{' '}
          {pm.lastActivity
            ? formatDistanceToNow(new Date(pm.lastActivity), { addSuffix: true })
            : 'recently'}
        </p>
      </div>
    </motion.div>
  );
}
