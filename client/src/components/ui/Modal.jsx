export const Modal = ({ open, title, children, onClose }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-medium">{title}</h2>
          <button onClick={onClose} className="text-sm text-gray-500">Close</button>
        </div>
        {children}
      </div>
    </div>
  );
};
