import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlayCircle, Upload, Video, BookOpen, Plus, Eye } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const DoctorLearning = () => {
  const [videos, setVideos] = useState([
    {
      id: '1',
      title: 'Patient Communication Techniques',
      description: 'Learn effective communication strategies for better patient interactions',
      category: 'Communication',
      duration: '15:30',
      thumbnail: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=400',
      uploadDate: '2024-01-15',
      views: 45
    },
    {
      id: '2',
      title: 'Advanced Diagnostic Procedures',
      description: 'Step-by-step guide to modern diagnostic techniques',
      category: 'Medical Procedures',
      duration: '22:45',
      thumbnail: 'https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&w=400',
      uploadDate: '2024-01-12',
      views: 67
    },
    {
      id: '3',
      title: 'Emergency Response Protocols',
      description: 'Critical procedures for handling medical emergencies',
      category: 'Emergency Care',
      duration: '18:20',
      thumbnail: 'https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=400',
      uploadDate: '2024-01-10',
      views: 89
    }
  ]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    videoUrl: '',
    duration: ''
  });

  const [loading, setLoading] = useState(false);

  const categories = [
    'Communication',
    'Medical Procedures',
    'Emergency Care',
    'Patient Care',
    'Technology',
    'Research'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const newVideo = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        category: formData.category,
        duration: formData.duration,
        thumbnail: 'https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&w=400',
        uploadDate: new Date().toISOString().split('T')[0],
        views: 0,
        videoUrl: formData.videoUrl
      };

      setVideos(prev => [newVideo, ...prev]);

      toast({
        title: 'Video Uploaded!',
        description: `"${formData.title}" has been added to the learning hub`,
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        videoUrl: '',
        duration: ''
      });

    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to upload video',
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
          Learning Hub Management
        </h1>
        <p className="text-gray-600 mt-2">Upload and manage training videos for medical staff</p>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-3">
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="size-5 text-purple-600" />
                Upload New Video
              </CardTitle>
              <CardDescription>
                Add training content to the learning hub
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Video Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter video title"
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
                    placeholder="Describe the video content..."
                    className="bg-white/50 min-h-[80px]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger className="bg-white/50">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="videoUrl">Video URL</Label>
                  <Input
                    id="videoUrl"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    placeholder="https://youtube.com/watch?v=..."
                    className="bg-white/50"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (mm:ss)</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="15:30"
                    className="bg-white/50"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  disabled={loading}
                >
                  {loading ? 'Uploading...' : 'Upload Video'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="size-5 text-green-600" />
                Training Videos Library
              </CardTitle>
              <CardDescription>
                Manage your uploaded training content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                {videos.map((video) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="group relative overflow-hidden rounded-lg bg-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="relative">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <PlayCircle className="size-12 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {video.duration}
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                          {video.category}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Eye className="size-3" />
                          {video.views}
                        </div>
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {video.title}
                      </h3>
                      
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {video.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Uploaded: {new Date(video.uploadDate).toLocaleDateString()}</span>
                        <Button size="sm" variant="outline">
                          <Video className="size-3 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DoctorLearning;