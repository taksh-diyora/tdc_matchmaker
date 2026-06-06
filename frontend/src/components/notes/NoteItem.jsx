import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, Phone, Users, AlertTriangle, Clock, Lock } from 'lucide-react';

const typeIcons = {
  General: MessageSquare,
  Call: Phone,
  Meeting: Users,
  Important: AlertTriangle,
  'Follow-up': Clock,
};

const typeBg = {
  General: '#EBF6F0',
  Call: '#FDF8EE',
  Meeting: '#EBF6F0',
  Important: '#FEF2F2',
  'Follow-up': '#FDF8EE',
};

const typeColor = {
  General: '#1B3A2C',
  Call: '#C8973F',
  Meeting: '#1B3A2C',
  Important: '#DC2626',
  'Follow-up': '#C8973F',
};

export default function NoteItem({ note }) {
  const Icon = typeIcons[note.type] || MessageSquare;

  return (
    <div className="flex gap-3 px-6 py-3">
      {/* Icon */}
      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: typeBg[note.type] || '#F5F0E8' }}>
        <Icon size={14} style={{ color: typeColor[note.type] || '#5C5248' }} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-sans text-xs font-semibold" style={{ color: '#2C2420' }}>
            {note.type}
          </span>
          {note.isPrivate && (
            <span className="flex items-center gap-1 text-[10px] font-sans" style={{ color: '#9A9088' }}>
              <Lock size={10} /> Private
            </span>
          )}
        </div>
        <p className="font-sans text-sm italic leading-relaxed mt-1" style={{ color: '#5C5248' }}>
          {note.content}
        </p>
        <p className="font-sans text-[11px] mt-1.5" style={{ color: '#9A9088' }}>
          {note.createdAt
            ? formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })
            : 'Just now'}
          {note.createdBy && ` · ${note.createdBy}`}
        </p>
      </div>
    </div>
  );
}
