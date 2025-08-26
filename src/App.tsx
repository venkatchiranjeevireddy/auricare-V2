import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { RoleAuthProvider, useRoleAuth } from "@/hooks/useRoleAuth";
import RoleBasedLayout from "./components/layout/RoleBasedLayout";
import RoleBasedAuth from "./components/auth/RoleBasedAuth";
import Index from "./pages/Index";
import About from "./pages/About";
import News from "./pages/News";

// User pages
import UserDashboard from "./pages/user/UserDashboard";
import UserAppointments from "./pages/user/UserAppointments";
import UserChatbot from "./pages/user/UserChatbot";

// Patient pages
import PatientDashboard from "./pages/patient/PatientDashboard";
import PatientProgress from "./pages/patient/PatientProgress";
import PatientAppointments from "./pages/patient/PatientAppointments";
import PatientChatbot from "./pages/patient/PatientChatbot";

// Doctor pages
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import DoctorAppointments from "./pages/doctor/DoctorAppointments";
import DoctorPatients from "./pages/doctor/DoctorPatients";
import DoctorSchedule from "./pages/doctor/DoctorSchedule";
import DoctorLearning from "./pages/doctor/DoctorLearning";
import DoctorChatbot from "./pages/doctor/DoctorChatbot";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// ----------- AppRoutes Component -------------
function AppRoutes() {
  const { user, userRole, loading } = useRoleAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <RoleBasedAuth />;
  }

  return (
    <RoleBasedLayout>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/news" element={<News />} />

        {/* User Routes */}
        {userRole === "user" && (
          <>
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/user/appointments" element={<UserAppointments />} />
            <Route path="/user/chatbot" element={<UserChatbot />} />
          </>
        )}

        {/* Patient Routes */}
        {userRole === "patient" && (
          <>
            <Route path="/patient/dashboard" element={<PatientDashboard />} />
            <Route path="/patient/progress" element={<PatientProgress />} />
            <Route path="/patient/appointments" element={<PatientAppointments />} />
            <Route path="/patient/chatbot" element={<PatientChatbot />} />
          </>
        )}

        {/* Doctor Routes */}
        {userRole === "doctor" && (
          <>
            <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
            <Route path="/doctor/appointments" element={<DoctorAppointments />} />
            <Route path="/doctor/patients" element={<DoctorPatients />} />
            <Route path="/doctor/schedule" element={<DoctorSchedule />} />
            <Route path="/doctor/learning" element={<DoctorLearning />} />
            <Route path="/doctor/chatbot" element={<DoctorChatbot />} />
          </>
        )}

        <Route path="*" element={<NotFound />} />
      </Routes>
    </RoleBasedLayout>
  );
}

// ----------- Main App Component -------------
const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <BrowserRouter>
        <RoleAuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <AppRoutes />
          </TooltipProvider>
        </RoleAuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
