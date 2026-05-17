import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Baby,
  Bandage,
  BellRing,
  Box,
  Car,
  ClipboardList,
  Droplet,
  HeartPulse,
  Home,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Upload
} from 'lucide-react';
import { emergencyCategories } from '../constants/emergencyCategories';

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
    text: 'Find animal rescuers, NGOs, and veterinary contacts.',
    Icon: Phone
  }
];

const workflow = [
  ['Report', 'Submit location, photo, and situation details.', ClipboardList],
  ['Triage', 'The case is structured for quick rescuer review.', HeartPulse],
  ['Notify', 'Verified responders receive useful context.', BellRing],
  ['Resolve', 'The incident stays trackable until help arrives.', ShieldCheck]
];

export default function Landing() {
  return (
    <div className="space-y-24">
      <section className="grid min-h-[680px] items-center gap-14 py-16 lg:grid-cols-[minmax(0,1fr)_460px] lg:py-20">
        <div>
          <p className="inline-flex items-center rounded-full border border-green-200 bg-white px-3 py-1 text-sm font-medium text-green-800">
            Animal rescue response platform
          </p>

          <h1 className="mt-7 max-w-4xl text-5xl font-semibold leading-[1.02] tracking-normal text-slate-950 sm:text-6xl lg:text-[4rem]">
            Report animal emergencies quickly and safely.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            RescueLink helps citizens report injured, stranded, or distressed animals, receive first-aid guidance, and connect with verified rescuers nearby.
          </p>

          <div className="mt-9 grid max-w-2xl grid-cols-3 gap-3">
            {actions.map(({ to, title, Icon, primary }) => (
              <Link
                key={to}
                to={to}
                className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border px-3 text-center text-sm font-semibold transition hover:-translate-y-0.5 ${
                  primary
                    ? 'border-green-700 bg-green-700 text-white hover:bg-green-800'
                    : 'border-slate-200 bg-white text-slate-900 hover:border-green-200 hover:bg-green-50'
                }`}
              >
                <Icon className="hidden h-4 w-4 sm:block" />
                {title}
              </Link>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,.10)]">
            <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-red-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
              <span className="ml-3 text-xs font-medium text-slate-400">rescuelink.app/report/quick</span>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <p className="text-sm font-medium text-green-700">Quick report</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-950">Tell rescuers what happened</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">Only the essentials needed for first response.</p>
              </div>

              <div className="space-y-4">
                <MockField label="Animal type" value="Bird / Kite" />
                <MockField label="Emergency type" value="Injured or unable to fly" />
                <MockField label="Location" value="Market Road, Bengaluru" icon={<MapPin className="h-4 w-4 text-green-700" />} />

                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500">
                      <Upload className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-slate-900">Add a photo</p>
                      <p className="mt-0.5 text-xs text-slate-500">Helps rescuers verify the case faster.</p>
                    </div>
                  </div>
                </div>

                <button className="w-full rounded-lg bg-green-700 px-4 py-3 text-sm font-semibold text-white">
                  Submit quick report
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {actions.map(({ to, title, text, Icon, primary }) => (
          <Link
            key={to}
            to={to}
            className={`group flex min-h-56 flex-col justify-between rounded-2xl border p-6 transition hover:-translate-y-0.5 ${
              primary
                ? 'border-green-700 bg-green-700 text-white'
                : 'border-slate-200 bg-white text-slate-950 hover:border-green-200'
            }`}
          >
            <div>
              <Icon className={`h-6 w-6 ${primary ? 'text-green-50' : 'text-green-700'}`} />
              <h3 className="mt-8 text-xl font-semibold">{title}</h3>
              <p className={`mt-3 text-sm leading-6 ${primary ? 'text-green-50/85' : 'text-slate-500'}`}>{text}</p>
            </div>
            <span className={`mt-6 inline-flex items-center gap-2 text-sm font-semibold ${primary ? 'text-white' : 'text-green-700'}`}>
              Open
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </section>

      <section className="border-t border-slate-200 pt-16">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold text-green-700">How it works</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-950">A clear response workflow</h2>
          </div>
          <Link to="/report" className="inline-flex items-center gap-2 text-sm font-semibold text-green-700 hover:text-green-900">
            Full report
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {workflow.map(([title, text, Icon], index) => (
            <div key={title} className="border-t border-slate-200 pt-5">
              <div className="flex items-center justify-between">
                <Icon className="h-5 w-5 text-green-700" />
                <span className="text-xs font-semibold text-slate-400">0{index + 1}</span>
              </div>
              <h3 className="mt-5 font-semibold text-slate-950">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-slate-200 pt-16">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold text-green-700">Emergency types</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-950">Choose what best matches the situation</h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-slate-500">
            Categories keep reports consistent, so rescuers can understand urgency faster.
          </p>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {emergencyCategories.map((cat) => {
            const Icon = categoryIcons[cat.icon] || AlertTriangle;
            return (
              <Link
                key={cat.id}
                to="/report/quick"
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 text-sm font-semibold text-slate-800 transition hover:border-green-200 hover:bg-green-50"
              >
                <span className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-green-700" />
                  {cat.label}
                </span>
                <ArrowRight className="h-4 w-4 text-slate-300" />
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function MockField({ label, value, icon }) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</label>
      <div className="mt-2 flex min-h-12 items-center justify-between rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-900">
        {value}
        {icon}
      </div>
    </div>
  );
}
