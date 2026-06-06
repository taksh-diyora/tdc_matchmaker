import { useState } from 'react';
import { Loader2, Send } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

const noteTypes = ['General', 'Call', 'Meeting', 'Follow-up', 'Important'];

export default function AddNoteForm({ onSubmit, isSubmitting }) {
  const [type, setType] = useState('General');
  const [content, setContent] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSubmit({ type, content, isPrivate });
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit} className="px-6 py-4" style={{ borderBottom: '1px solid #E8E1D6' }}>
      {/* Type badges */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        {noteTypes.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            className="text-[11px] font-sans font-semibold px-3 py-1 rounded-full transition-all cursor-pointer"
            style={
              type === t
                ? { background: '#1B3A2C', color: '#FFFFFF' }
                : { background: '#F5F0E8', color: '#5C5248' }
            }
          >
            {t}
          </button>
        ))}
      </div>

      {/* Textarea */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Add a note..."
        rows={3}
        className="w-full rounded-xl px-4 py-3 text-sm font-sans outline-none transition-all resize-none"
        style={{ border: '1px solid #E8E1D6', background: '#FAF8F4', color: '#2C2420' }}
        onFocus={(e) => { e.target.style.boxShadow = '0 0 0 2px #C8973F'; e.target.style.borderColor = 'transparent'; }}
        onBlur={(e) => { e.target.style.boxShadow = 'none'; e.target.style.borderColor = '#E8E1D6'; }}
      />

      {/* Footer */}
      <div className="flex items-center justify-between mt-3">
        <label className="flex items-center gap-2 font-sans text-xs" style={{ color: '#9A9088' }}>
          <Switch checked={isPrivate} onCheckedChange={setIsPrivate} />
          Private note
        </label>
        <button
          type="submit"
          disabled={isSubmitting || !content.trim()}
          className="flex items-center gap-2 rounded-xl px-4 py-2 text-[13px] font-sans font-semibold text-white disabled:opacity-50"
          style={{ background: '#1B3A2C' }}
        >
          {isSubmitting ? <Loader2 className="animate-spin" size={14} /> : <Send size={14} />}
          Add Note
        </button>
      </div>
    </form>
  );
}
