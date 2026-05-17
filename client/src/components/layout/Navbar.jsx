import { Link } from 'react-router-dom';
import { Home, Leaf, MapPin, MessageCircle, PawPrint } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const links = [
    ['/', 'Home'],
    ['/chat', 'First-aid chat'],
    ['/rescuer', 'Find support'],
    ['/report/quick', 'Quick report'],
    ['/report', 'Full report']
  ];
  return (
    <header className="border-b border-gray-100 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-center gap-2 text-lg font-semibold text-green-900">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50 text-green-800">
            <Leaf className="h-4 w-4" />
          </span>
          RescueLink
        </Link>
        <div className="hidden items-center gap-1 text-sm text-gray-600 sm:flex">
          {links.map(([to, label]) => (
            <Link key={to} to={to} className="rounded-lg px-3 py-2 transition hover:bg-green-50 hover:text-green-900">
              {label}
            </Link>
          ))}
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
