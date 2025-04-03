
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, Shield, Lock, Users, Key } from "lucide-react";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    setIsAuthenticated(!!token);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-auth-dark to-auth-dark/90 text-white">
      <header className="container mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-auth-primary p-2 rounded-lg">
            <Shield className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold">IdentityNexus</h1>
        </div>
        <nav>
          <div className="flex space-x-4">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button variant="ghost" className="text-white hover:text-white hover:bg-white/10">
                  Tableau de bord
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/sign-in">
                  <Button variant="ghost" className="text-white hover:text-white hover:bg-white/10">
                    Connexion
                  </Button>
                </Link>
                <Link to="/sign-up">
                  <Button className="bg-auth-primary hover:bg-auth-primary/90">
                    Inscription
                  </Button>
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-6 py-12 animate-fadeIn">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Solution d'authentification sécurisée pour vos applications
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              IdentityNexus fournit une gestion d'identité robuste avec authentification multi-facteurs,
              contrôle d'accès basé sur les rôles et une sécurité de niveau entreprise.
            </p>
            <div className="pt-6 flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/sign-up">
                <Button size="lg" className="bg-auth-primary hover:bg-auth-primary/90 text-lg px-8">
                  Commencer gratuitement
                </Button>
              </Link>
              <Link to="/sign-in">
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 text-lg px-8">
                  Se connecter
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 py-16">
            <Card className="bg-white/5 border-0 text-white animate-slideUp">
              <CardContent className="p-6 space-y-4">
                <div className="bg-auth-primary/20 p-3 rounded-full w-fit">
                  <Users className="h-6 w-6 text-auth-primary" />
                </div>
                <h3 className="text-xl font-semibold">Gestion des utilisateurs</h3>
                <p className="text-gray-300">
                  Inscription, connexion, gestion des profils et récupération de mot de passe simplifiées.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-0 text-white animate-slideUp delay-100">
              <CardContent className="p-6 space-y-4">
                <div className="bg-auth-primary/20 p-3 rounded-full w-fit">
                  <Key className="h-6 w-6 text-auth-primary" />
                </div>
                <h3 className="text-xl font-semibold">Authentification JWT</h3>
                <p className="text-gray-300">
                  Authentification sécurisée basée sur des jetons JWT pour une expérience sans état.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-0 text-white animate-slideUp delay-200">
              <CardContent className="p-6 space-y-4">
                <div className="bg-auth-primary/20 p-3 rounded-full w-fit">
                  <Lock className="h-6 w-6 text-auth-primary" />
                </div>
                <h3 className="text-xl font-semibold">Contrôle d'accès par rôles</h3>
                <p className="text-gray-300">
                  Définissez les permissions et contrôlez l'accès avec une gestion fine des rôles.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center py-12">
            <h2 className="text-3xl font-bold mb-6">Prêt à sécuriser votre application?</h2>
            <Link to="/sign-up">
              <Button size="lg" className="bg-auth-primary hover:bg-auth-primary/90 group">
                Créer un compte 
                <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/10 py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="bg-auth-primary p-1.5 rounded-lg">
                <Shield className="h-4 w-4" />
              </div>
              <span className="text-lg font-semibold">IdentityNexus</span>
            </div>
            <div className="text-sm text-gray-400">
              © {new Date().getFullYear()} IdentityNexus. Tous droits réservés.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
