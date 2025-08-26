import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, MapPin, Eye, Users } from 'lucide-react';
import { useRoleAuth } from '@/hooks/useRoleAuth';
import { supabase } from '@/integrations/supabase/client';
import { Appointment } from '@/types/roles';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const DoctorAppointments = () => {
  const { user } = useRoleAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('appointment_date', { ascending: true });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatientDetails = async (patientId: string) => {
    try {
      // In a real implementation, you would fetch from a users table
      // For now, we'll use the appointment data
      const appointment = appointments.find(apt => apt.patient_id === patientId);
      setSelectedPatient({
        id: patientId,
        name: appointment?.patient_name || 'Unknown Patient',
        username: appointment?.username || 'N/A',
        email: 'patient@example.com',
        details: appointment?.details || 'No additional details',
        appointmentDate: appointment?.appointment_date,
        status: appointment?.status
      });
    } catch (error) {
      console.error('Error fetching patient details:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-gray-500">Loading appointments...</div>
      </div>
    );
  }

  const uniquePatients = new Set(appointments.map(apt => apt.patient_id));
  const patientCount = uniquePatients.size;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <motion.div variants={itemVariants} className="text-center">
        <h1 className="text-3xl font-heading font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Patient Appointments
        </h1>
        <p className="text-gray-600 mt-2">Manage and view all patient appointments</p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="size-5 text-purple-600" />
              Appointment Overview
              <Badge className="bg-purple-100 text-purple-800 ml-auto">
                {patientCount} Patients Registered
              </Badge>
            </CardTitle>
            <CardDescription>
              Total appointments: {appointments.length}
            </CardDescription>
          </CardHeader>
        </Card>
      </motion.div>

      {appointments.length === 0 ? (
        <motion.div variants={itemVariants}>
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="text-center py-12">
              <Calendar className="size-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Appointments Yet</h3>
              <p className="text-gray-500">Patient appointments will appear here once they book</p>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div variants={containerVariants} className="space-y-4">
          {appointments.map((appointment) => (
            <motion.div key={appointment.id} variants={itemVariants}>
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <User className="size-5 text-blue-600" />
                        {appointment.patient_name}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        Username: {appointment.username}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </Badge>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fetchPatientDetails(appointment.patient_id)}
                          >
                            <Eye className="size-4 mr-2" />
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white/90 backdrop-blur">
                          <DialogHeader>
                            <DialogTitle>Patient Details</DialogTitle>
                            <DialogDescription>
                              Complete information about the patient
                            </DialogDescription>
                          </DialogHeader>
                          {selectedPatient && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium text-gray-600">Name</label>
                                  <p className="text-gray-900">{selectedPatient.name}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-600">Username</label>
                                  <p className="text-gray-900">{selectedPatient.username}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-600">Patient ID</label>
                                  <p className="text-gray-900 font-mono text-sm">{selectedPatient.id}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-600">Status</label>
                                  <Badge className={getStatusColor(selectedPatient.status)}>
                                    {selectedPatient.status}
                                  </Badge>
                                </div>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-600">Appointment Details</label>
                                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg mt-1">
                                  {selectedPatient.details}
                                </p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-600">Appointment Date & Time</label>
                                <p className="text-gray-900">
                                  {formatDate(selectedPatient.appointmentDate)} at {formatTime(selectedPatient.appointmentDate)}
                                </p>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="size-4" />
                        <span>{formatDate(appointment.appointment_date)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="size-4" />
                        <span>{formatTime(appointment.appointment_date)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="size-4" />
                        <span>Healthcare Center</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Reason for Visit</h4>
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                        {appointment.details}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default DoctorAppointments;