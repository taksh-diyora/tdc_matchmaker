import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Sparkles, Loader2, Send } from 'lucide-react';
import { toast } from 'sonner';
import { sendMatchProposal, generateIntroEmail } from '../../services/api.js';
import { celebrationEffect } from '../../utils/celebrationEffect.js';

export default function SendMatchModal({ client, match, onClose, onSuccess }) {
  const score = Math.round(match.matchScore?.totalScore || 0);
  const [emailSubject, setEmailSubject] = useState(
    `Match Proposal: ${client?.fullName || client?.firstName} & ${match?.fullName}`
  );
  const [emailBody, setEmailBody] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleGenerateEmail = async () => {
    setIsGenerating(true);
    try {
      const res = await generateIntroEmail({
        client: {
          fullName: client.fullName || `${client.firstName} ${client.lastName}`,
          age: client.age,
          city: client.city,
          designation: client.workPostMarriageIntent || '',
        },
        match: {
          fullName: match.fullName,
          age: match.age,
          city: match.city,
          designation: match.workPostMarriageIntent || '',
          religion: match.religion,
          degree: match.educationTier,
          income: match.income,
          familyValues: match.familyValues,
          wantKids: match.wantKids,
        },
        compatibilityScore: score,
        reasons: match.reasons || [],
      });
      setEmailSubject(res.data.emailSubject || emailSubject);
      setEmailBody(res.data.emailBody || '');
      toast.success('Email generated ✓');
    } catch {
      toast.error('Failed to generate email. Try writing manually.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSend = async () => {
    if (!emailBody.trim()) {
      toast.error('Please write an email body first.');
      return;
    }
    setIsSending(true);
    try {
      await sendMatchProposal(client.id, match.id, emailSubject, emailBody);
      celebrationEffect();
      toast.success('Match proposal sent successfully! 🎉');
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send proposal.');
    } finally {
      setIsSending(false);
    }
  };

  const focusStyle = (e) => { e.target.style.boxShadow = '0 0 0 2px #C8973F'; e.target.style.borderColor = 'transparent'; };
  const blurStyle = (e) => { e.target.style.boxShadow = 'none'; e.target.style.borderColor = '#E8E1D6'; };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-3xl w-full max-w-xl flex flex-col overflow-hidden"
        style={{ maxHeight: '85vh', boxShadow: '0 16px 48px rgba(44,36,32,0.13)' }}
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 flex items-center justify-between flex-shrink-0" style={{ borderBottom: '1px solid #E8E1D6' }}>
          <div>
            <h2 className="font-serif text-xl font-semibold" style={{ color: '#2C2420' }}>Send Match Proposal</h2>
            <p className="font-sans text-sm mt-0.5" style={{ color: '#9A9088' }}>
              {client?.fullName || client?.firstName} → {match?.fullName} · {score}% match
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ color: '#9A9088' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#F5F0E8'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {/* Generate with AI */}
          <button
            onClick={handleGenerateEmail}
            disabled={isGenerating}
            className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-[13px] font-sans font-medium transition-all"
            style={{ background: 'linear-gradient(to right, #FDF8EE, #F7EDCC)', border: '1px solid #E3C47A', color: '#A07428' }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#C8973F'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#E3C47A'}
          >
            {isGenerating ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
            {isGenerating ? 'Generating...' : 'Generate with AI'}
          </button>

          {/* Subject */}
          <div>
            <label className="font-sans text-[10px] font-semibold uppercase mb-1.5 block" style={{ letterSpacing: '0.12em', color: '#9A9088' }}>
              Subject
            </label>
            <input
              type="text" value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              className="w-full rounded-xl px-4 py-2.5 text-sm font-sans outline-none transition-all"
              style={{ border: '1px solid #E8E1D6', background: '#FAF8F4', color: '#2C2420' }}
              onFocus={focusStyle} onBlur={blurStyle}
            />
          </div>

          {/* Body */}
          <div>
            <label className="font-sans text-[10px] font-semibold uppercase mb-1.5 block" style={{ letterSpacing: '0.12em', color: '#9A9088' }}>
              Email Body
            </label>
            <textarea
              value={emailBody}
              onChange={(e) => setEmailBody(e.target.value)}
              placeholder="Write the introduction email or generate one with AI..."
              rows={10}
              className="w-full rounded-xl px-4 py-3 text-sm font-sans outline-none transition-all resize-none"
              style={{ border: '1px solid #E8E1D6', background: '#FAF8F4', color: '#2C2420' }}
              onFocus={focusStyle} onBlur={blurStyle}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex items-center justify-end gap-3 flex-shrink-0" style={{ borderTop: '1px solid #E8E1D6' }}>
          <button onClick={onClose}
            className="rounded-xl px-5 py-2.5 text-sm font-medium"
            style={{ background: '#F5F0E8', color: '#5C5248' }}>
            Cancel
          </button>
          <button onClick={handleSend} disabled={isSending}
            className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white flex items-center gap-2 disabled:opacity-60"
            style={{ background: '#1B3A2C' }}
            onMouseEnter={(e) => { if (!isSending) e.currentTarget.style.background = '#22503D'; }}
            onMouseLeave={(e) => e.currentTarget.style.background = '#1B3A2C'}
          >
            {isSending ? <><Loader2 className="animate-spin" size={14} /> Sending...</> : <><Send size={14} /> Send Proposal</>}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
