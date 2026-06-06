import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Send } from 'lucide-react';
import { getMatchHistory } from '../services/api.js';
import PageHeader from '../components/layout/PageHeader.jsx';
import MatchHistoryItem from '../components/history/MatchHistoryItem.jsx';
import MatchCardSkeleton from '../components/skeletons/MatchCardSkeleton.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import ViewProfileModal from '../components/matches/ViewProfileModal.jsx';

export default function MatchHistoryGlobalPage() {
  const [viewProfile, setViewProfile] = useState(null);

  const { data: history, isLoading } = useQuery({
    queryKey: ['match-history-global'],
    queryFn: () => getMatchHistory().then((r) => r.data.history || []),
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <PageHeader title="Match History" />

      <div className="px-8 py-6">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => <MatchCardSkeleton key={i} />)}
          </div>
        ) : !history || history.length === 0 ? (
          <EmptyState icon={Send} title="No matches sent yet" description="When you send match proposals, they'll appear here." />
        ) : (
          <motion.div
            className="space-y-4"
            variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
            initial="hidden" animate="visible"
          >
            {history.map((item, i) => (
              <motion.div
                key={item.id || i}
                variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } }}
              >
                <MatchHistoryItem
                  item={item}
                  onViewProfile={(person) => setViewProfile(person)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* View Profile Modal */}
      <AnimatePresence>
        {viewProfile && <ViewProfileModal match={viewProfile} onClose={() => setViewProfile(null)} />}
      </AnimatePresence>
    </motion.div>
  );
}
