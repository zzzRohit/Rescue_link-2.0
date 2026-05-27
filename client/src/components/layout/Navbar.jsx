import { Link } from "react-router-dom";
import { ClipboardList, Home, Leaf, MapPin, MessageCircle, PawPrint } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../ui/Button";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const links = [
    ["/", "Home"],
    ["/chat", "First-aid chat"],
    ["/rescuer", "Find support"],
    ["/report/quick", "Quick report"],
    ["/report", "Full report"],
    ["/track", "Track"],
  ];
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-semibold text-slate-950"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-700 text-white">
            <Leaf className="h-4 w-4" />
          </span>
          RescueLink
        </Link>
        <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 sm:flex">
          {links.map(([to, label]) => (
            <Link key={to} to={to} className="transition hover:text-green-800">
              {label}
            </Link>
          ))}
          {user?.role === "citizen" && (
            <Link to="/citizen/incidents" className="transition hover:text-green-800">
              Tracker
            </Link>
          )}
          {user?.role === "rescuer" && (
            <Link to="/rescuer/dashboard" className="transition hover:text-green-800">
              Dashboard
            </Link>
          )}
        </div>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              {user.role === "citizen" && (
                <Link to="/citizen/incidents" className="sm:hidden">
                  <Button variant="secondary">Tracker</Button>
                </Link>
              )}
              {user.role === "rescuer" && (
                <Link to="/rescuer/dashboard" className="sm:hidden">
                  <Button variant="secondary">Dashboard</Button>
                </Link>
              )}
              <Button variant="secondary" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <Link to="/login">
              <Button variant="secondary">Login</Button>
            </Link>
          )}
        </div>
      </nav>
      <nav className={`fixed bottom-0 left-0 right-0 z-[1000] grid ${user?.role === "citizen" ? "grid-cols-5" : "grid-cols-4"} border-t border-slate-200 bg-white px-2 py-2 text-[11px] font-medium text-slate-500 sm:hidden`}>
        <Link to="/" className="flex flex-col items-center gap-1">
          <Home className="h-5 w-5" />
          Home
        </Link>
        <Link to="/chat" className="flex flex-col items-center gap-1">
          <MessageCircle className="h-5 w-5" />
          Chat
        </Link>
        <Link to="/rescuer" className="flex flex-col items-center gap-1">
          <PawPrint className="h-5 w-5" />
          Rescuer
        </Link>
        <Link to="/report/quick" className="flex flex-col items-center gap-1">
          <MapPin className="h-5 w-5" />
          Report
        </Link>
        {user?.role === "citizen" && (
          <Link to="/citizen/incidents" className="flex flex-col items-center gap-1">
            <ClipboardList className="h-5 w-5" />
            Tracker
          </Link>
        )}
      </nav>
    </header>
  );
};
