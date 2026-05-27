const steps = ['pending', 'accepted', 'on_the_way', 'rescued', 'closed'];
export const RescueStatusStepper = ({ status }) => {
  const active = steps.indexOf(status);
  return (
    <div className="grid gap-2 sm:grid-cols-5">
      {steps.map((step, index) => (
        <div key={step} className={`rounded-lg border px-3 py-3 text-center text-xs capitalize ${index <= active ? 'border-green-200 bg-green-50 text-green-800' : 'border-gray-100 bg-gray-50 text-gray-500'}`}>
          <span className={`mx-auto mb-2 flex h-6 w-6 items-center justify-center rounded-full text-[11px] ${index <= active ? 'bg-green-700 text-white' : 'bg-gray-200 text-gray-500'}`}>
            {index + 1}
          </span>
          {step.replaceAll('_', ' ')}
        </div>
      ))}
    </div>
  );
};
