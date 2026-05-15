export const Button = ({ variant = 'primary', className = '', ...props }) => {
  const styles = {
    primary: 'bg-green-600 text-green-50 rounded-lg px-5 py-2.5 text-sm font-medium hover:bg-green-800 transition disabled:opacity-60',
    secondary: 'border border-gray-200 bg-white rounded-lg px-5 py-2.5 text-sm hover:bg-gray-50 transition disabled:opacity-60',
    danger: 'bg-red-50 text-red-600 border border-red-200 rounded-lg px-5 py-2.5 text-sm disabled:opacity-60'
  };
  return <button className={`${styles[variant]} ${className}`} {...props} />;
};
