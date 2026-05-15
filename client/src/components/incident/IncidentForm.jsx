import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { animals } from '../../constants/animals';
import { emergencyCategories } from '../../constants/emergencyCategories';
import { api } from '../../services/api';
import { useGeolocation } from '../../hooks/useGeolocation';
import { Button } from '../ui/Button';
import { ImageUploader } from './ImageUploader';

const inputClass = 'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-200';

export const IncidentForm = () => {
  const navigate = useNavigate();
  const geo = useGeolocation();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ animalType: '', emergencyCategory: '', description: '', images: [], location: {}, reportedBy: {} });

  const update = (patch) => setForm((current) => ({ ...current, ...patch }));
  const submit = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/api/incidents', form);
      navigate(`/incident/${data._id}/confirmation`, { state: { incident: data } });
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to submit incident');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-6 flex gap-2 text-sm">{[1, 2, 3].map((n) => <span key={n} className={`h-2 flex-1 rounded-full ${step >= n ? 'bg-green-600' : 'bg-gray-100'}`} />)}</div>
      {step === 1 && (
        <div className="space-y-5">
          <div>
            <label className="text-sm font-medium">Animal type</label>
            <div className="mt-3 flex flex-wrap gap-2">{animals.map((animal) => <button key={animal} onClick={() => update({ animalType: animal })} className={`rounded-full border px-3 py-1.5 text-sm ${form.animalType === animal ? 'border-green-600 bg-green-50 text-green-800' : 'border-gray-200'}`}>{animal}</button>)}</div>
          </div>
          <div>
            <label className="text-sm font-medium">Emergency category</label>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">{emergencyCategories.map((cat) => <button key={cat.id} onClick={() => update({ emergencyCategory: cat.id })} className={`rounded-xl border p-4 text-left text-sm ${form.emergencyCategory === cat.id ? 'border-green-600 bg-green-50 text-green-800' : 'border-gray-100 bg-white'}`}>{cat.label}</button>)}</div>
          </div>
          <textarea className={inputClass} rows="5" placeholder="Describe what happened, where the animal is, and visible injuries." value={form.description} onChange={(e) => update({ description: e.target.value })} />
        </div>
      )}
      {step === 2 && (
        <div className="space-y-5">
          <Button variant="secondary" onClick={async () => geo.locate()} disabled={geo.loading}>{geo.loading ? 'Locating...' : 'Use my location'}</Button>
          {geo.location && <Button variant="secondary" onClick={() => update({ location: geo.location })}>Apply detected address</Button>}
          <input className={inputClass} placeholder="Address" value={form.location.address || ''} onChange={(e) => update({ location: { ...form.location, address: e.target.value } })} />
          <input className={inputClass} placeholder="City" value={form.location.city || ''} onChange={(e) => update({ location: { ...form.location, city: e.target.value.toLowerCase() } })} />
          <ImageUploader images={form.images} setImages={(images) => update({ images })} />
        </div>
      )}
      {step === 3 && (
        <div className="space-y-5 text-sm">
          <div className="rounded-lg bg-gray-50 p-4">
            <p><b>{form.animalType}</b> · {form.emergencyCategory?.replaceAll('_', ' ')}</p>
            <p className="mt-2 text-gray-600">{form.description}</p>
            <p className="mt-2 text-gray-500">{form.location.address || form.location.city}</p>
          </div>
          <input className={inputClass} placeholder="Your name (optional)" onChange={(e) => update({ reportedBy: { ...form.reportedBy, name: e.target.value } })} />
          <input className={inputClass} placeholder="Phone (optional)" onChange={(e) => update({ reportedBy: { ...form.reportedBy, phone: e.target.value } })} />
        </div>
      )}
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      <div className="mt-6 flex justify-between">
        <Button variant="secondary" onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1}>Back</Button>
        {step < 3 ? <Button onClick={() => setStep(step + 1)} disabled={step === 1 && (!form.animalType || !form.emergencyCategory || form.description.length < 20)}>Next</Button> : <Button onClick={submit} disabled={loading}>{loading ? 'Submitting...' : 'Submit report'}</Button>}
      </div>
    </div>
  );
};
