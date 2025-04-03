
import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('auth-token');
      setIsAuthenticated(!!token);
    };
    
    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    // Still checking authentication status
    return <div className="flex justify-center items-center h-screen">Vérification de l'authentification...</div>;
  }

  if (!isAuthenticated) {
    // Redirect to the login page with the return url
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
