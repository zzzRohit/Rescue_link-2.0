import { Link, useLocation } from 'react-router-dom';
import { CheckCircle2, Clock3, ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function PendingVerification() {
  const { state } = useLocation();
  const rescuerId = state?.rescuerId;

  return (
    <div className="mx-auto flex min-h-[62vh] max-w-3xl items-center justify-center">
      <div className="w-full rounded-xl border border-amber-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <div className="mx-auto flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-amber-200 bg-amber-50 text-amber-700 sm:mx-0">
            <Clock3 className="h-7 w-7" />
          </div>
          <div className="text-center sm:text-left">
            <p className="text-sm font-medium text-amber-700">Profile under admin review</p>
            <h1 className="mt-2 text-2xl font-medium text-gray-950">Your rescuer account is being verified</h1>
            <p className="mt-3 text-sm leading-6 text-gray-500">
              Your registration was received successfully. An admin is checking your profile details before enabling dashboard access and live incident assignments.
            </p>

            <div className="mt-6 grid gap-3 text-left sm:grid-cols-3">
              <div className="rounded-lg border border-green-100 bg-green-50 p-3">
                <CheckCircle2 className="h-4 w-4 text-green-700" />
                <p className="mt-2 text-xs font-medium text-green-900">Account created</p>
              </div>
              <div className="rounded-lg border border-amber-100 bg-amber-50 p-3">
                <Clock3 className="h-4 w-4 text-amber-700" />
                <p className="mt-2 text-xs font-medium text-amber-900">Admin checking profile</p>
              </div>
              <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                <ShieldCheck className="h-4 w-4 text-gray-500" />
                <p className="mt-2 text-xs font-medium text-gray-700">Dashboard unlocks after approval</p>
              </div>
            </div>

            {rescuerId && <p className="mt-5 text-xs text-gray-400">Reference ID: {rescuerId}</p>}
            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <Link to="/">
                <Button variant="secondary" className="w-full sm:w-auto">Back home</Button>
              </Link>
              <Link to="/login">
                <Button className="w-full sm:w-auto">Try login after approval</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
