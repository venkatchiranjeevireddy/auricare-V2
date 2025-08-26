import { Helmet } from "react-helmet-async";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarCheck2, MessageSquare, TrendingUp, Users, Plus, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const { profile, userRole, loading } = useProfile();
  const navigate = useNavigate();
  const canonical = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : '';

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!user && !loading) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <main className="container mx-auto py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-pulse text-muted-foreground">Loading dashboard...</div>
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  const isFamily = userRole?.role === 'family';
  const isTherapist = userRole?.role === 'therapist';
  const isAdmin = userRole?.role === 'admin';

  return (
    <main className="container mx-auto py-12">
      <Helmet>
        <title>Dashboard — AuriCare</title>
        <meta name="description" content="Your personalized AuriCare dashboard with therapy progress, appointments, and tools." />
        {canonical && <link rel="canonical" href={canonical} />}
      </Helmet>

      <div className="mb-8">
        <h1 className="text-3xl font-heading font-semibold">
          Welcome back, {profile?.first_name || user.email}
        </h1>
        <p className="text-muted-foreground mt-2">
          {isFamily && "Track your family's therapy progress and manage schedules"}
          {isTherapist && "Manage your client sessions and appointments"}
          {isAdmin && "Overview of platform activity and user management"}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Quick Actions */}
        {isFamily && (
          <>
            <Card className="hover-scale">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="size-5 text-primary" />
                  Log Session
                </CardTitle>
                <CardDescription>
                  Record a new therapy session
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Add Session</Button>
              </CardContent>
            </Card>

            <Card className="hover-scale">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarCheck2 className="size-5 text-primary" />
                  Schedule
                </CardTitle>
                <CardDescription>
                  Manage daily visual schedules
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/dashboard" className="block">
                  <Button variant="outline" className="w-full">View Schedules</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover-scale">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="size-5 text-primary" />
                  Ask Auri
                </CardTitle>
                <CardDescription>
                  Get AI assistance and guidance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/chatbot" className="block">
                  <Button variant="glow" className="w-full">Chat Now</Button>
                </Link>
              </CardContent>
            </Card>
          </>
        )}

        {isTherapist && (
          <>
            <Card className="hover-scale">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="size-5 text-primary" />
                  My Clients
                </CardTitle>
                <CardDescription>
                  View and manage client sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">View Clients</Button>
              </CardContent>
            </Card>

            <Card className="hover-scale">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarCheck2 className="size-5 text-primary" />
                  Appointments
                </CardTitle>
                <CardDescription>
                  Today's and upcoming sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/appointments" className="block">
                  <Button variant="outline" className="w-full">View Schedule</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover-scale">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="size-5 text-primary" />
                  Progress Reports
                </CardTitle>
                <CardDescription>
                  Generate client progress summaries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">View Reports</Button>
              </CardContent>
            </Card>
          </>
        )}

        {/* Recent Activity */}
        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="size-5 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <p>Your recent therapy sessions and progress will appear here</p>
              <p className="text-sm mt-2">Start by logging your first session or connecting with a therapist</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default Dashboard;
