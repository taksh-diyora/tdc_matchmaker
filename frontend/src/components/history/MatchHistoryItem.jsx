import { formatDistanceToNow } from 'date-fns';
import { Send, CheckCircle2 } from 'lucide-react';

export default function MatchHistoryItem({ item }) {
  return (
    <div className="bg-white rounded-2xl p-5 flex items-start gap-4"
      style={{ border: '1px solid #E8E1D6', boxShadow: '0 1px 3px rgba(44,36,32,0.07)' }}>
      {/* Icon */}
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: '#EBF6F0' }}>
        <Send size={16} style={{ color: '#1B3A2C' }} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-serif text-base font-semibold" style={{ color: '#2C2420' }}>
            {item.clientId} → {item.matchId}
          </h3>
          {item.status === 'Sent' && (
            <CheckCircle2 size={14} style={{ color: '#166534' }} />
          )}
        </div>
        <p className="font-sans text-sm mt-0.5 truncate" style={{ color: '#9A9088' }}>
          {item.emailSubject}
        </p>
        <p className="font-sans text-xs mt-1.5" style={{ color: '#9A9088' }}>
          {item.sentAt
            ? formatDistanceToNow(new Date(item.sentAt), { addSuffix: true })
            : 'Recently'}
        </p>
      </div>

      {/* Status badge */}
      <div className="flex-shrink-0">
        <span className="text-[11px] font-sans font-semibold px-3 py-1 rounded-full"
          style={{ background: '#EBF6F0', color: '#166534' }}>
          {item.status}
        </span>
      </div>
    </div>
  );
}
