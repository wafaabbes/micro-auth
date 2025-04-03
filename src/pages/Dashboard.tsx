
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { LogOut, User, Shield } from "lucide-react";

type UserData = {
  email: string;
  role: string;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('auth-token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      navigate('/sign-in');
      return;
    }
    
    try {
      setUser(JSON.parse(userData));
    } catch (e) {
      localStorage.removeItem('auth-token');
      localStorage.removeItem('user');
      navigate('/sign-in');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('user');
    
    toast({
      title: "Déconnexion réussie",
      description: "Vous avez été déconnecté avec succès.",
    });
    
    navigate('/sign-in');
  };

  if (!user) return <div className="flex justify-center items-center h-screen">Chargement...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Tableau de bord</h1>
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Déconnexion
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="animate-fadeIn">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center gap-2">
                <User className="h-5 w-5 text-auth-primary" />
                Profil Utilisateur
              </CardTitle>
              <CardDescription>Informations sur votre compte</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium">{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rôle:</span>
                  <span className="font-medium flex items-center gap-1">
                    {user.role === 'admin' ? (
                      <>
                        <Shield className="h-4 w-4 text-auth-primary" />
                        Administrateur
                      </>
                    ) : (
                      'Utilisateur'
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Statut:</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Actif
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fadeIn animation-delay-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Activité Récente</CardTitle>
              <CardDescription>Historique de connexion</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-2 border-auth-primary pl-4 py-1">
                  <p className="text-sm font-medium">Connexion réussie</p>
                  <p className="text-xs text-muted-foreground">À l'instant</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fadeIn animation-delay-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Sécurité</CardTitle>
              <CardDescription>Options de sécurité du compte</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                Changer de mot de passe
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Activer la 2FA
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
