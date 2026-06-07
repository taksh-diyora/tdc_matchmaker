import { motion } from 'framer-motion';
import { X, User, Heart, Coffee, Briefcase, MapPin } from 'lucide-react';
import ClientAvatar from '../clients/ClientAvatar.jsx';
import ProfileSection from '../clients/ProfileSection.jsx';
import InfoField from '../clients/InfoField.jsx';
import MatchScoreRing from './MatchScoreRing.jsx';

export default function ViewProfileModal({ match, onClose }) {
  if (!match) return null;
  const pm = match.platformMetadata || {};
  const initials = (match.fullName || 'U N').split(' ').map(n => n[0]).join('').slice(0, 2);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-3xl w-full max-w-lg flex flex-col overflow-hidden"
        style={{ maxHeight: '85vh', boxShadow: '0 16px 48px rgba(44,36,32,0.13)' }}
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 flex items-start justify-between flex-shrink-0" style={{ borderBottom: '1px solid #E8E1D6' }}>
          <div className="flex items-center gap-4">
            <ClientAvatar initials={initials} stageBg={pm.stageBg || '#EBF6F0'} stageColor={pm.stageColor || '#1B3A2C'} size="lg" />
            <div>
              <h2 className="font-serif text-xl font-semibold" style={{ color: '#2C2420' }}>{match.fullName}</h2>
              <p className="font-sans text-sm" style={{ color: '#9A9088' }}>{match.age} yrs · {match.city}, {match.state}</p>
              <p className="font-sans text-sm" style={{ color: '#B6AFA9' }}>{match.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MatchScoreRing score={Math.round(match.matchScore?.totalScore || 0)} size={48} />
            <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ color: '#9A9088' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#F5F0E8'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          <ProfileSection label="Personal" icon={User}>
            <InfoField label="Gender" value={match.gender} />
            <InfoField label="Marital Status" value={match.maritalStatus} />
            <InfoField label="Want Kids" value={match.wantKids} />
            <InfoField label="Height" value={match.heightCm} />
          </ProfileSection>

          <ProfileSection label="Cultural" icon={Heart}>
            <InfoField label="Religion" value={match.religion} />
            <InfoField label="Languages" value={match.fluentLanguages?.join(', ')} fullWidth />
          </ProfileSection>

          <ProfileSection label="Lifestyle" icon={Coffee}>
            <InfoField label="Diet" value={match.diet} />
            <InfoField label="Family Values" value={match.familyValues} />
            <InfoField label="Timeline to Marry" value={match.timelineToMarry} />
          </ProfileSection>

          <ProfileSection label="Professional" icon={Briefcase}>
            <InfoField label="Education" value={match.educationTier} />
            <InfoField label="Income" value={match.income} />
          </ProfileSection>

          <ProfileSection label="Location" icon={MapPin}>
            <InfoField label="City" value={match.city} />
            <InfoField label="State" value={match.state} />
          </ProfileSection>
        </div>
      </motion.div>
    </motion.div>
  );
}
