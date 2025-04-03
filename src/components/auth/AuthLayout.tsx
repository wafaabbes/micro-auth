
import React from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-auth-dark to-auth-dark/90 text-auth-light">
      <div className="flex flex-col items-center justify-center flex-1 px-6 py-12">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-block">
            <div className="flex items-center gap-2">
              <div className="bg-auth-primary text-white p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield-check">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white">IdentityNexus</h1>
            </div>
          </Link>
          <p className="mt-2 text-auth-muted">Service d'authentification sécurisé</p>
        </div>
        {children}
      </div>
      <footer className="py-4 text-center text-sm text-auth-muted">
        <p>© {new Date().getFullYear()} IdentityNexus. Tous droits réservés.</p>
      </footer>
    </div>
  );
};

export default AuthLayout;
