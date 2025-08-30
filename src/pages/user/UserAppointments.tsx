import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, User, Plus, CheckCircle } from 'lucide-react';
import { useRoleAuth } from '@/hooks/useRoleAuth';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Appointment {
  id: string;
  appointment_date: string;
  notes: string;
  status: string;
  created_at: string;
}

const UserAppointments = () => {
  const { user } = useRoleAuth();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [formData, setFormData] = useState({
    patientName: user?.user_metadata?.first_name + ' ' + user?.user_metadata?.last_name || '',
    username: user?.user_metadata?.username || user?.email?.split('@')[0] || '',
    details: '',
    appointmentDate: '',
    appointmentTime: ''
  });
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    if (user) {
      fetchAppointments();
      // Update form data when user is available
      setFormData(prev => ({
        ...prev,
        patientName: user?.user_metadata?.first_name + ' ' + user?.user_metadata?.last_name || '',
        username: user?.user_metadata?.username || user?.email?.split('@')[0] || ''
      }));
    }
  }, [user]);

  const fetchAppointments = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('family_id', user.id)
        .order('appointment_date', { ascending: true });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create patient record if it doesn't exist
      const { data: existingPatient } = await supabase
        .from('patients')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (!existingPatient) {
        const { error: patientError } = await supabase
          .from('patients')
          .insert([{
            user_id: user?.id,
            patient_name: formData.patientName,
            username: formData.username,
            medical_history: 'General consultation'
          }]);

        if (patientError) {
          console.error('Error creating patient record:', patientError);
        }
      }

      const appointmentData = {
        family_id: user?.id,
        therapist_id: user?.id, // For demo purposes, using same user
        appointment_date: `${formData.appointmentDate}T${formData.appointmentTime}:00`,
        notes: formData.details,
        status: 'pending'
      };

      const { data, error } = await supabase
        .from('appointments')
        .insert([appointmentData])
        .select()
        .single();

      if (error) throw error;

      // Add to local state
      setAppointments(prev => [...prev, data]);

      toast({
        title: 'Appointment Booked!',
        description: `Your appointment has been scheduled for ${formData.appointmentDate} at ${formData.appointmentTime}`,
      });

      // Reset form
      setFormData({
        patientName: user?.user_metadata?.first_name + ' ' + user?.user_metadata?.last_name || '',
        username: user?.user_metadata?.username || user?.email?.split('@')[0] || '',
        details: '',
        appointmentDate: '',
        appointmentTime: ''
      });

    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to book appointment',
        variant: 'destructive',
      });
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
      className="max-w-4xl mx-auto space-y-8"
    >
      <motion.div variants={itemVariants} className="text-center">
        <h1 className="text-3xl font-heading font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Book Appointment
        </h1>
        <p className="text-gray-600 mt-2">Schedule your healthcare appointment</p>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-2">
        <motion.div variants={itemVariants}>
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="size-5 text-blue-600" />
                New Appointment
              </CardTitle>
              <CardDescription>
                Fill in your details to book an appointment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="patientName">Patient Name</Label>
                    <Input
                      id="patientName"
                      value={formData.patientName}
                      onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                      className="bg-white/50"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="bg-white/50"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="appointmentDate">Appointment Date</Label>
                    <Input
                      id="appointmentDate"
                      type="date"
                      value={formData.appointmentDate}
                      onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                      className="bg-white/50"
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="appointmentTime">Appointment Time</Label>
                    <Input
                      id="appointmentTime"
                      type="time"
                      value={formData.appointmentTime}
                      onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
                      className="bg-white/50"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="details">Details / Reason for Visit</Label>
                  <Textarea
                    id="details"
                    value={formData.details}
                    onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                    placeholder="Please describe your symptoms or reason for the appointment..."
                    className="bg-white/50 min-h-[100px]"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  disabled={loading}
                >
                  {loading ? 'Booking...' : 'Book Appointment'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="size-5 text-green-600" />
                Your Appointments
              </CardTitle>
              <CardDescription>
                {fetchLoading ? 'Loading...' : `${appointments.length} appointments scheduled`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {fetchLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              ) : appointments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="size-12 mx-auto mb-4 opacity-50" />
                  <p>No appointments scheduled</p>
                  <p className="text-sm mt-2">Your booked appointments will appear here</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {appointments.map((appointment) => (
                    <motion.div
                      key={appointment.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-blue-800">Healthcare Appointment</h4>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="size-4 text-green-600" />
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {appointment.status}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mb-3">{appointment.notes}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="size-3" />
                          {new Date(appointment.appointment_date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="size-3" />
                          {new Date(appointment.appointment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default UserAppointments;