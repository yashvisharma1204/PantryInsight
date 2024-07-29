// components/ProtectedRoute.js
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/auth'); // Redirect to login page if not logged in
    }
  }, [user, router]);

  if (!user) {
    return null; // Render nothing while checking authentication
  }

  return children; // Render the protected content if logged in
};

export default ProtectedRoute;
