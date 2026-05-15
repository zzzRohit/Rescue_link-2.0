import { Link } from 'react-router-dom';

export default function NotFound() {
  return <div className="text-center"><h1 className="text-3xl font-medium">Page not found</h1><Link className="mt-4 inline-block text-green-800" to="/">Go home</Link></div>;
}
