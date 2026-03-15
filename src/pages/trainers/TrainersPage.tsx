import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTrainersApi, deleteTrainerApi } from '@/api/trainers.api';
import { Trainer } from '@/types';
import { Trash2, Star, Search } from 'lucide-react';

export function TrainersPage() {
  const [page, setPage]     = useState(1);
  const [search, setSearch] = useState('');
  const queryClient         = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['trainers', page],
    queryFn: () => getTrainersApi(page, 20),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteTrainerApi(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['trainers'] }),
  });

  const trainers: Trainer[] = data?.data?.trainers ?? [];
  const total: number       = data?.data?.total ?? 0;
  const totalPages          = Math.ceil(total / 20);

  const filtered = trainers.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Trainers</h1>
        <p className="text-muted-foreground text-sm mt-1">{total} total trainers</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Trainer</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Specialization</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Rating</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Joined</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr><td colSpan={5} className="py-12 text-center">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                </td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="py-12 text-center text-muted-foreground">No trainers found</td></tr>
              ) : filtered.map((trainer) => (
                <tr key={trainer.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 font-bold text-xs shrink-0">
                        {trainer.name?.[0]?.toUpperCase() ?? '?'}
                      </div>
                      <div>
                        <p className="font-medium">{trainer.name}</p>
                        <p className="text-xs text-muted-foreground">{trainer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {trainer.specialization?.length > 0 ? trainer.specialization.map((s) => (
                        <span key={s} className="px-2 py-0.5 rounded-full text-xs bg-blue-500/10 text-blue-500">
                          {s}
                        </span>
                      )) : <span className="text-muted-foreground">—</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                      <span>{parseFloat(trainer.rating as any || '0').toFixed(1)}</span>
                      <span className="text-muted-foreground text-xs">({trainer.total_reviews})</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(trainer.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end">
                      <button
                        onClick={() => {
                          if (confirm(`Remove ${trainer.name} as trainer?`)) deleteMutation.mutate(trainer.id);
                        }}
                        className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
                        title="Remove trainer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-border flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="px-3 py-1.5 rounded-lg border border-border hover:bg-accent disabled:opacity-50 transition-colors">
                Previous
              </button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="px-3 py-1.5 rounded-lg border border-border hover:bg-accent disabled:opacity-50 transition-colors">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
