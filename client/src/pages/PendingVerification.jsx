import { Link, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export default function PendingVerification() {
  const { state } = useLocation();
  const rescuerId = state?.rescuerId;

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="bg-white rounded-xl border border-gray-100 p-8 max-w-md text-center shadow-sm">
        <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-4 text-xl">!</div>
        <h1 className="font-medium text-lg mb-2">Account pending verification</h1>
        <p className="text-sm text-gray-500 mb-4">
          Your rescuer account has been created. An admin will review and verify your account shortly.
          You will be able to access the dashboard once approved.
        </p>
        {rescuerId && <p className="text-xs text-gray-400 mb-5">Rescuer ID: {rescuerId}</p>}
        <Link to="/"><Button variant="secondary">Back home</Button></Link>
      </div>
    </div>
  );
}
