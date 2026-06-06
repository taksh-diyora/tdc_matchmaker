import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import ClientCard from './ClientCard.jsx';
import ClientCardSkeleton from '../skeletons/ClientCardSkeleton.jsx';
import EmptyState from '../ui/EmptyState.jsx';

export default function ClientsGrid({ clients, isLoading }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => <ClientCardSkeleton key={i} />)}
      </div>
    );
  }

  if (!clients || clients.length === 0) {
    return <EmptyState icon={Users} title="No clients found" description="Try adjusting your search or filters." />;
  }

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
      initial="hidden"
      animate="visible"
    >
      {clients.map((c) => (
        <motion.div
          key={c.id}
          variants={{
            hidden: { opacity: 0, y: 14 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
          }}
        >
          <ClientCard client={c} />
        </motion.div>
      ))}
    </motion.div>
  );
}
