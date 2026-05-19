import { Navigate } from 'react-router-dom';

// The full-page sign-in form has been removed.
// Authentication is handled entirely through the modal (LoginModal).
export function SignIn() {
  return <Navigate to="/" replace />;
}
