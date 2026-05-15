const steps = ['pending', 'accepted', 'on_the_way', 'rescued', 'closed'];
export const RescueStatusStepper = ({ status }) => {
  const active = steps.indexOf(status);
  return <div className="grid gap-2 sm:grid-cols-5">{steps.map((step, index) => <div key={step} className={`rounded-lg px-3 py-2 text-center text-xs capitalize ${index <= active ? 'bg-green-50 text-green-800' : 'bg-gray-100 text-gray-500'}`}>{step.replaceAll('_', ' ')}</div>)}</div>;
};
