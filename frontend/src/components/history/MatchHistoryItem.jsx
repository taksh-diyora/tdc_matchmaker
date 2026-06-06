import { formatDistanceToNow } from 'date-fns';
import { ArrowRight, CheckCircle2, Clock, Eye } from 'lucide-react';
import ClientAvatar from '../clients/ClientAvatar.jsx';
import MatchScoreRing from '../matches/MatchScoreRing.jsx';

function PersonSummary({ person, label }) {
  if (!person) return <span className="font-sans text-sm" style={{ color: '#9A9088' }}>Unknown</span>;
  const initials = (person.fullName || 'U N').split(' ').map(n => n[0]).join('').slice(0, 2);
  const pm = person.platformMetadata || {};

  return (
    <div className="flex items-center gap-3 min-w-0">
      <ClientAvatar
        initials={initials}
        stageBg={pm.stageBg || '#EBF6F0'}
        stageColor={pm.stageColor || '#1B3A2C'}
        size="sm"
      />
      <div className="min-w-0">
        <p className="font-sans text-[9px] font-bold uppercase" style={{ letterSpacing: '0.12em', color: '#9A9088' }}>
          {label}
        </p>
        <p className="font-serif text-sm font-semibold truncate" style={{ color: '#2C2420' }}>
          {person.fullName}
        </p>
        <p className="font-sans text-xs truncate" style={{ color: '#9A9088' }}>
          {person.age} yrs · {person.city}, {person.state}
        </p>
      </div>
    </div>
  );
}

export default function MatchHistoryItem({ item, onViewProfile }) {
  const client = item.clientDetails;
  const match = item.matchDetails;
  const score = item.matchScore ? Math.round(item.matchScore.totalScore || 0) : null;

  // Tags to show for the match person
  const matchTags = [match?.religion, match?.diet, match?.educationTier].filter(Boolean);

  return (
    <div className="bg-white rounded-2xl p-5"
      style={{ border: '1px solid #E8E1D6', boxShadow: '0 1px 3px rgba(44,36,32,0.07)' }}>

      {/* Two-person layout */}
      <div className="flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <PersonSummary person={client} label="Client" />
        </div>

        {/* Arrow connector */}
        <div className="flex flex-col items-center gap-1.5 flex-shrink-0 px-2 justify-center">
          <div className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: '#FDF8EE' }}>
            <ArrowRight size={14} style={{ color: '#C8973F' }} />
          </div>
          {score !== null && (
            <div className="flex flex-col items-center">
              <MatchScoreRing score={score} size={40} />
              <span className="text-[8px] font-sans font-bold uppercase tracking-wider mt-0.5" style={{ color: '#9A9088' }}>
                Score
              </span>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <PersonSummary person={match} label="Matched With" />
        </div>
      </div>

      {/* Match details tags */}
      {matchTags.length > 0 && (
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          {matchTags.map(tag => (
            <span key={tag} className="text-[10px] font-sans font-medium px-2 py-0.5 rounded-full"
              style={{ background: '#F5F0E8', color: '#5C5248' }}>
              {tag}
            </span>
          ))}
          {match?.income && (
            <span className="text-[10px] font-sans font-medium px-2 py-0.5 rounded-full"
              style={{ background: '#F5F0E8', color: '#5C5248' }}>
              {match.income}
            </span>
          )}
        </div>
      )}

      {/* View Profile buttons */}
      <div className="flex gap-2 mt-3 pt-3" style={{ borderTop: '1px solid #F0E8DC' }}>
        {client && (
          <button
            onClick={() => onViewProfile?.(client)}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2 text-[12px] font-sans font-medium transition-all"
            style={{ background: '#F5F0E8', color: '#5C5248' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#EDE5DC'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#F5F0E8'; }}
          >
            <Eye size={13} />
            {client.fullName?.split(' ')[0]}'s Profile
          </button>
        )}
        {match && (
          <button
            onClick={() => onViewProfile?.(match)}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2 text-[12px] font-sans font-medium transition-all"
            style={{ background: '#F5F0E8', color: '#5C5248' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#EDE5DC'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#F5F0E8'; }}
          >
            <Eye size={13} />
            {match.fullName?.split(' ')[0]}'s Profile
          </button>
        )}
      </div>

      {/* Footer: subject, time, status */}
      <div className="mt-3 pt-3 flex items-center justify-between gap-4" style={{ borderTop: '1px solid #F0E8DC' }}>
        <div className="min-w-0 flex-1">
          <p className="font-sans text-xs truncate" style={{ color: '#5C5248' }}>
            {item.emailSubject}
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            <Clock size={10} style={{ color: '#9A9088' }} />
            <p className="font-sans text-[11px]" style={{ color: '#9A9088' }}>
              {item.sentAt
                ? formatDistanceToNow(new Date(item.sentAt), { addSuffix: true })
                : 'Recently'}
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-sans font-semibold px-3 py-1 rounded-full flex-shrink-0"
          style={{ background: '#EBF6F0', color: '#166534' }}>
          <CheckCircle2 size={11} />
          {item.status}
        </span>
      </div>
    </div>
  );
}
