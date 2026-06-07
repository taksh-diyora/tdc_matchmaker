import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { UserPlus, ChevronLeft, ChevronRight } from 'lucide-react';
import { getClients } from '../services/api.js';
import { useDebounce } from '../hooks/useDebounce.js';
import PageHeader from '../components/layout/PageHeader.jsx';
import StatsGrid from '../components/dashboard/StatsGrid.jsx';
import ClientFilters from '../components/dashboard/ClientFilters.jsx';
import ClientsGrid from '../components/dashboard/ClientsGrid.jsx';
import AddClientModal from '../components/clients/AddClientModal.jsx';

export default function DashboardPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState('');
  const [stage, setStage] = useState('all');
  const [gender, setGender] = useState('all');
  const [sortBy, setSortBy] = useState('lastActivity');
  const [page, setPage] = useState(1);
  const limit = 12;

  const debouncedSearch = useDebounce(search, 400);

  const queryParams = {
    search: debouncedSearch || undefined,
    stage: stage === 'all' ? undefined : stage,
    gender: gender === 'all' ? undefined : gender,
    sortBy,
    page,
    limit,
  };

  const { data, isLoading } = useQuery({
    queryKey: ['clients', queryParams],
    queryFn: () => getClients(queryParams).then((r) => r.data),
  });

  const clients = data?.clients || data || [];
  const totalPages = data?.totalPages || 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <PageHeader title="My Clients">
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 text-white rounded-xl px-4 py-2.5 text-sm font-sans font-semibold"
          style={{
            background: '#1B3A2C',
            boxShadow: '0 1px 3px rgba(44,36,32,0.07)',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#22503D'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#1B3A2C'}
        >
          <UserPlus size={16} />
          Add Client
        </button>
      </PageHeader>

      <div className="px-8 py-6">
        <StatsGrid />

        <ClientFilters
          search={search}
          onSearchChange={(v) => { setSearch(v); setPage(1); }}
          stage={stage}
          onStageChange={(v) => { setStage(v); setPage(1); }}
          gender={gender}
          onGenderChange={(v) => { setGender(v); setPage(1); }}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        <ClientsGrid clients={clients} isLoading={isLoading} />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-9 h-9 rounded-xl flex items-center justify-center font-sans text-sm font-medium disabled:opacity-30"
              style={{ background: '#FFFFFF', border: '1px solid #E8E1D6', color: '#5C5248' }}
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center font-sans text-sm font-medium"
                  style={
                    page === pageNum
                      ? { background: '#1B3A2C', color: '#FFFFFF' }
                      : { background: '#FFFFFF', border: '1px solid #E8E1D6', color: '#5C5248' }
                  }
                  onMouseEnter={(e) => {
                    if (page !== pageNum) e.currentTarget.style.background = '#F5F0E8';
                  }}
                  onMouseLeave={(e) => {
                    if (page !== pageNum) e.currentTarget.style.background = '#FFFFFF';
                  }}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-9 h-9 rounded-xl flex items-center justify-center font-sans text-sm font-medium disabled:opacity-30"
              style={{ background: '#FFFFFF', border: '1px solid #E8E1D6', color: '#5C5248' }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Add Client Modal */}
      {showAddModal && <AddClientModal onClose={() => setShowAddModal(false)} />}
    </motion.div>
  );
}
