import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Eye, EyeOff } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if already logged in
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.email === 'malickirfan00@gmail.com') {
        window.location.href = '/admin';
      }
    };
    checkAuth();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // First try to sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // If login fails and it's the admin email, try to create the account
      if (error.message.includes('Email not confirmed') && email === 'malickirfan00@gmail.com') {
        // Try to sign up the admin user
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/admin`
          }
        });

        if (signUpError) {
          if (signUpError.message.includes('already registered')) {
            toast({
              title: "Account Exists",
              description: "Please check your email to confirm your account, or contact support.",
              variant: "destructive"
            });
          } else {
            toast({
              title: "Signup Failed",
              description: signUpError.message,
              variant: "destructive"
            });
          }
        } else {
          toast({
            title: "Account Created",
            description: "Admin account created successfully. Please check email for confirmation.",
          });
        }
      } else {
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive"
        });
      }
    } else if (data.user) {
      // Check if user is admin by email
      if (data.user.email === 'malickirfan00@gmail.com') {
        toast({
          title: "Success",
          description: "Welcome back, Admin!"
        });
        window.location.href = '/admin';
      } else {
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges",
          variant: "destructive"
        });
        await supabase.auth.signOut();
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-6">
      <Card className="w-full max-w-md glass-card border-white/20">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-white">
            Admin Login
          </CardTitle>
          <p className="text-muted-foreground">
            Enter your credentials to access the admin panel
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="glass-card border-white/20"
              />
            </div>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="glass-card border-white/20 pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            <Button 
              type="submit" 
              className="w-full glow-button"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          
          {/* Hidden admin setup - only show for admin email */}
          {email === 'malickirfan00@gmail.com' && (
            <div className="mt-4 text-center">
              <p className="text-xs text-muted-foreground">
                If account doesn't exist, it will be created automatically
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;