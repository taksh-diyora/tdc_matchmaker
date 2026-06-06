import { motion } from 'framer-motion';
import { User, Heart, Coffee, Briefcase, MapPin, Phone, Sparkles, CheckCircle2 } from 'lucide-react';
import ClientAvatar from './ClientAvatar.jsx';
import StageBadge from './StageBadge.jsx';
import ProfileSection from './ProfileSection.jsx';
import InfoField from './InfoField.jsx';

export default function ClientProfilePanel({ client }) {
  const pm = client.platformMetadata || {};
  const initials = (client.firstName?.[0] || '') + (client.lastName?.[0] || '');

  return (
    <div className="rounded-3xl overflow-hidden flex flex-col" style={{ background: '#1B3A2C', boxShadow: '0 8px 28px rgba(44,36,32,0.11)' }}>
      {/* Dark header */}
      <motion.div
        className="px-6 pt-6 pb-8 flex flex-col items-center text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {/* Avatar with ring */}
        <div className="p-[3px] rounded-full" style={{ background: 'rgba(200,151,63,0.3)' }}>
          <div className="p-[2px] rounded-full" style={{ background: '#1B3A2C' }}>
            <ClientAvatar initials={initials} stageBg={pm.stageBg || '#C8973F'} stageColor={pm.stageColor || '#FFFFFF'} size="xl" />
          </div>
        </div>

        <h2 className="font-serif text-2xl font-bold text-white mt-4">
          {client.fullName || `${client.firstName} ${client.lastName}`}
        </h2>
        <p className="font-sans text-sm mt-1" style={{ color: '#B5D9C8' }}>
          {client.age} yrs · {client.city}, {client.state}
        </p>

        <div className="mt-3">
          <StageBadge stage={pm.stage || 'Unknown'} stageBg={pm.stageBg || '#F5F0E8'} stageColor={pm.stageColor || '#5C5248'} />
        </div>

        {/* Tags */}
        <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
          {client.religion && (
            <span className="text-[11px] font-sans font-medium px-3 py-1 rounded-full"
              style={{ background: 'rgba(255,255,255,0.1)', color: '#E3C47A' }}>
              {client.religion}
            </span>
          )}
          {client.maritalStatus && (
            <span className="text-[11px] font-sans font-medium px-3 py-1 rounded-full"
              style={{ background: 'rgba(255,255,255,0.1)', color: '#E3C47A' }}>
              {client.maritalStatus}
            </span>
          )}
          {pm.verified && (
            <span className="text-[11px] font-sans font-semibold px-3 py-1 rounded-full flex items-center gap-1"
              style={{ background: '#166534', color: '#FFFFFF' }}>
              <CheckCircle2 size={11} /> Verified
            </span>
          )}
        </div>

        <p className="font-mono text-xs mt-2" style={{ color: '#4C9469' }}>
          {client.id}
        </p>
      </motion.div>

      {/* Light body */}
      <div className="flex-1 overflow-y-auto" style={{ background: '#FAF8F4' }}>
        <ProfileSection label="Personal" icon={User}>
          <InfoField label="First Name" value={client.firstName} />
          <InfoField label="Last Name" value={client.lastName} />
          <InfoField label="Date of Birth" value={client.dateOfBirth} />
          <InfoField label="Gender" value={client.gender} />
          <InfoField label="Marital Status" value={client.maritalStatus} />
          <InfoField label="Want Kids" value={client.wantKids} />
          <InfoField label="Height" value={client.heightCm} />
        </ProfileSection>

        <ProfileSection label="Cultural" icon={Heart}>
          <InfoField label="Religion" value={client.religion} />
          <InfoField label="Varna" value={client.varna} />
          <InfoField label="Jati" value={client.jati} />
          <InfoField label="Mother Tongue" value={client.motherTongue} />
          <InfoField label="Gotra" value={client.gotra} />
          <InfoField label="Sect" value={client.sect} />
          <InfoField label="Language Family" value={client.languageFamily} />
          <InfoField label="Languages" value={client.fluentLanguages?.join(', ')} fullWidth={client.fluentLanguages?.length > 2} />
          <InfoField label="Horoscope Required" value={client.horoscopeMatchingRequired ? 'Yes' : 'No'} />
          <InfoField label="Manglik" value={client.isManglik ? 'Yes' : 'No'} />
        </ProfileSection>

        <ProfileSection label="Lifestyle" icon={Coffee}>
          <InfoField label="Diet" value={client.diet} />
          <InfoField label="Drinking" value={client.drinking} />
          <InfoField label="Smoking" value={client.smoking} />
          <InfoField label="Open to Pets" value={client.openToPets ? 'Yes' : 'No'} />
          <InfoField label="Family Values" value={client.familyValues} />
          <InfoField label="Living Arrangement" value={client.livingArrangement} />
          <InfoField label="Timeline to Marry" value={client.timelineToMarry} fullWidth />
        </ProfileSection>

        <ProfileSection label="Professional" icon={Briefcase}>
          <InfoField label="Education" value={client.educationTier} />
          <InfoField label="Top Institution" value={client.topInstitution ? 'Yes' : 'No'} />
          <InfoField label="Income" value={client.income} />
          <InfoField label="Work Intent" value={client.workPostMarriageIntent} fullWidth={client.workPostMarriageIntent?.length > 30} />
        </ProfileSection>

        <ProfileSection label="Location" icon={MapPin}>
          <InfoField label="City" value={client.city} />
          <InfoField label="Metro Region" value={client.metroRegion} />
          <InfoField label="State" value={client.state} />
          <InfoField label="Zone" value={client.zone} />
          <InfoField label="Country" value={client.country} />
          <InfoField label="Open to Relocation" value={client.openToRelocation ? 'Yes' : 'No'} />
        </ProfileSection>

        <ProfileSection label="Contact" icon={Phone}>
          <InfoField label="Email" value={
            client.contact?.email ? (
              <a href={`mailto:${client.contact.email}`} className="underline" style={{ color: '#2C2420' }}>
                {client.contact.email}
              </a>
            ) : null
          } fullWidth />
          <InfoField label="Phone" value={client.contact?.phone} fullWidth />
        </ProfileSection>

        {/* AI Insights */}
        {client.summary && (
          <div className="mx-5 mb-5 mt-1 p-4 rounded-2xl" style={{
            background: 'linear-gradient(to bottom right, #FDF8EE, #F7EDCC)',
            border: '1px solid #E3C47A',
          }}>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={13} style={{ color: '#A07428' }} />
              <span className="font-sans text-[9px] font-bold uppercase" style={{ letterSpacing: '0.18em', color: '#A07428' }}>
                AI Insights
              </span>
            </div>
            <p className="font-serif italic text-sm leading-relaxed" style={{ color: '#5C5248' }}>
              {client.summary}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
