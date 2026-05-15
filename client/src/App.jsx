import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import Landing from './pages/Landing';
import ReportIncident from './pages/ReportIncident';
import QuickReport from './pages/QuickReport';
import IncidentConfirmation from './pages/IncidentConfirmation';
import CitizenDashboard from './pages/CitizenDashboard';
import RescuerDashboard from './pages/RescuerDashboard';
import IncidentDetailPage from './pages/IncidentDetailPage';
import Login from './pages/Login';
import Register from './pages/Register';
import PendingVerification from './pages/PendingVerification';
import FindRescuer from './pages/FindRescuer';
import FirstAidChat from './pages/FirstAidChat';
import NotFound from './pages/NotFound';

const ProtectedRoute = ({ role, children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
};

export default function App() {
  return (
    <Routes>
      <Route path="/rescuer/dashboard" element={<ProtectedRoute role="rescuer"><RescuerDashboard /></ProtectedRoute>} />
      <Route path="*" element={<Shell />} />
    </Routes>
  );
}

function Shell() {
  return (
    <>
      <Navbar />
      <main className="mx-auto min-h-[calc(100vh-137px)] max-w-6xl px-4 py-8 pb-24 sm:pb-8">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/chat" element={<FirstAidChat />} />
          <Route path="/report" element={<ReportIncident />} />
          <Route path="/report/quick" element={<QuickReport />} />
          <Route path="/rescuer" element={<FindRescuer />} />
          <Route path="/rescuers" element={<FindRescuer />} />
          <Route path="/incident/:id/confirmation" element={<IncidentConfirmation />} />
          <Route path="/citizen/incidents" element={<CitizenDashboard />} />
          <Route path="/incident/:id" element={<IncidentDetailPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/rescuer/pending-verification" element={<PendingVerification />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
