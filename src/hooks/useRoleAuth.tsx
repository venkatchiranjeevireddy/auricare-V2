import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { UserRole } from '@/types/roles';

interface RoleAuthContextType {
  user: User | null;
  session: Session | null;
  userRole: UserRole | null;
  loading: boolean;
  signUp: (email: string, password: string, role: UserRole, metadata?: any) => Promise<{ error?: any }>;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  doctorSignIn: (doctorId: string, password: string) => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
}

const RoleAuthContext = createContext<RoleAuthContextType | undefined>(undefined);

// Predefined doctor credentials
const DOCTOR_CREDENTIALS = [
  { doctorId: 'DOC001', password: 'doctor123', name: 'Dr. Smith', email: 'dr.smith@hospital.com', specialization: 'Cardiology' },
  { doctorId: 'DOC002', password: 'doctor456', name: 'Dr. Johnson', email: 'dr.johnson@hospital.com', specialization: 'Neurology' },
  { doctorId: 'DOC003', password: 'doctor789', name: 'Dr. Williams', email: 'dr.williams@hospital.com', specialization: 'Pediatrics' }
];

export const RoleAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Get user role from metadata or database
          const role = session.user.user_metadata?.role || 'user';
          setUserRole(role);
        } else {
          setUserRole(null);
        }
        
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const role = session.user.user_metadata?.role || 'user';
        setUserRole(role);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, role: UserRole, metadata?: any) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role,
          ...metadata
        }
      }
    });

    if (error) {
      toast({
        title: 'Sign Up Error',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Account Created',
        description: 'Please check your email for verification.',
      });
    }

    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        title: 'Sign In Error',
        description: error.message,
        variant: 'destructive',
      });
    }

    return { error };
  };

  const doctorSignIn = async (doctorId: string, password: string) => {
    // Check predefined doctor credentials
    const doctor = DOCTOR_CREDENTIALS.find(
      d => d.doctorId === doctorId && d.password === password
    );

    if (!doctor) {
      const error = { message: 'Invalid doctor credentials' };
      toast({
        title: 'Login Error',
        description: 'Invalid doctor ID or password',
        variant: 'destructive',
      });
      return { error };
    }

    // Create a session for the doctor using their email
    const { error } = await supabase.auth.signInWithPassword({
      email: doctor.email,
      password: 'doctor_default_password_123', // This would be set up in your auth system
    });

    if (error) {
      // If doctor doesn't exist in auth, create them
      const { error: signUpError } = await supabase.auth.signUp({
        email: doctor.email,
        password: 'doctor_default_password_123',
        options: {
          data: {
            role: 'doctor',
            doctor_id: doctor.doctorId,
            name: doctor.name,
            specialization: doctor.specialization
          }
        }
      });

      if (!signUpError) {
        // Try signing in again
        await supabase.auth.signInWithPassword({
          email: doctor.email,
          password: 'doctor_default_password_123',
        });
      }
    }

    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: 'Signed out',
      description: 'You have been signed out successfully.',
    });
  };

  return (
    <RoleAuthContext.Provider value={{
      user,
      session,
      userRole,
      loading,
      signUp,
      signIn,
      doctorSignIn,
      signOut,
    }}>
      {children}
    </RoleAuthContext.Provider>
  );
};

export const useRoleAuth = () => {
  const context = useContext(RoleAuthContext);
  if (context === undefined) {
    throw new Error('useRoleAuth must be used within a RoleAuthProvider');
  }
  return context;
};