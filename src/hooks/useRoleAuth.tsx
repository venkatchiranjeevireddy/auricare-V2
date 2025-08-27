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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setUserRole(session?.user?.user_metadata?.role || null);
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setUserRole(session?.user?.user_metadata?.role || null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // ✅ Normal User Sign-up
  const signUp = async (email: string, password: string, role: UserRole, metadata?: any) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "http://localhost:5173/auth/callback",
        data: { role, ...metadata }
      }
    });

    if (error) {
      toast({ title: "Sign Up Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Account Created", description: "Please check your email for verification." });
    }

    return { error };
  };

  // ✅ Normal User Sign-in
  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast({ title: "Sign In Error", description: error.message, variant: "destructive" });
      return { error };
    }

    const role = data.user?.user_metadata?.role;
    navigate(role === "doctor" ? "/doctor/dashboard" : "/dashboard");

    return { error: null };
  };

  // ✅ Doctor Sign-in using `doctors` table
  const doctorSignIn = async (doctorId: string, password: string) => {
    // For demo purposes, use hardcoded doctor credentials
    const validDoctors = {
      'DOC001': 'doctor123',
      'DOC002': 'doctor456', 
      'DOC003': 'doctor789'
    };

    if (!validDoctors[doctorId] || validDoctors[doctorId] !== password) {
      toast({ title: "Login Error", description: "Invalid doctor credentials", variant: "destructive" });
      return { error: "Invalid doctor credentials" };
    }

    // Create a mock doctor user object
    const doctorUser = {
      id: doctorId,
      email: `${doctorId.toLowerCase()}@hospital.com`,
      user_metadata: {
        role: 'doctor',
        name: `Dr. ${doctorId}`,
        doctor_id: doctorId
      }
    };

    // Store doctor info and update auth state
    localStorage.setItem("doctor", JSON.stringify(doctorUser));
    setUser(doctorUser as any);
    setUserRole('doctor');
    
    navigate("/doctor/dashboard");
    
    toast({ title: "Welcome Doctor", description: `Successfully logged in as ${doctorUser.user_metadata.name}` });
    
    return { error: null };
  };

  // ✅ Sign-out
  const signOut = async () => {
    // Check if it's a doctor session
    const storedDoctor = localStorage.getItem("doctor");
    if (storedDoctor) {
      localStorage.removeItem("doctor");
      setUser(null);
      setUserRole(null);
    } else {
      await supabase.auth.signOut();
    }
    
    localStorage.removeItem("doctor");
    navigate("/auth");
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
