import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { MessageSquare } from 'lucide-react';
import { getClientNotes, addClientNote } from '../../services/api.js';
import AddNoteForm from './AddNoteForm.jsx';
import NoteItem from './NoteItem.jsx';
import NoteItemSkeleton from '../skeletons/NoteItemSkeleton.jsx';
import EmptyState from '../ui/EmptyState.jsx';

export default function NotesActivity({ clientId }) {
  const queryClient = useQueryClient();

  const { data: notes, isLoading } = useQuery({
    queryKey: ['notes', clientId],
    queryFn: () => getClientNotes(clientId).then(r => r.data?.notes || r.data || []),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (note) => addClientNote(clientId, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', clientId] });
      toast.success('Note added ✓');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to add note.'),
  });

  return (
    <div className="flex flex-col h-full">
      <AddNoteForm onSubmit={mutate} isSubmitting={isPending} />

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          [...Array(3)].map((_, i) => <NoteItemSkeleton key={i} />)
        ) : !notes || notes.length === 0 ? (
          <EmptyState icon={MessageSquare} title="No notes yet" description="Add a note to keep track of client interactions." />
        ) : (
          <div className="divide-y" style={{ borderColor: '#F0E8DC' }}>
            {notes.map((note, i) => (
              <NoteItem key={note._id || i} note={note} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
