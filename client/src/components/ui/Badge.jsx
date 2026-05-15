export const Badge = ({ children, className = '' }) => (
  <span className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full ${className}`}>{children}</span>
);
