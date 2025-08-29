import {useState, useEffect} from "react";
import {motion} from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {Calendar, Clock, Plus} from "lucide-react";
import {useRoleAuth} from "@/hooks/useRoleAuth";
import {toast} from "@/hooks/use-toast";
import {supabase} from "@/integrations/supabase/client";

const UserAppointments = () => {
  const {user} = useRoleAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    patientName:
      user?.user_metadata?.first_name + " " + user?.user_metadata?.last_name ||
      "",
    username: user?.user_metadata?.username || "",
    details: "",
    appointmentDate: "",
    appointmentTime: "",
  });
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    fetchAppointments();
  }, [user]);

  const fetchAppointments = async () => {
    if (!user) return;

    try {
<<<<<<< HEAD
      const {data, error} = await supabase
        .from("appointments")
        .select("*")
        .eq("family_id", user.id)
        .order("appointment_date", {ascending: true});
=======
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('family_id', user.id)
        .order('appointment_date', { ascending: true });
>>>>>>> e0c8ab8bdd9c24f022847a8a3147ab01e7386102

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
<<<<<<< HEAD
      console.error("Error fetching appointments:", error);
=======
      console.error('Error fetching appointments:', error);
>>>>>>> e0c8ab8bdd9c24f022847a8a3147ab01e7386102
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const appointmentData = {
        family_id: user?.id,
        therapist_id: user?.id, // Using same user as demo
        appointment_date: `${formData.appointmentDate}T${formData.appointmentTime}:00`,
        notes: formData.details,
        status: "pending",
      };

      const {error} = await supabase
        .from("appointments")
        .insert([appointmentData]);

      if (error) throw error;

      toast({
        title: "Appointment Booked!",
        description: `Your appointment has been scheduled for ${formData.appointmentDate} at ${formData.appointmentTime}`,
      });

      setFormData({
        patientName:
          user?.user_metadata?.first_name +
            " " +
            user?.user_metadata?.last_name || "",
        username: user?.user_metadata?.username || "",
        details: "",
        appointmentDate: "",
        appointmentTime: "",
      });

      fetchAppointments();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to book appointment",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.5}}
      className="max-w-2xl mx-auto space-y-8"
    >
      <div className="text-center">
        <h1 className="text-3xl font-heading font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Book Appointment
        </h1>
        <p className="text-gray-600 mt-2">
          Schedule your healthcare appointment
        </p>
      </div>

      {/* Appointment Form */}
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
                  onChange={(e) =>
                    setFormData({...formData, patientName: e.target.value})
                  }
                  className="bg-white/50"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({...formData, username: e.target.value})
                  }
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
                  onChange={(e) =>
                    setFormData({...formData, appointmentDate: e.target.value})
                  }
                  className="bg-white/50"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="appointmentTime">Appointment Time</Label>
                <Input
                  id="appointmentTime"
                  type="time"
                  value={formData.appointmentTime}
                  onChange={(e) =>
                    setFormData({...formData, appointmentTime: e.target.value})
                  }
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
                onChange={(e) =>
                  setFormData({...formData, details: e.target.value})
                }
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
              {loading ? "Booking..." : "Book Appointment"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Appointment List */}
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="size-5 text-green-600" />
            Your Appointments
          </CardTitle>
        </CardHeader>
        <CardContent>
          {appointments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Clock className="size-12 mx-auto mb-4 opacity-50" />
              <p>No appointments scheduled</p>
<<<<<<< HEAD
              <p className="text-sm mt-2">
                Your booked appointments will appear here
              </p>
=======
              <p className="text-sm mt-2">Your booked appointments will appear here</p>
>>>>>>> e0c8ab8bdd9c24f022847a8a3147ab01e7386102
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => (
<<<<<<< HEAD
                <div
                  key={appointment.id}
                  className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">Healthcare Appointment</h4>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        appointment.status === "confirmed"
                          ? "bg-green-100 text-green-800"
                          : appointment.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">
                    {appointment.notes}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="size-3" />
                      {new Date(
                        appointment.appointment_date
                      ).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="size-3" />
                      {new Date(
                        appointment.appointment_date
                      ).toLocaleTimeString()}
=======
                <div key={appointment.id} className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">Healthcare Appointment</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {appointment.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">{appointment.notes}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="size-3" />
                      {new Date(appointment.appointment_date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="size-3" />
                      {new Date(appointment.appointment_date).toLocaleTimeString()}
>>>>>>> e0c8ab8bdd9c24f022847a8a3147ab01e7386102
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default UserAppointments;
