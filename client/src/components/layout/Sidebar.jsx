import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

export const Sidebar = ({ available, onToggle }) => (
  <aside className="border-r border-gray-100 bg-white p-5 md:min-h-screen md:w-64">
    <Link to="/" className="text-lg font-medium text-green-900">RescueLink</Link>
    <nav className="mt-8 grid gap-2 text-sm text-gray-600">
      <Link to="/rescuer/dashboard">Live incidents</Link>
      <Link to="/citizen/incidents">Citizen view</Link>
    </nav>
    <div className="mt-8">
      <p className="mb-2 text-sm text-gray-500">Availability</p>
      <Button variant={available ? 'primary' : 'secondary'} onClick={onToggle}>{available ? 'Online' : 'Offline'}</Button>
    </div>
  </aside>
);
