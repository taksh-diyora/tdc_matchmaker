import { motion } from 'framer-motion';
import { Eye, Send, CheckCircle2, AlertTriangle } from 'lucide-react';
import MatchScoreRing from './MatchScoreRing.jsx';
import ClientAvatar from '../clients/ClientAvatar.jsx';

const DEALBREAKER_LABELS = {
  religion_mismatch: 'Religious beliefs are incompatible',
  kids_mismatch: 'Conflicting views on having children',
  diet_conflict: 'Significant dietary differences',
  living_arrangement_conflict: 'Living arrangement preferences clash',
  manglik_conflict: 'Manglik status does not align',
};

export default function MatchCard({ match, onViewProfile, onSendMatch, isLocked = false }) {
  const pm = match.platformMetadata || {};
  const initials = (match.fullName || 'U N').split(' ').map(n => n[0]).join('').slice(0, 2);
  const reasons = match.reasons || [];
  // Backend returns matchScore object with totalScore
  const score = Math.round(match.matchScore?.totalScore || 0);
  const scoreLabel = match.matchScore?.scoreLabel || '';
  const hasDealbreaker = match.matchScore?.hasDealbreaker || false;
  const dealbreakers = match.matchScore?.dealbreakers || [];

  return (
    <motion.div
      className="bg-white rounded-2xl p-5"
      style={{ border: '1px solid #E8E1D6', boxShadow: '0 1px 3px rgba(44,36,32,0.07)' }}
      whileHover={{ y: -2, boxShadow: '0 8px 28px rgba(44,36,32,0.11)' }}
      transition={{ duration: 0.15 }}
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <ClientAvatar
          initials={initials}
          stageBg={pm.stageBg || '#EBF6F0'}
          stageColor={pm.stageColor || '#1B3A2C'}
          size="md"
        />

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-base font-semibold" style={{ color: '#2C2420' }}>
              {match.fullName}
            </h3>
            {pm.verified && (
              <CheckCircle2 size={14} style={{ color: '#166534' }} />
            )}
          </div>
          <p className="font-sans text-sm mt-0.5" style={{ color: '#9A9088' }}>
            {match.age} yrs · {match.city}, {match.state}
          </p>

          {/* Tags */}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {match.religion && (
              <span className="text-[11px] font-sans font-medium px-2.5 py-0.5 rounded-full"
                style={{ background: '#F5F0E8', color: '#5C5248' }}>
                {match.religion}
              </span>
            )}
            {match.diet && (
              <span className="text-[11px] font-sans font-medium px-2.5 py-0.5 rounded-full"
                style={{ background: '#F5F0E8', color: '#5C5248' }}>
                {match.diet}
              </span>
            )}
            {match.educationTier && (
              <span className="text-[11px] font-sans font-medium px-2.5 py-0.5 rounded-full"
                style={{ background: '#F5F0E8', color: '#5C5248' }}>
                {match.educationTier}
              </span>
            )}
            {scoreLabel && (
              <span className="text-[11px] font-sans font-semibold px-2.5 py-0.5 rounded-full"
                style={{
                  background: score >= 75 ? '#EBF6F0' : score >= 50 ? '#FDF8EE' : '#FEF2F2',
                  color: score >= 75 ? '#166534' : score >= 50 ? '#92400E' : '#991B1B',
                }}>
                {scoreLabel}
              </span>
            )}
          </div>
        </div>

        {/* Score */}
        <MatchScoreRing score={score} />
      </div>

      {/* Dealbreakers warning */}
      {hasDealbreaker && dealbreakers.length > 0 && (
        <div className="mt-3 flex items-start gap-2 rounded-xl px-3 py-2" style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
          <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" style={{ color: '#DC2626' }} />
          <div>
            <p className="font-sans text-xs font-semibold" style={{ color: '#991B1B' }}>Dealbreakers</p>
            <ul className="mt-0.5 space-y-0.5">
              {dealbreakers.map((d, i) => (
                <li key={i} className="font-sans text-xs" style={{ color: '#991B1B' }}>
                  • {DEALBREAKER_LABELS[d] || d.replace(/_/g, ' ')}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Reasons */}
      {reasons.length > 0 && (
        <div className="mt-3 pt-3" style={{ borderTop: '1px solid #F0E8DC' }}>
          <p className="font-sans text-[9px] font-bold uppercase mb-2" style={{ letterSpacing: '0.15em', color: '#9A9088' }}>
            Why They Match
          </p>
          <div className="space-y-1">
            {reasons.slice(0, 3).map((r, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#C8973F' }} />
                <p className="font-sans text-sm leading-relaxed" style={{ color: '#5C5248' }}>{r}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2 mt-4 pt-4" style={{ borderTop: '1px solid #F0E8DC' }}>
        <button
          onClick={() => onViewProfile?.(match)}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2 text-[13px] font-sans font-medium transition-all"
          style={{ background: '#F5F0E8', color: '#5C5248' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#EDE5DC'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#F5F0E8'; }}
        >
          <Eye size={14} />
          View Profile
        </button>
        <button
          onClick={() => onSendMatch?.(match)}
          disabled={isLocked}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2 text-[13px] font-sans font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: '#1B3A2C' }}
          onMouseEnter={(e) => { if (!isLocked) e.currentTarget.style.background = '#22503D'; }}
          onMouseLeave={(e) => e.currentTarget.style.background = '#1B3A2C'}
        >
          <Send size={14} />
          {isLocked ? 'Locked' : 'Send Match'}
        </button>
      </div>
    </motion.div>
  );
}
