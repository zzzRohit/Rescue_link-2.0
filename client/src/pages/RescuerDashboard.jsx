import { useMemo, useState } from 'react';
import { Sidebar } from '../components/layout/Sidebar';
import { IncidentCard } from '../components/incident/IncidentCard';
import { IncidentMap } from '../components/map/IncidentMap';
import { NotificationToast } from '../components/rescuer/NotificationToast';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { useIncidents } from '../hooks/useIncidents';
import { useSocket } from '../hooks/useSocket';

const severityRank = { critical: 0, moderate: 1, low: 2 };

export default function RescuerDashboard() {
  const { user, setUser } = useAuth();
  const { incidents, loading, refresh } = useIncidents();
  const [filter, setFilter] = useState('all');
  const [toast, setToast] = useState(null);
  useSocket({ newIncident: (payload) => { setToast(payload); refresh(); } });

  const filtered = useMemo(() => incidents
    .filter((incident) => filter === 'all' || incident.status === filter)
    .sort((a, b) => (severityRank[a.aiAnalysis?.severity] ?? 9) - (severityRank[b.aiAnalysis?.severity] ?? 9)), [incidents, filter]);

  const toggle = async () => {
    const { data } = await api.patch('/api/rescuers/availability', { available: !user.available });
    setUser({ ...user, available: data.available });
  };

  const stats = {
    rescued: incidents.filter((i) => i.status === 'rescued' || i.status === 'closed').length,
    active: incidents.filter((i) => !['rescued', 'closed'].includes(i.status)).length,
    completion: incidents.length ? Math.round((incidents.filter((i) => ['rescued', 'closed'].includes(i.status)).length / incidents.length) * 100) : 0
  };

  return (
    <div className="md:flex">
      <Sidebar available={user.available} onToggle={toggle} />
      <main className="min-h-screen flex-1 bg-[#f8faf7] p-4 md:p-8">
        <NotificationToast incident={toast} onClose={() => setToast(null)} />
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-medium">Rescuer dashboard</h1>
          {user.verified && <Badge className="bg-green-100 text-green-700">Verified rescuer</Badge>}
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"><b>{stats.rescued}</b><p className="text-sm text-gray-500">Today's rescues</p></div>
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"><b>{stats.active}</b><p className="text-sm text-gray-500">Active incidents</p></div>
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"><b>{stats.completion}%</b><p className="text-sm text-gray-500">Completion rate</p></div>
        </div>
        <div className="mt-6"><IncidentMap incidents={filtered} /></div>
        <div className="mt-6 flex flex-wrap gap-2">{['all', 'pending', 'accepted', 'on_the_way', 'rescued'].map((item) => <Button key={item} variant={filter === item ? 'primary' : 'secondary'} onClick={() => setFilter(item)}>{item.replaceAll('_', ' ')}</Button>)}</div>
        <div className="mt-6 grid gap-4">{!loading && filtered.map((incident) => <IncidentCard key={incident._id} incident={incident} />)}</div>
      </main>
    </div>
  );
}
