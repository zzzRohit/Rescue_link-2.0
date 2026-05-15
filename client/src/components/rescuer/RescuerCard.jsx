export const RescuerCard = ({ rescuer }) => (
  <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
    <h3 className="font-medium">{rescuer.name}</h3>
    <p className="mt-1 text-sm text-gray-500">{rescuer.city} · {rescuer.specialties?.join(', ')}</p>
  </div>
);
