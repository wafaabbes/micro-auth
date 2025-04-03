
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";

const ForgotPassword = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      console.log("Password reset request for:", email);
      
      // TODO: Replace with actual API call
      setTimeout(() => {
        setIsSubmitted(true);
        toast({
          title: "Email envoyé",
          description: "Un lien de réinitialisation a été envoyé à votre adresse email.",
        });
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
      });
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md animate-fadeIn">
        <Card className="border-0 shadow-lg">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center">
              <Link to="/sign-in" className="absolute left-4 top-4 flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="mr-1 h-4 w-4" />
                Retour
              </Link>
              <CardTitle className="text-2xl font-bold text-center">Mot de passe oublié</CardTitle>
            </div>
            <CardDescription className="text-center">
              {!isSubmitted 
                ? "Entrez votre email pour recevoir un lien de réinitialisation" 
                : "Vérifiez votre boîte de réception pour le lien de réinitialisation"}
            </CardDescription>
          </CardHeader>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Adresse email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="nom@exemple.com"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  className="w-full bg-auth-primary hover:bg-auth-primary/90"
                  disabled={isLoading}
                >
                  {isLoading ? "Envoi en cours..." : "Envoyer le lien de réinitialisation"}
                </Button>
              </CardFooter>
            </form>
          ) : (
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-green-50 p-4 text-green-800 text-sm">
                <p>Un email a été envoyé à <strong>{email}</strong> avec les instructions pour réinitialiser votre mot de passe.</p>
              </div>
              <div className="text-center text-sm text-muted-foreground">
                <p>Vous n'avez pas reçu l'email?</p>
                <Button
                  variant="link"
                  className="text-auth-primary p-0 h-auto"
                  onClick={() => setIsSubmitted(false)}
                >
                  Essayer une autre adresse email
                </Button>
              </div>
            </CardContent>
          )}
          
          <CardFooter className="flex flex-col">
            <p className="text-center text-sm text-muted-foreground">
              Vous vous souvenez de votre mot de passe?{" "}
              <Link to="/sign-in" className="font-medium text-auth-primary hover:underline">
                Se connecter
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
