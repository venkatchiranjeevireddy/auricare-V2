import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, User, Plus, CalendarCheck } from 'lucide-react';
import { useRoleAuth } from '@/hooks/useRoleAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const DoctorSchedule = () => {
  const { user } = useRoleAuth();
  const [patients, setPatients] = useState<any[]>([]);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    patientId: '',
    title: '',
    description: '',
    scheduleDate: '',
    time: '',
  });

  useEffect(() => {
    fetchPatients();
    fetchSchedules();
  }, []);

  const fetchPatients = async () => {
    try {
      const { data: appointments, error } = await supabase
        .from('appointments')
        .select('patient_id, patient_name, username')
        .order('patient_name');

      if (error) throw error;

      // Get unique patients
      const uniquePatients = appointments?.reduce((acc: any[], appointment) => {
        const existingPatient = acc.find(p => p.patient_id === appointment.patient_id);
        if (!existingPatient) {
          acc.push({
            patient_id: appointment.patient_id,
            patient_name: appointment.patient_name,
            username: appointment.username,
          });
        }
        return acc;
      }, []) || [];

      setPatients(uniquePatients);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const fetchSchedules = async () => {
    try {
      // In a real implementation, you would have a schedules table
      // For now, we'll use mock data
      setSchedules([
        {
          id: '1',
          patient_name: 'John Doe',
          title: 'Physical Therapy Session',
          description: 'Lower back strengthening exercises',
          schedule_date: '2024-01-20',
          time: '10:00',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          patient_name: 'Jane Smith',
          title: 'Medication Review',
          description: 'Review current medications and adjust dosage',
          schedule_date: '2024-01-22',
          time: '14:30',
          created_at: new Date().toISOString()
        }
      ]);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const selectedPatient = patients.find(p => p.patient_id === formData.patientId);
      
      if (!selectedPatient) {
        throw new Error('Please select a patient');
      }

      // In a real implementation, you would save to a schedules table
      const newSchedule = {
        id: Date.now().toString(),
        patient_id: formData.patientId,
        patient_name: selectedPatient.patient_name,
        doctor_id: user?.id,
        title: formData.title,
        description: formData.description,
        schedule_date: formData.scheduleDate,
        time: formData.time,
        created_at: new Date().toISOString()
      };

      // For demo purposes, add to local state
      setSchedules(prev => [newSchedule, ...prev]);

      toast({
        title: 'Schedule Created!',
        description: `Schedule assigned to ${selectedPatient.patient_name} for ${formData.scheduleDate} at ${formData.time}`,
      });

      // Reset form
      setFormData({
        patientId: '',
        title: '',
        description: '',
        scheduleDate: '',
        time: '',
      });

    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create schedule',
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
      className="space-y-8"
    >
      <motion.div variants={itemVariants} className="text-center">
        <h1 className="text-3xl font-heading font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Patient Schedule Management
        </h1>
        <p className="text-gray-600 mt-2">Create and manage treatment schedules for your patients</p>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-2">
        <motion.div variants={itemVariants}>
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="size-5 text-purple-600" />
                Create New Schedule
              </CardTitle>
              <CardDescription>
                Assign a treatment schedule to a specific patient
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="patient">Select Patient</Label>
                  <Select value={formData.patientId} onValueChange={(value) => setFormData({ ...formData, patientId: value })}>
                    <SelectTrigger className="bg-white/50">
                      <SelectValue placeholder="Choose a patient" />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.map((patient) => (
                        <SelectItem key={patient.patient_id} value={patient.patient_id}>
                          <div className="flex items-center gap-2">
                            <User className="size-4" />
                            {patient.patient_name} (@{patient.username})
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Schedule Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Physical Therapy Session"
                    className="bg-white/50"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the treatment plan or activities..."
                    className="bg-white/50 min-h-[100px]"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="scheduleDate">Date</Label>
                    <Input
                      id="scheduleDate"
                      type="date"
                      value={formData.scheduleDate}
                      onChange={(e) => setFormData({ ...formData, scheduleDate: e.target.value })}
                      className="bg-white/50"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="bg-white/50"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  disabled={loading}
                >
                  {loading ? 'Creating Schedule...' : 'Create Schedule'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarCheck className="size-5 text-green-600" />
                Active Schedules
              </CardTitle>
              <CardDescription>
                Recently created patient schedules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {schedules.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="size-12 mx-auto mb-4 opacity-50" />
                    <p>No schedules created yet</p>
                    <p className="text-sm mt-2">Created schedules will appear here</p>
                  </div>
                ) : (
                  schedules.map((schedule) => (
                    <motion.div
                      key={schedule.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-purple-800">{schedule.title}</h4>
                        <div className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded">
                          {schedule.patient_name}
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mb-3">{schedule.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="size-3" />
                          {new Date(schedule.schedule_date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="size-3" />
                          {schedule.time}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DoctorSchedule;