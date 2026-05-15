import { Link } from 'react-router-dom';
import { Home, MapPin, MessageCircle, PawPrint } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const links = [
    ['/', 'Home'],
    ['/chat', 'First-aid chat'],
    ['/rescuer', 'Find a rescuer'],
    ['/report/quick', 'Quick report'],
    ['/report', 'Full report']
  ];
  return (
    <header className="border-b border-gray-100 bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="text-lg font-medium text-green-900">RescueLink</Link>
        <div className="hidden items-center gap-6 text-sm text-gray-600 sm:flex">
          {links.map(([to, label]) => <Link key={to} to={to}>{label}</Link>)}
        </div>
        <div className="flex items-center gap-2">
          {user ? <Button variant="secondary" onClick={logout}>Logout</Button> : <Link to="/login"><Button variant="secondary">Login</Button></Link>}
        </div>
      </nav>
      <nav className="fixed bottom-0 left-0 right-0 z-[1000] grid grid-cols-4 border-t border-gray-100 bg-white px-2 py-2 text-[11px] text-gray-500 shadow-[0_-4px_18px_rgba(0,0,0,.04)] sm:hidden">
        <Link to="/" className="flex flex-col items-center gap-1"><Home className="h-5 w-5" />Home</Link>
        <Link to="/chat" className="flex flex-col items-center gap-1"><MessageCircle className="h-5 w-5" />Chat</Link>
        <Link to="/rescuer" className="flex flex-col items-center gap-1"><PawPrint className="h-5 w-5" />Rescuer</Link>
        <Link to="/report/quick" className="flex flex-col items-center gap-1"><MapPin className="h-5 w-5" />Report</Link>
      </nav>
    </header>
  );
};
