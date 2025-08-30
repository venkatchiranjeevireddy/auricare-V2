import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarCheck2, MessageSquare, User, Heart, Plus, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRoleAuth } from '@/hooks/useRoleAuth';
import { GlassmorphismCard } from '@/components/ui/glassmorphism-card';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const UserDashboard = () => {
  const { user } = useRoleAuth();
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [appointmentCount, setAppointmentCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      // Fetch user's appointments
      const { data: appointments, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('family_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setAppointmentCount(appointments?.length || 0);
      
      // Transform appointments to recent activity
      const activity = (appointments || []).slice(0, 3).map(apt => ({
        id: apt.id,
        title: 'Appointment Scheduled',
        description: `Appointment on ${new Date(apt.appointment_date).toLocaleDateString()}`,
        date: apt.created_at
      }));

      setRecentActivity(activity);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <motion.div variants={itemVariants} className="text-center">
        <h1 className="text-4xl font-heading font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Welcome back, {user?.user_metadata?.first_name || 'User'}!
        </h1>
        <p className="text-gray-600 mt-2">Manage your health and appointments</p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <GlassmorphismCard className="p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <User className="size-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Health Summary</h2>
              <p className="text-gray-600">Your health profile and recent activity</p>
            </div>
            <div className="ml-auto">
              <Badge className="bg-blue-100 text-blue-800">
                {appointmentCount} Appointments
              </Badge>
            </div>
          </div>
        </GlassmorphismCard>
      </motion.div>

      <motion.div
        variants={containerVariants}
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        <motion.div variants={itemVariants}>
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-600">
                <Plus className="size-5" />
                Book Appointment
              </CardTitle>
              <CardDescription>
                Schedule a new appointment with healthcare providers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/user/appointments">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Book Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <CalendarCheck2 className="size-5" />
                My Appointments
              </CardTitle>
              <CardDescription>
                View and manage your scheduled appointments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/user/appointments">
                <Button variant="outline" className="w-full border-green-200 hover:bg-green-50">
                  View Appointments
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-600">
                <MessageSquare className="size-5" />
                AI Health Assistant
              </CardTitle>
              <CardDescription>
                Get instant health guidance and support
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/user/chatbot">
                <Button variant="glow" className="w-full">
                  Chat Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-600">
                <Activity className="size-5" />
                Health Insights
              </CardTitle>
              <CardDescription>
                Track your health metrics and progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full border-orange-200 hover:bg-orange-50">
                View Insights
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <Heart className="size-5" />
                Emergency
              </CardTitle>
              <CardDescription>
                Quick access to emergency services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="destructive" className="w-full">
                Emergency Contact
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : 
            {recentActivity.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Activity className="size-12 mx-auto mb-4 opacity-50" />
                <p>No recent activity</p>
                <p className="text-sm mt-2">Your appointments and health updates will appear here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <CalendarCheck2 className="size-5 text-blue-600" />
                    <div>
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(activity.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default UserDashboard;