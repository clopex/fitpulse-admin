import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { sendNotificationApi } from '@/api/notifications.api';
import { Bell, Send, CheckCircle } from 'lucide-react';

const NOTIFICATION_TYPES = ['system', 'booking', 'payment', 'reminder'];

export function NotificationsPage() {
  const [form, setForm] = useState({
    type: 'system',
    title: '',
    body: '',
    target: 'all', // 'all' | 'single'
    user_id: '',
  });
  const [success, setSuccess] = useState(false);

  const sendMutation = useMutation({
    mutationFn: sendNotificationApi,
    onSuccess: () => {
      setSuccess(true);
      setForm({ type: 'system', title: '', body: '', target: 'all', user_id: '' });
      setTimeout(() => setSuccess(false), 3000);
    },
  });

  const handleSend = () => {
    if (!form.title.trim()) return;

    if (form.target === 'single') {
      if (!form.user_id.trim()) return;
      sendMutation.mutate({ user_id: form.user_id, type: form.type, title: form.title, body: form.body });
    } else {
      sendMutation.mutate({ type: form.type, title: form.title, body: form.body });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Notifications</h1>
        <p className="text-muted-foreground text-sm mt-1">Send push notifications to users</p>
      </div>

      <div className="max-w-2xl">
        <div className="bg-card border border-border rounded-xl p-6 space-y-5">
          <div className="flex items-center gap-2 mb-2">
            <Bell className="w-4 h-4 text-primary" />
            <h2 className="font-semibold">Send Notification</h2>
          </div>

          {success && (
            <div className="flex items-center gap-2 bg-green-500/10 text-green-500 rounded-lg p-3 text-sm">
              <CheckCircle className="w-4 h-4" />
              Notification sent successfully!
            </div>
          )}

          {sendMutation.isError && (
            <div className="bg-destructive/10 text-destructive rounded-lg p-3 text-sm">
              Failed to send notification. Please try again.
            </div>
          )}

          {/* Target */}
          <div>
            <label className="text-sm font-medium mb-1.5 block">Target</label>
            <div className="flex gap-3">
              {['single', 'all'].map((t) => (
                <button
                  key={t}
                  onClick={() => setForm(f => ({ ...f, target: t, user_id: t === 'single' ? f.user_id : '' }))}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    form.target === t
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-border hover:bg-accent'
                  }`}
                >
                  {t === 'all' ? 'All Users' : 'Single User'}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {form.target === 'all'
                ? 'This sends the notification to every active user.'
                : 'Use a single user UUID to send a targeted notification.'}
            </p>
          </div>

          {/* User ID (single only) */}
          {form.target === 'single' && (
            <div>
              <label className="text-sm font-medium mb-1.5 block">User ID</label>
              <input
                type="text"
                value={form.user_id}
                onChange={(e) => setForm(f => ({ ...f, user_id: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="UUID of the user"
              />
            </div>
          )}

          {/* Type */}
          <div>
            <label className="text-sm font-medium mb-1.5 block">Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm(f => ({ ...f, type: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {NOTIFICATION_TYPES.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="text-sm font-medium mb-1.5 block">Title <span className="text-destructive">*</span></label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Notification title"
            />
          </div>

          {/* Body */}
          <div>
            <label className="text-sm font-medium mb-1.5 block">Message</label>
            <textarea
              value={form.body}
              onChange={(e) => setForm(f => ({ ...f, body: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Notification message (optional)"
            />
          </div>

          <button
            onClick={handleSend}
            disabled={sendMutation.isPending || !form.title.trim()}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            {sendMutation.isPending ? 'Sending...' : 'Send Notification'}
          </button>
        </div>
      </div>
    </div>
  );
}
