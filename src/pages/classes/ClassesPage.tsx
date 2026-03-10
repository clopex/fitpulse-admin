import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getClassesApi, cancelClassApi, deleteClassApi } from '@/api/classes.api';
import { Class } from '@/types';
import { Trash2, XCircle, Search, Calendar, Clock, Users } from 'lucide-react';

export function ClassesPage() {
  const [page, setPage]     = useState(1);
  const [search, setSearch] = useState('');
  const queryClient         = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['classes', page],
    queryFn: () => getClassesApi(page, 20),
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => cancelClassApi(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['classes'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteClassApi(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['classes'] }),
  });

  const classes: Class[] = data?.data?.classes ?? [];
  const total: number    = data?.data?.total ?? 0;
  const totalPages       = Math.ceil(total / 20);

  const filtered = classes.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.trainer_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Classes</h1>
        <p className="text-muted-foreground text-sm mt-1">{total} total classes</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by title or trainer..."
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
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Class</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Trainer</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Schedule</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Capacity</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr><td colSpan={6} className="py-12 text-center">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                </td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="py-12 text-center text-muted-foreground">No classes found</td></tr>
              ) : filtered.map((c) => (
                <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium">{c.title}</p>
                    {c.location && <p className="text-xs text-muted-foreground">{c.location}</p>}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{c.trainer_name ?? '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(c.scheduled_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground mt-0.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{new Date(c.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {c.duration_min}min</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>{c.booked_count ?? 0}/{c.capacity}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      c.is_cancelled ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'
                    }`}>
                      {c.is_cancelled ? 'Cancelled' : 'Active'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      {!c.is_cancelled && (
                        <button
                          onClick={() => { if (confirm(`Cancel "${c.title}"?`)) cancelMutation.mutate(c.id); }}
                          className="p-1.5 rounded-lg hover:bg-yellow-500/10 transition-colors text-muted-foreground hover:text-yellow-500"
                          title="Cancel class"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => { if (confirm(`Delete "${c.title}"?`)) deleteMutation.mutate(c.id); }}
                        className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
                        title="Delete class"
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