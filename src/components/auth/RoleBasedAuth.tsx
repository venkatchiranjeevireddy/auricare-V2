import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus, LogIn, Stethoscope, User, Heart } from 'lucide-react';
import { useRoleAuth } from '@/hooks/useRoleAuth';
import { UserRole } from '@/types/roles';

const RoleBasedAuth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState<UserRole>('user');
  const [doctorId, setDoctorId] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signUp, signIn, doctorSignIn } = useRoleAuth();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    await signUp(email, password, role, {
      username,
      first_name: firstName,
      last_name: lastName,
    });
    
    setLoading(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await signIn(email, password);
      if (!result.error) {
        // Success - navigation will be handled by useRoleAuth
        console.log('Sign in successful');
      }
    } catch (error) {
      console.error('Sign in failed:', error);
    }
    
    setLoading(false);
  };

  const handleDoctorSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await doctorSignIn(doctorId, password);
      if (!result.error) {
        // Success - navigation will be handled by useRoleAuth
        console.log('Doctor sign in successful');
      }
    } catch (error) {
      console.error('Doctor sign in failed:', error);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <Heart className="size-12 mx-auto text-primary mb-4" />
          </motion.div>
          <h1 className="text-3xl font-heading font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            HealthCare Platform
          </h1>
          <p className="text-muted-foreground mt-2">Secure access for patients, users, and doctors</p>
        </div>

        <Tabs defaultValue="signin" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/50 backdrop-blur-sm">
            <TabsTrigger value="signin" className="data-[state=active]:bg-white/80">Sign In</TabsTrigger>
            <TabsTrigger value="signup" className="data-[state=active]:bg-white/80">Sign Up</TabsTrigger>
            <TabsTrigger value="doctor" className="data-[state=active]:bg-white/80">Doctor</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LogIn className="size-5" />
                  Sign In
                </CardTitle>
                <CardDescription>
                  Access your healthcare dashboard
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-white/50"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-white/50"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="size-5" />
                  Create Account
                </CardTitle>
                <CardDescription>
                  Join as a user or patient
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select value={role} onValueChange={(value: UserRole) => setRole(value)}>
                      <SelectTrigger className="bg-white/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">
                          <div className="flex items-center gap-2">
                            <User className="size-4" />
                            User
                          </div>
                        </SelectItem>
                        <SelectItem value="patient">
                          <div className="flex items-center gap-2">
                            <Heart className="size-4" />
                            Patient
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First Name</Label>
                      <Input
                        id="first-name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="bg-white/50"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input
                        id="last-name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="bg-white/50"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="bg-white/50"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-white/50"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-white/50"
                      required
                    />
                  </div>
                  <Button type="submit" variant="hero" className="w-full" disabled={loading}>
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="doctor">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="size-5" />
                  Doctor Login
                </CardTitle>
                <CardDescription>
                  Access with your unique doctor credentials
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleDoctorSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="doctor-id">Doctor ID</Label>
                    <Input
                      id="doctor-id"
                      value={doctorId}
                      onChange={(e) => setDoctorId(e.target.value)}
                      placeholder="DOC001"
                      className="bg-white/50"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="doctor-password">Password</Label>
                    <Input
                      id="doctor-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-white/50"
                      required
                    />
                  </div>
                  <Button type="submit" variant="glow" className="w-full" disabled={loading}>
                    {loading ? 'Signing In...' : 'Doctor Sign In'}
                  </Button>
                </form>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-600">
                    Demo Credentials: DOC001/doctor123, DOC002/doctor456, DOC003/doctor789
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default RoleBasedAuth;