import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';

const input = 'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-200';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', role: 'citizen' });
  const [error, setError] = useState('');
  const submit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(form);
      navigate(user.role === 'rescuer' ? '/rescuer/dashboard' : '/citizen/incidents');
    } catch (err) {
      if (err.response?.status === 403 && err.response?.data?.error === 'pending_verification') {
        navigate('/rescuer/pending-verification', { state: { rescuerId: err.response.data.rescuerId } });
        return;
      }
      setError(err.response?.data?.message || 'Invalid email or password');
    }
  };
  return (
    <form onSubmit={submit} className="mx-auto max-w-md rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <h1 className="text-2xl font-medium">Login</h1>
      <div className="mt-5 space-y-3">
        <div className="flex gap-2">
          {['citizen', 'rescuer'].map((role) => (
            <Button key={role} type="button" variant={form.role === role ? 'primary' : 'secondary'} onClick={() => setForm({ ...form, role })}>
              {role}
            </Button>
          ))}
        </div>
        <input className={input} placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className={input} type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
      </div>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      <Button className="mt-5 w-full">Login</Button>
      <p className="mt-4 text-center text-sm text-gray-500">New here? <Link className="text-green-800" to="/register">Register</Link></p>
    </form>
  );
}
