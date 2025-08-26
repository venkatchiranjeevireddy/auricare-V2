import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, TrendingUp, Calendar, Activity, Eye } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useRoleAuth } from '@/hooks/useRoleAuth';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Patient {
  patient_id: string;
  patient_name: string;
  username: string;
  lastAppointment: string;
  status: string;
  totalAppointments: number;
  details: string;
}

const DoctorPatients = () => {
  const { user } = useRoleAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  // Mock progress data for demonstration
  const mockProgressData = [
    { week: 'Week 1', healthScore: 65, symptoms: 4 },
    { week: 'Week 2', healthScore: 70, symptoms: 3 },
    { week: 'Week 3', healthScore: 75, symptoms: 3 },
    { week: 'Week 4', healthScore: 80, symptoms: 2 },
    { week: 'Week 5', healthScore: 85, symptoms: 1 },
    { week: 'Week 6', healthScore: 88, symptoms: 1 },
  ];

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const { data: appointments, error } = await supabase
        .from('appointments')
        .select(`
          family_id,
          appointment_date,
          status,
          notes
        `)
        .order('appointment_date', { ascending: false });

      if (error) throw error;

      // Group by family_id to get unique patients
      const uniquePatients = appointments?.reduce((acc: Patient[], appointment) => {
        const existingPatient = acc.find(p => p.patient_id === appointment.family_id);
        if (!existingPatient) {
          acc.push({
            patient_id: appointment.family_id,
            patient_name: 'Patient', // We'll need to fetch from profiles
            username: 'user', // We'll need to fetch from profiles
            lastAppointment: appointment.appointment_date,
            status: appointment.status || 'pending',
            totalAppointments: 1,
            details: appointment.notes || 'No details available'
          });
        } else {
          existingPatient.totalAppointments += 1;
        }
        return acc;
      }, []) || [];

      setPatients(uniquePatients);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewProgress = (patient: any) => {
    setSelectedPatient({
      ...patient,
      progressData: mockProgressData,
      currentHealthScore: 88,
      improvement: '+23%',
      lastVisit: patient.lastAppointment
    });
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
        <div className="animate-pulse text-gray-500">Loading patients...</div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <motion.div variants={itemVariants} className="text-center">
        <h1 className="text-3xl font-heading font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Patient Progress Tracker
        </h1>
        <p className="text-gray-600 mt-2">Monitor patient health and treatment progress</p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="size-5 text-purple-600" />
              Patient Overview
              <Badge className="bg-purple-100 text-purple-800 ml-auto">
                {patients.length} Active Patients
              </Badge>
            </CardTitle>
            <CardDescription>
              Track and monitor patient progress across all treatments
            </CardDescription>
          </CardHeader>
        </Card>
      </motion.div>

      {patients.length === 0 ? (
        <motion.div variants={itemVariants}>
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="text-center py-12">
              <Users className="size-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Patients Yet</h3>
              <p className="text-gray-500">Patient data will appear here once appointments are booked</p>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div variants={containerVariants} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {patients.map((patient) => (
            <motion.div key={patient.patient_id} variants={itemVariants}>
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{patient.patient_name}</CardTitle>
                      <CardDescription>@{patient.username}</CardDescription>
                    </div>
                    <Badge className={getStatusColor(patient.status)}>
                      {patient.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Total Appointments:</span>
                      <span className="font-semibold">{patient.totalAppointments}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Last Visit:</span>
                      <span className="font-semibold">
                        {new Date(patient.lastAppointment).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Health Score:</span>
                      <span className="font-semibold text-green-600">88%</span>
                    </div>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          className="w-full mt-4"
                          onClick={() => handleViewProgress(patient)}
                        >
                          <TrendingUp className="size-4 mr-2" />
                          View Progress
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-white/90 backdrop-blur max-w-4xl">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <Activity className="size-5 text-purple-600" />
                            {selectedPatient?.patient_name} - Progress Report
                          </DialogTitle>
                          <DialogDescription>
                            Weekly health progress and treatment outcomes
                          </DialogDescription>
                        </DialogHeader>
                        {selectedPatient && (
                          <div className="space-y-6">
                            <div className="grid grid-cols-3 gap-4">
                              <Card>
                                <CardContent className="pt-4">
                                  <div className="text-2xl font-bold text-green-600">
                                    {selectedPatient.currentHealthScore}%
                                  </div>
                                  <p className="text-sm text-gray-600">Current Health Score</p>
                                </CardContent>
                              </Card>
                              <Card>
                                <CardContent className="pt-4">
                                  <div className="text-2xl font-bold text-blue-600">
                                    {selectedPatient.improvement}
                                  </div>
                                  <p className="text-sm text-gray-600">Improvement</p>
                                </CardContent>
                              </Card>
                              <Card>
                                <CardContent className="pt-4">
                                  <div className="text-2xl font-bold text-purple-600">
                                    {selectedPatient.totalAppointments}
                                  </div>
                                  <p className="text-sm text-gray-600">Total Sessions</p>
                                </CardContent>
                              </Card>
                            </div>
                            
                            <Card>
                              <CardHeader>
                                <CardTitle className="text-lg">Weekly Progress Chart</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="h-64">
                                  <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={selectedPatient.progressData}>
                                      <CartesianGrid strokeDasharray="3 3" />
                                      <XAxis dataKey="week" />
                                      <YAxis />
                                      <Tooltip />
                                      <Line 
                                        type="monotone" 
                                        dataKey="healthScore" 
                                        stroke="#16a34a" 
                                        strokeWidth={3}
                                        name="Health Score"
                                      />
                                      <Line 
                                        type="monotone" 
                                        dataKey="symptoms" 
                                        stroke="#dc2626" 
                                        strokeWidth={3}
                                        name="Symptom Count"
                                      />
                                    </LineChart>
                                  </ResponsiveContainer>
                                </div>
                              </CardContent>
                            </Card>

                            <Card>
                              <CardHeader>
                                <CardTitle className="text-lg">Treatment Notes</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                                  {selectedPatient.details || 'No additional treatment notes available.'}
                                </p>
                              </CardContent>
                            </Card>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
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

export default DoctorPatients;