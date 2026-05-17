import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Baby,
  Bandage,
  BellRing,
  Box,
  Car,
  CheckCircle2,
  ClipboardList,
  Droplet,
  HeartPulse,
  Home,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck
} from 'lucide-react';
import { emergencyCategories } from '../constants/emergencyCategories';
import { api } from '../services/api';

const categoryIcons = {
  Bandage,
  Box,
  Baby,
  Car,
  Droplet,
  Home,
  AlertTriangle
};

const actions = [
  {
    to: '/report/quick',
    title: 'Quick report',
    text: 'Send location and emergency type in minutes.',
    Icon: MapPin,
    primary: true
  },
  {
    to: '/chat',
    title: 'First-aid chat',
    text: 'Get immediate guidance before help arrives.',
    Icon: MessageCircle
  },
  {
    to: '/rescuer',
    title: 'Find rescue support',
    text: 'View animal rescuers, NGO volunteers, veterinary contacts, and specialists.',
    Icon: Phone
  }
];

const workflow = [
  ['Report', 'Citizen submits location, photo, and situation.', ClipboardList],
  ['AI triage', 'The case is summarized for quick review.', HeartPulse],
  ['Notify', 'Verified rescuers receive city-based alerts.', BellRing],
  ['Resolve', 'Status is tracked until the animal is helped.', ShieldCheck]
];

export default function Landing() {
  const [stats, setStats] = useState({ resolved: 0, active: 0, cities: 0 });

  useEffect(() => {
    api.get('/api/incidents/stats').then((res) => setStats(res.data)).catch(() => {});
  }, []);

  return (
    <div className="space-y-12">
      <section className="grid gap-8 py-6 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:py-12">
        <div>
          <p className="inline-flex items-center rounded-full border border-green-100 bg-green-50 px-3 py-1 text-xs font-medium text-green-800">
            Animal rescue response platform
          </p>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight tracking-normal text-gray-950 sm:text-5xl">
            Report animal emergencies quickly and safely.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-gray-600">
            RescueLink helps citizens report injured, stranded, or distressed animals, receive first-aid guidance, and connect with verified rescuers nearby.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/report/quick"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-700 px-5 py-3 text-sm font-medium text-white transition hover:bg-green-800"
            >
              Start quick report
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/chat"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-800 transition hover:bg-gray-50"
            >
              Open first-aid chat
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-5">
            <div>
              <p className="text-sm font-medium text-gray-500">Current network</p>
              <h2 className="mt-1 text-xl font-semibold text-gray-950">Live response summary</h2>
            </div>
            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-800">Active</span>
          </div>

          <div className="grid grid-cols-3 gap-3 py-5">
            <Stat value={stats.resolved} label="Resolved" />
            <Stat value={stats.active} label="Active" />
            <Stat value={stats.cities} label="Cities" />
          </div>

          <div className="space-y-3 border-t border-gray-100 pt-5">
            {['Quick animal emergency logging', 'AI-assisted rescue triage', 'Verified rescuer matching'].map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm text-gray-600">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-green-700" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {actions.map(({ to, title, text, Icon, primary }) => (
          <Link
            key={to}
            to={to}
            className={`group rounded-2xl border p-5 transition ${
              primary
                ? 'border-green-700 bg-green-700 text-white hover:bg-green-800'
                : 'border-gray-100 bg-white text-gray-950 hover:border-green-200 hover:bg-green-50'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <Icon className={`h-6 w-6 ${primary ? 'text-green-50' : 'text-green-700'}`} />
              <ArrowRight className={`h-5 w-5 transition group-hover:translate-x-1 ${primary ? 'text-green-100' : 'text-gray-300'}`} />
            </div>
            <h3 className="mt-5 text-lg font-semibold">{title}</h3>
            <p className={`mt-2 text-sm leading-6 ${primary ? 'text-green-50/80' : 'text-gray-500'}`}>{text}</p>
          </Link>
        ))}
      </section>

      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-green-700">How it works</p>
            <h2 className="mt-2 text-2xl font-semibold text-gray-950">A simple rescue workflow</h2>
          </div>
          <Link to="/report" className="inline-flex items-center gap-2 text-sm font-medium text-green-700 hover:text-green-900">
            Full report
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {workflow.map(([title, text, Icon], index) => (
            <div key={title} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <div className="flex items-center justify-between">
                <Icon className="h-5 w-5 text-green-700" />
                <span className="text-xs font-medium text-gray-400">0{index + 1}</span>
              </div>
              <h3 className="mt-5 font-medium text-gray-950">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-500">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-green-700">Emergency types</p>
            <h2 className="mt-2 text-2xl font-semibold text-gray-950">Choose what best matches the situation</h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-gray-500">
            Categories keep reports consistent, so rescuers can understand urgency faster.
          </p>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {emergencyCategories.map((cat) => {
            const Icon = categoryIcons[cat.icon] || AlertTriangle;
            return (
              <Link
                key={cat.id}
                to="/report/quick"
                className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 text-sm font-medium text-gray-800 shadow-sm transition hover:border-green-200 hover:bg-green-50"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-700">
                  <Icon className="h-5 w-5" />
                </span>
                {cat.label}
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div className="rounded-xl bg-gray-50 p-4 text-center">
      <p className="text-2xl font-semibold text-gray-950">{value}</p>
      <p className="mt-1 text-xs font-medium text-gray-500">{label}</p>
    </div>
  );
}
