import { Link } from 'react-router';
import { Button } from '../components/shared/Button';

export function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-[#222222] mb-4">404 - Page Not Found</h1>
        <p className="text-[#717171] mb-8">The page you're looking for doesn't exist.</p>
        <Link to="/">
          <Button variant="primary">Go Home</Button>
        </Link>
      </div>
    </div>
  );
}