import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { UserRole } from "@/types/roles";

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

export const RoleAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for stored doctor session on mount
    const storedDoctor = localStorage.getItem("doctor");
    if (storedDoctor) {
      try {
        const doctorData = JSON.parse(storedDoctor);
        setUser(doctorData);
        setUserRole('doctor');
        setLoading(false);
        return;
      } catch (error) {
        localStorage.removeItem("doctor");
      }
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Get user role from metadata or default to 'user'
        const role = session.user.user_metadata?.role || 'user';
        setUserRole(role);
      } else {
        setUserRole(null);
      }
      
      setLoading(false);
    });

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
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { role, ...metadata }
        }
      });

      if (error) {
        toast({ title: "Sign Up Error", description: error.message, variant: "destructive" });
        return { error };
      }

      if (data.user && !data.session) {
        toast({ 
          title: "Check your email", 
          description: "Please check your email for verification link." 
        });
      } else if (data.session) {
        toast({ 
          title: "Account Created", 
          description: "Welcome! Your account has been created successfully." 
        });
        
        // Navigate based on role
        setTimeout(() => {
          if (role === "doctor") {
            navigate("/doctor/dashboard");
          } else if (role === "patient") {
            navigate("/patient/dashboard");
          } else {
            navigate("/user/dashboard");
          }
        }, 100);
      }

      return { error: null };
    } catch (err) {
      console.error('Sign up error:', err);
      toast({ title: "Sign Up Error", description: "Failed to create account", variant: "destructive" });
      return { error: err };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        toast({ title: "Sign In Error", description: error.message, variant: "destructive" });
        return { error };
      }

      const role = data.user?.user_metadata?.role || 'user';
      
      toast({ 
        title: "Welcome back!", 
        description: "You have been signed in successfully." 
      });
      
      // Navigate based on role
      setTimeout(() => {
        if (role === "doctor") {
          navigate("/doctor/dashboard");
        } else if (role === "patient") {
          navigate("/patient/dashboard");
        } else {
          navigate("/user/dashboard");
        }
      }, 100);

      return { error: null };
    } catch (err) {
      console.error('Sign in error:', err);
      toast({ title: "Sign In Error", description: "Authentication failed", variant: "destructive" });
      return { error: err };
    }
  };

  const doctorSignIn = async (doctorId: string, password: string) => {
    try {
      const validDoctors = [
        { id: 'doc1', doctor_id: 'DOC001', name: 'Dr. Sarah Johnson', email: 'sarah.johnson@hospital.com', specialization: 'Cardiology', password: 'doctor123' },
        { id: 'doc2', doctor_id: 'DOC002', name: 'Dr. Michael Chen', email: 'michael.chen@hospital.com', specialization: 'Neurology', password: 'doctor456' },
        { id: 'doc3', doctor_id: 'DOC003', name: 'Dr. Emily Rodriguez', email: 'emily.rodriguez@hospital.com', specialization: 'Pediatrics', password: 'doctor789' }
      ];

      const doctor = validDoctors.find(d => d.doctor_id === doctorId && d.password === password);

      if (!doctor) {
        toast({ title: "Login Error", description: "Invalid doctor credentials", variant: "destructive" });
        return { error: "Invalid doctor credentials" };
      }

      const doctorUser = {
        id: doctor.id,
        email: doctor.email,
        user_metadata: {
          role: 'doctor',
          name: doctor.name,
          doctor_id: doctor.doctor_id,
          specialization: doctor.specialization
        }
      };

      localStorage.setItem("doctor", JSON.stringify(doctorUser));
      setUser(doctorUser as any);
      setUserRole('doctor');
      
      setTimeout(() => {
        navigate("/doctor/dashboard");
      }, 100);
      
      toast({ title: "Welcome Doctor", description: `Successfully logged in as ${doctor.name}` });
      
      return { error: null };
    } catch (error) {
      toast({ title: "Login Error", description: "Authentication error", variant: "destructive" });
      return { error: "Authentication error" };
    }
  };

  const signOut = async () => {
    const storedDoctor = localStorage.getItem("doctor");
    if (storedDoctor) {
      localStorage.removeItem("doctor");
      setUser(null);
      setUserRole(null);
    } else {
      await supabase.auth.signOut();
    }
    
    localStorage.removeItem("doctor");
    navigate("/");
    toast({ title: "Signed out", description: "You have been signed out successfully." });
  };

  return (
    <RoleAuthContext.Provider value={{ user, session, userRole, loading, signUp, signIn, doctorSignIn, signOut }}>
      {children}
    </RoleAuthContext.Provider>
  );
};

export const useRoleAuth = () => {
  const context = useContext(RoleAuthContext);
  if (!context) throw new Error("useRoleAuth must be used within a RoleAuthProvider");
  return context;
};