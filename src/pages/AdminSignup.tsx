import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Eye, EyeOff } from 'lucide-react';

const AdminSignup = () => {
  const [email, setEmail] = useState('malickirfan00@gmail.com');
  const [password, setPassword] = useState('Irfan@123#13');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/admin`
      }
    });

    if (error) {
      if (error.message.includes('already registered')) {
        // User already exists, try to sign in
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          toast({
            title: "Login Failed",
            description: signInError.message,
            variant: "destructive"
          });
        } else if (signInData.user) {
          // Check if user is admin
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('user_id', signInData.user.id)
            .single();
          
          if (profile?.role === 'admin') {
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
      } else {
        toast({
          title: "Signup Failed",
          description: error.message,
          variant: "destructive"
        });
      }
    } else if (data.user) {
      toast({
        title: "Success",
        description: "Admin account created! You can now login."
      });
      window.location.href = '/admin-login';
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-6">
      <Card className="w-full max-w-md glass-card border-white/20">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-white">
            Create Admin Account
          </CardTitle>
          <p className="text-muted-foreground">
            Set up the admin account for the first time
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="glass-card border-white/20"
                readOnly
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
              {loading ? "Creating Admin..." : "Create Admin Account"}
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <button 
                onClick={() => window.location.href = '/admin-login'}
                className="text-primary hover:underline"
              >
                Login here
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSignup;