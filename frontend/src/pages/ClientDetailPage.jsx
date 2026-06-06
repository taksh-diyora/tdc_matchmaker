import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Sparkles, History, MessageSquare, RefreshCw, Send, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { getClientById, getClientMatches, getMatchHistory, updateClientStage } from '../services/api.js';
import ClientProfilePanel from '../components/clients/ClientProfilePanel.jsx';
import ProfilePanelSkeleton from '../components/skeletons/ProfilePanelSkeleton.jsx';
import MatchCard from '../components/matches/MatchCard.jsx';
import MatchCardSkeleton from '../components/skeletons/MatchCardSkeleton.jsx';
import ViewProfileModal from '../components/matches/ViewProfileModal.jsx';
import SendMatchModal from '../components/matches/SendMatchModal.jsx';
import NotesActivity from '../components/notes/NotesActivity.jsx';
import MatchHistoryItem from '../components/history/MatchHistoryItem.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';

const tabs = [
  { label: 'Suggested Matches', icon: Sparkles },
  { label: 'Match History', icon: History },
  { label: 'Notes & Activity', icon: MessageSquare },
];

const tabVariants = {
  enter: (dir) => ({ x: dir > 0 ? 20 : -20, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.22, ease: 'easeOut' } },
  exit: (dir) => ({ x: dir > 0 ? -20 : 20, opacity: 0, transition: { duration: 0.15 } }),
};

const STAGES = [
  { label: 'Active Search', bg: '#DCFCE7', color: '#166534', desc: 'Actively scouting matches' },
  { label: 'Shortlisted', bg: '#FEF3C7', color: '#92400E', desc: 'Candidates picked, not yet contacted' },
  { label: 'In Conversation', bg: '#DBEAFE', color: '#1E40AF', desc: 'Introduction sent, clients talking' },
  { label: 'Matched', bg: '#EDE9FE', color: '#5B21B6', desc: 'Successfully matched!' },
  { label: 'On Hold', bg: '#F3F4F6', color: '#374151', desc: 'Temporarily paused' },
];

export default function ClientDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState(0);
  const [direction, setDirection] = useState(0);
  const [viewProfile, setViewProfile] = useState(null);
  const [sendMatch, setSendMatch] = useState(null);
  const [showStageDropdown, setShowStageDropdown] = useState(false);

  // Fetch client detail
  const { data: client, isLoading: clientLoading } = useQuery({
    queryKey: ['client', id],
    queryFn: () => getClientById(id).then((r) => r.data.client),
  });

  // Fetch matches (computes scores on the server) — always fetch so scores are available
  const { data: matchesData, isLoading: matchesLoading, isRefetching, refetch } = useQuery({
    queryKey: ['matches', id],
    queryFn: () => getClientMatches(id).then((r) => r.data),
  });

  const matches = matchesData?.matches || [];

  // Fetch match history
  const { data: historyData, isLoading: historyLoading } = useQuery({
    queryKey: ['match-history-global'],
    queryFn: () => getMatchHistory().then((r) => r.data.history || []),
    enabled: activeTab === 1,
  });

  // Filter history for this client
  const clientHistory = (historyData || []).filter(
    (h) => h.clientId === id || h.matchId === id
  );

  // Stage update mutation
  const stageMutation = useMutation({
    mutationFn: ({ stage, reason }) => updateClientStage(id, stage, reason),
    onSuccess: (res) => {
      toast.success(`Stage updated to "${res.data.updatedStage}"`);
      queryClient.invalidateQueries({ queryKey: ['client', id] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['notes', id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      setShowStageDropdown(false);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update stage.'),
  });

  const handleStageChange = (newStage) => {
    if (client?.platformMetadata?.stage === newStage) {
      setShowStageDropdown(false);
      return;
    }
    stageMutation.mutate({ stage: newStage, reason: `Stage changed to ${newStage}` });
  };

  const handleTabChange = (index) => {
    setDirection(index > activeTab ? 1 : -1);
    setActiveTab(index);
  };

  return (
    <motion.div
      className="flex flex-col h-full"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {/* Breadcrumb header */}
      <div className="flex items-center justify-between px-8 py-4" style={{ background: '#FAF8F4', borderBottom: '1px solid #E8E1D6' }}>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1 font-sans text-sm cursor-pointer"
            style={{ color: '#9A9088' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#2C2420'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#9A9088'}
          >
            <ChevronLeft size={16} />
            My Clients
          </button>
          <span className="font-sans text-sm" style={{ color: '#9A9088' }}>/</span>
          <span className="font-sans text-sm" style={{ color: '#5C5248' }}>
            {clientLoading ? '...' : client?.fullName}
          </span>
        </div>

        {/* Stage change button */}
        {client && (
          <div className="relative">
            <button
              onClick={() => setShowStageDropdown(!showStageDropdown)}
              className="flex items-center gap-2 rounded-xl px-4 py-2 text-[13px] font-sans font-semibold transition-all"
              style={{
                background: client.platformMetadata?.stageBg || '#F5F0E8',
                color: client.platformMetadata?.stageColor || '#5C5248',
                border: '1px solid transparent',
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#C8973F'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
            >
              {client.platformMetadata?.stage || 'Unknown'}
              <ChevronDown size={14} />
            </button>

            {/* Stage dropdown */}
            <AnimatePresence>
              {showStageDropdown && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowStageDropdown(false)} />
                  <motion.div
                    className="absolute right-0 top-full mt-2 z-50 bg-white rounded-xl py-1 min-w-[180px]"
                    style={{ border: '1px solid #E8E1D6', boxShadow: '0 8px 28px rgba(44,36,32,0.12)' }}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                  >
                    <p className="px-3 py-1.5 font-sans text-[9px] font-bold uppercase" style={{ letterSpacing: '0.15em', color: '#9A9088' }}>
                      Change Stage
                    </p>
                    {STAGES.map((s) => (
                      <button
                        key={s.label}
                        onClick={() => handleStageChange(s.label)}
                        className="w-full text-left px-3 py-2 font-sans text-sm flex items-center gap-2 transition-all"
                        style={{ color: '#2C2420' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#F5F0E8'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: s.color }} />
                        <span className="flex-1">
                          <span className="block">{s.label}</span>
                          <span className="block text-[10px] font-normal" style={{ color: '#9A9088' }}>{s.desc}</span>
                        </span>
                        {client.platformMetadata?.stage === s.label && (
                          <span className="text-[10px] font-semibold flex-shrink-0" style={{ color: '#C8973F' }}>Current</span>
                        )}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Two-column layout */}
      <div className="flex gap-6 p-6 min-h-0 flex-1 overflow-hidden">
        {/* Left column - profile */}
        <div className="w-72 xl:w-80 flex-shrink-0 overflow-y-auto max-h-full">
          {clientLoading ? <ProfilePanelSkeleton /> : client && <ClientProfilePanel client={client} />}
        </div>

        {/* Right column - tabs */}
        <div className="flex-1 min-w-0 bg-white rounded-3xl flex flex-col overflow-hidden h-full"
          style={{ border: '1px solid #E8E1D6', boxShadow: '0 1px 3px rgba(44,36,32,0.07)' }}>

          {/* Tab bar */}
          <div className="flex items-center gap-0 px-6 pt-4" style={{ borderBottom: '1px solid #E8E1D6' }}>
            {tabs.map((tab, i) => (
              <button
                key={tab.label}
                onClick={() => handleTabChange(i)}
                className="flex items-center gap-2 px-4 py-2.5 font-sans text-sm font-medium cursor-pointer transition-all relative -mb-px"
                style={{
                  color: activeTab === i ? '#1B3A2C' : '#9A9088',
                  fontWeight: activeTab === i ? 600 : 500,
                  borderBottom: activeTab === i ? '2px solid #C8973F' : '2px solid transparent',
                }}
                onMouseEnter={(e) => { if (activeTab !== i) e.currentTarget.style.color = '#5C5248'; }}
                onMouseLeave={(e) => { if (activeTab !== i) e.currentTarget.style.color = '#9A9088'; }}
              >
                <tab.icon size={15} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={activeTab}
                custom={direction}
                variants={tabVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="h-full"
              >
                {/* Suggested Matches */}
                {activeTab === 0 && (
                  <div>
                    {/* Stage-aware banner */}
                    {client && ['Matched', 'On Hold'].includes(client.platformMetadata?.stage) && (
                      <div className="mx-6 mt-4 flex items-center gap-2 rounded-xl px-4 py-3 font-sans text-sm"
                        style={{
                          background: client.platformMetadata.stage === 'Matched' ? '#EDE9FE' : '#F3F4F6',
                          color: client.platformMetadata.stage === 'Matched' ? '#5B21B6' : '#374151',
                          border: `1px solid ${client.platformMetadata.stage === 'Matched' ? '#C4B5FD' : '#D1D5DB'}`,
                        }}
                      >
                        {client.platformMetadata.stage === 'Matched'
                          ? '🎉 This client has been successfully matched! Match proposals are disabled.'
                          : '⏸️ This client is on hold. Change their stage to resume matchmaking.'}
                      </div>
                    )}

                    <div className="flex items-center justify-between px-6 pt-5 pb-3">
                      <p className="font-serif text-base font-semibold" style={{ color: '#2C2420' }}>
                        {matches.length} Compatible Profiles
                      </p>
                      <button
                        onClick={() => refetch()}
                        disabled={['Matched', 'On Hold'].includes(client?.platformMetadata?.stage)}
                        className="flex items-center gap-2 rounded-xl px-4 py-2 text-[13px] font-sans font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ background: '#FFFFFF', border: '1px solid #E8E1D6', color: '#5C5248' }}
                        onMouseEnter={(e) => { if (!e.currentTarget.disabled) { e.currentTarget.style.borderColor = '#C8973F'; e.currentTarget.style.color = '#A07428'; e.currentTarget.style.background = '#FDF8EE'; } }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E8E1D6'; e.currentTarget.style.color = '#5C5248'; e.currentTarget.style.background = '#FFFFFF'; }}
                      >
                        <RefreshCw size={14} className={isRefetching ? 'animate-spin' : ''} />
                        {isRefetching ? 'Running...' : 'Re-Run Algorithm'}
                      </button>
                    </div>

                    <div className="flex flex-col gap-4 px-6 pb-6">
                      {(matchesLoading || isRefetching) ? (
                        [...Array(3)].map((_, i) => <MatchCardSkeleton key={i} />)
                      ) : matches.length === 0 ? (
                        <EmptyState icon={Sparkles} title="No matches found" description="Try re-running the algorithm or check back later." />
                      ) : (
                        <motion.div
                          className="flex flex-col gap-4"
                          variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
                          initial="hidden" animate="visible"
                        >
                          {matches.map((m) => (
                            <motion.div key={m.id}
                              variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } }}>
                              <MatchCard
                                match={m}
                                onViewProfile={() => setViewProfile(m)}
                                onSendMatch={() => setSendMatch(m)}
                                isLocked={['Matched', 'On Hold'].includes(client?.platformMetadata?.stage)}
                              />
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  </div>
                )}

                {/* Match History */}
                {activeTab === 1 && (
                  <div className="flex flex-col gap-4 px-6 py-5">
                    {historyLoading ? (
                      [...Array(3)].map((_, i) => <MatchCardSkeleton key={i} />)
                    ) : clientHistory.length === 0 ? (
                      <EmptyState icon={History} title="No match history" description="Matches you send will appear here." />
                    ) : (
                      clientHistory.map((h, i) => (
                        <MatchHistoryItem
                          key={h.id || i}
                          item={h}
                          onViewProfile={(person) => setViewProfile(person)}
                        />
                      ))
                    )}
                  </div>
                )}

                {/* Notes & Activity */}
                {activeTab === 2 && (
                  <NotesActivity clientId={id} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {viewProfile && <ViewProfileModal match={viewProfile} onClose={() => setViewProfile(null)} />}
      </AnimatePresence>
      <AnimatePresence>
        {sendMatch && client && (
          <SendMatchModal
            client={client}
            match={sendMatch}
            onClose={() => setSendMatch(null)}
            onSuccess={() => {
              queryClient.invalidateQueries({ queryKey: ['client', id] });
              queryClient.invalidateQueries({ queryKey: ['clients'] });
              queryClient.invalidateQueries({ queryKey: ['matches', id] });
              queryClient.invalidateQueries({ queryKey: ['match-history-global'] });
              queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
              queryClient.invalidateQueries({ queryKey: ['notes', id] });
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
