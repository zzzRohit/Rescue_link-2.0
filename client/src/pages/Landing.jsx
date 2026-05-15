import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { BellRing, ClipboardList, HeartPulse, MapPin } from 'lucide-react';
import { emergencyCategories } from '../constants/emergencyCategories';
import { api } from '../services/api';

export default function Landing() {
  const [stats, setStats] = useState({ resolved: 0, active: 0, cities: 0 });
  useEffect(() => { api.get('/api/incidents/stats').then((res) => setStats(res.data)).catch(() => {}); }, []);
  const steps = [
    ['Report', ClipboardList],
    ['AI Analyzes', HeartPulse],
    ['Rescuer Assigned', BellRing],
    ['Animal Saved', MapPin]
  ];
  const actionCards = [
    ['/chat', '🩹', 'Get first-aid help', 'Chat with our AI advisor about the animal you found'],
    ['/rescuer', '📞', 'Find a rescuer', 'Get real Karnataka NGO contacts who can help right now'],
    ['/report/quick', '📍', 'Quick report', 'Spotted something? Log it in 2 minutes and move on']
  ];
  return (
    <div className="space-y-16">
      <section className="py-8">
        <div>
          <h1 className="max-w-2xl text-5xl font-medium tracking-normal text-gray-950">Wildlife emergency? Act fast.</h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-gray-600">Choose the fastest path for the situation: guidance, a phone number, or a quick report.</p>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {actionCards.map(([to, icon, title, text]) => (
            <Link key={to} to={to} className="rounded-2xl border border-gray-100 bg-white p-6 transition hover:border-green-300 hover:bg-green-50">
              <div className="mb-2 text-2xl">{icon}</div>
              <h3 className="font-medium text-gray-950">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-500">{text}</p>
            </Link>
          ))}
        </div>
      </section>

      <section id="how">
        <div className="grid gap-4 sm:grid-cols-4">{steps.map(([label, Icon]) => <div key={label} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"><Icon className="h-5 w-5 text-green-600" /><p className="mt-4 text-sm font-medium">{label}</p></div>)}</div>
      </section>

      <section>
        <h2 className="text-2xl font-medium">Emergency categories</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{emergencyCategories.map((cat) => <div key={cat.id} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm text-sm">{cat.label}</div>)}</div>
      </section>

      <section className="grid gap-3 rounded-xl bg-green-900 p-6 text-green-50 sm:grid-cols-3">
        <p><b>{stats.resolved}</b> incidents resolved</p>
        <p><b>{stats.active}</b> active incidents</p>
        <p><b>{stats.cities}</b> cities covered</p>
      </section>

      <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-medium">Found an injured animal right now?</h2>
        <p className="mt-2 text-sm text-gray-500">Use first-aid chat for immediate guidance or quick report to alert rescuers fast.</p>
      </section>
    </div>
  );
}
