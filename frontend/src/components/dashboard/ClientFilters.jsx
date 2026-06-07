import { Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function ClientFilters({ search, onSearchChange, stage, onStageChange, gender, onGenderChange, sortBy, onSortChange }) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#9A9088' }} />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search clients..."
          className="pl-9 pr-4 py-2 rounded-xl text-sm font-sans outline-none w-60 transition-all"
          style={{
            border: '1px solid #E8E1D6',
            background: '#FFFFFF',
            color: '#2C2420',
          }}
          onFocus={(e) => {
            e.target.style.boxShadow = '0 0 0 2px #C8973F';
            e.target.style.borderColor = 'transparent';
          }}
          onBlur={(e) => {
            e.target.style.boxShadow = 'none';
            e.target.style.borderColor = '#E8E1D6';
          }}
        />
      </div>

      {/* Stage Filter */}
      <Select value={stage} onValueChange={onStageChange}>
        <SelectTrigger
          className="w-44 rounded-xl text-sm font-sans h-10"
          style={{ border: '1px solid #E8E1D6', background: '#FFFFFF', color: '#2C2420' }}
        >
          <SelectValue placeholder="All Stages" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Stages</SelectItem>
          <SelectItem value="Active Search">Active Search</SelectItem>
          <SelectItem value="Shortlisted">Shortlisted</SelectItem>
          <SelectItem value="In Conversation">In Conversation</SelectItem>
          <SelectItem value="Matched">Matched</SelectItem>
          <SelectItem value="On Hold">On Hold</SelectItem>
        </SelectContent>
      </Select>

      {/* Gender Filter */}
      <Select value={gender} onValueChange={onGenderChange}>
        <SelectTrigger
          className="w-36 rounded-xl text-sm font-sans h-10"
          style={{ border: '1px solid #E8E1D6', background: '#FFFFFF', color: '#2C2420' }}
        >
          <SelectValue placeholder="All Genders" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Genders</SelectItem>
          <SelectItem value="Male">Male</SelectItem>
          <SelectItem value="Female">Female</SelectItem>
          <SelectItem value="Other">Other</SelectItem>
        </SelectContent>
      </Select>

      {/* Sort */}
      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger
          className="w-40 rounded-xl text-sm font-sans h-10"
          style={{ border: '1px solid #E8E1D6', background: '#FFFFFF', color: '#2C2420' }}
        >
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="lastActivity">Last Activity</SelectItem>
          <SelectItem value="name">Name (A–Z)</SelectItem>
          <SelectItem value="age">Age</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
