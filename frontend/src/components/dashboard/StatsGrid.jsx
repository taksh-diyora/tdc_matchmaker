import { useQuery } from '@tanstack/react-query';
import { Users, Send, Heart, CheckCircle2 } from 'lucide-react';
import { getDashboardStats } from '../../services/api.js';
import StatsCard from './StatsCard.jsx';
import StatsCardSkeleton from '../skeletons/StatsCardSkeleton.jsx';

const statsConfig = [
  { key: 'activeClients',       label: 'Active Clients',          icon: Users,        iconBg: '#EBF6F0', iconColor: '#1B3A2C' },
  { key: 'matchesSentThisMonth', label: 'Matches Sent This Month', icon: Send,         iconBg: '#FDF8EE', iconColor: '#C8973F' },
  { key: 'currentlyDating',     label: 'Currently Dating',        icon: Heart,        iconBg: '#FEF2F2', iconColor: '#DC2626' },
  { key: 'closedMatched',       label: 'Successful Matches',      icon: CheckCircle2, iconBg: '#EBF6F0', iconColor: '#166534' },
];

export default function StatsGrid() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => getDashboardStats().then(r => r.data),
  });

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {isLoading
        ? [...Array(4)].map((_, i) => <StatsCardSkeleton key={i} />)
        : statsConfig.map((s) => (
            <StatsCard
              key={s.key}
              value={data?.[s.key]}
              label={s.label}
              icon={s.icon}
              iconBg={s.iconBg}
              iconColor={s.iconColor}
            />
          ))
      }
    </div>
  );
}
