import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { Users, Dumbbell, Calendar, CreditCard, TrendingUp } from 'lucide-react';

const fetchStats = async () => {
  const res = await api.get('/dashboard/stats');
  return res.data.data;
};

const COLORS = ['#f97316', '#3b82f6', '#10b981'];

function StatCard({ icon: Icon, label, value, sub }: {
  icon: React.ElementType; label: string; value: string | number; sub?: string;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 flex items-start gap-4">
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold mt-0.5">{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export function DashboardPage() {
  const { data, isLoading, error } = useQuery({ queryKey: ['dashboard-stats'], queryFn: fetchStats });

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error) return (
    <div className="bg-destructive/10 text-destructive rounded-lg p-4">Failed to load dashboard stats.</div>
  );

  const pieData = [
    { name: 'Free',  value: parseInt(data.subscriptions.free  || 0) },
    { name: 'Basic', value: parseInt(data.subscriptions.basic || 0) },
    { name: 'Pro',   value: parseInt(data.subscriptions.pro   || 0) },
  ].filter(d => d.value > 0);

  const growthData = data.userGrowth.map((d: any) => ({
    date: new Date(d.date).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
    users: parseInt(d.count),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Welcome back! Here's what's happening.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users}      label="Total Users"     value={data.users.total}           sub={`+${data.users.new_this_month} this month`} />
        <StatCard icon={Dumbbell}   label="Active Trainers" value={data.trainers.total} />
        <StatCard icon={Calendar}   label="Classes Today"   value={data.classes.today}          sub={`${data.classes.total} total`} />
        <StatCard icon={CreditCard} label="Pro Subscribers" value={data.subscriptions.pro}      sub={`${data.subscriptions.active} active`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-primary" />
            <h2 className="font-semibold">User Growth (Last 7 days)</h2>
          </div>
          {growthData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} allowDecimals={false} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} labelStyle={{ color: 'hsl(var(--foreground))' }} />
                <Line type="monotone" dataKey="users" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: 'hsl(var(--primary))', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-muted-foreground text-sm">No data yet</div>
          )}
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-4 h-4 text-primary" />
            <h2 className="font-semibold">Subscriptions</h2>
          </div>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-muted-foreground text-sm">No data yet</div>
          )}
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-5">
        <h2 className="font-semibold mb-4">Recent Bookings</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left pb-3 font-medium">User</th>
                <th className="text-left pb-3 font-medium">Class</th>
                <th className="text-left pb-3 font-medium">Status</th>
                <th className="text-left pb-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.recentBookings.map((b: any) => (
                <tr key={b.id}>
                  <td className="py-3">
                    <div>
                      <p className="font-medium">{b.user_name}</p>
                      <p className="text-xs text-muted-foreground">{b.user_email}</p>
                    </div>
                  </td>
                  <td className="py-3">{b.class_title}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      b.status === 'confirmed' ? 'bg-green-500/10 text-green-500' :
                      b.status === 'cancelled' ? 'bg-red-500/10 text-red-500' :
                      'bg-yellow-500/10 text-yellow-500'
                    }`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="py-3 text-muted-foreground">
                    {new Date(b.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {data.recentBookings.length === 0 && (
                <tr><td colSpan={4} className="py-8 text-center text-muted-foreground">No bookings yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
