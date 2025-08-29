import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, Calendar, MessageSquare, TrendingUp, Heart, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRoleAuth } from '@/hooks/useRoleAuth';
import { GlassmorphismCard } from '@/components/ui/glassmorphism-card';

import { usePatientNotifications } from '@/hooks/usePatientNotifications';
import { Bell } from 'lucide-react';

const PatientDashboard = () => {
  const { user } = useRoleAuth();
  const { notifications, unreadCount } = usePatientNotifications();

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
        <h1 className="text-4xl font-heading font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          Welcome, {user?.user_metadata?.first_name || 'Patient'}!
        </h1>
        <p className="text-gray-600 mt-2">Track your health progress and manage your care</p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <GlassmorphismCard className="p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-full">
              <Heart className="size-8 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Health Overview</h2>
              <p className="text-gray-600">Your current health status and recent reports</p>
            </div>
            {unreadCount > 0 && (
              <div className="ml-auto flex items-center gap-2">
                <Bell className="size-5 text-orange-600" />
                <Badge className="bg-orange-100 text-orange-800">
                  {unreadCount} New
                </Badge>
              </div>
            )}
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
              <CardTitle className="flex items-center gap-2 text-green-600">
                <TrendingUp className="size-5" />
                Progress Tracker
              </CardTitle>
              <CardDescription>
                View your weekly health reports and progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/patient/progress">
                <Button className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                  View Progress
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-600">
                <Calendar className="size-5" />
                My Appointments
              </CardTitle>
              <CardDescription>
                View your scheduled appointments and history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/patient/appointments">
                <Button variant="outline" className="w-full border-blue-200 hover:bg-blue-50">
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
                Get personalized health guidance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/patient/chatbot">
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
                Health Metrics
              </CardTitle>
              <CardDescription>
                Monitor your vital signs and health data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full border-orange-200 hover:bg-orange-50">
                View Metrics
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-indigo-600">
                <FileText className="size-5" />
                Medical Records
              </CardTitle>
              <CardDescription>
                Access your medical history and documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full border-indigo-200 hover:bg-indigo-50">
                View Records
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Recent Reports & Notifications
              {unreadCount > 0 && (
                <Badge className="bg-orange-100 text-orange-800">
                  {unreadCount}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="size-12 mx-auto mb-4 opacity-50" />
                <p>No recent reports</p>
                <p className="text-sm mt-2">Your health reports and progress updates will appear here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.slice(0, 5).map((notification) => (
                  <div key={notification.id} className={`p-3 rounded-lg border-l-4 ${
                    notification.type === 'appointment' ? 'bg-blue-50 border-blue-500' :
                    notification.type === 'schedule' ? 'bg-green-50 border-green-500' :
                    'bg-gray-50 border-gray-500'
                  } ${!notification.read ? 'bg-opacity-100' : 'bg-opacity-50'}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{notification.title}</h4>
                        <p className="text-sm text-gray-600">{notification.message}</p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(notification.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default PatientDashboard;