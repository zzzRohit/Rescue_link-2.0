export const EmptyState = ({ title, text }) => (
  <div className="rounded-xl border border-dashed border-gray-200 bg-white p-8 text-center">
    <h3 className="text-sm font-medium text-gray-900">{title}</h3>
    {text && <p className="mt-2 text-sm text-gray-500">{text}</p>}
  </div>
);
