import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlayCircle, Upload, Video, BookOpen, Plus, Eye, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useRoleAuth } from '@/hooks/useRoleAuth';
import { supabase } from '@/integrations/supabase/client';

interface LearningVideo {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  thumbnail_url: string;
  uploadDate: string;
  views: number;
  video_url: string;
}

const DoctorLearning = () => {
  const { user } = useRoleAuth();
  const [videos, setVideos] = useState<LearningVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    videoUrl: '',
    duration: ''
  });

  const categories = [
    'Communication',
    'Medical Procedures',
    'Emergency Care',
    'Patient Care',
    'Technology',
    'Research'
  ];

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('learning_videos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedVideos = (data || []).map(video => ({
        id: video.id,
        title: video.title,
        description: video.description,
        category: video.category,
        duration: video.duration,
        thumbnail_url: video.thumbnail_url || 'https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&w=400',
        uploadDate: video.created_at.split('T')[0],
        views: video.views || 0,
        video_url: video.video_url
      }));

      if (transformedVideos.length === 0) {
        // Add some sample videos if none exist
        const sampleVideos = [
          {
            id: 'sample1',
            title: 'Introduction to Patient Care',
            description: 'Basic principles of patient care and communication',
            category: 'Patient Care',
            duration: '15:30',
            thumbnail_url: 'https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&w=400',
            uploadDate: new Date().toISOString().split('T')[0],
            views: 45,
            video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
          },
          {
            id: 'sample2',
            title: 'Emergency Response Protocols',
            description: 'Step-by-step guide for handling medical emergencies',
            category: 'Emergency Care',
            duration: '22:15',
            thumbnail_url: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=400',
            uploadDate: new Date().toISOString().split('T')[0],
            views: 78,
            video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
          }
        ];
        setVideos(sampleVideos);
      } else {
        setVideos(transformedVideos);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('learning_videos')
        .insert([{
          title: formData.title,
          description: formData.description,
          category: formData.category,
          video_url: formData.videoUrl,
          duration: formData.duration,
          uploaded_by: user?.id,
          thumbnail_url: 'https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&w=400',
          views: 0
        }])
        .select()
        .single();

      if (error) throw error;

      const newVideo: LearningVideo = {
        id: data.id,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        duration: formData.duration,
        thumbnail_url: data.thumbnail_url,
        uploadDate: data.created_at.split('T')[0],
        views: 0,
        video_url: data.video_url
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

  const deleteVideo = async (videoId: string) => {
    try {
      const { error } = await supabase
        .from('learning_videos')
        .delete()
        .eq('id', videoId);

      if (error) throw error;

      setVideos(prev => prev.filter(v => v.id !== videoId));
      
      toast({
        title: 'Video Deleted',
        description: 'The video has been removed from the learning hub',
      });

    } catch (error) {
      console.error('Error deleting video:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete video',
        variant: 'destructive',
      });
    }
  };

  const incrementViews = async (videoId: string) => {
    try {
      const { error } = await supabase
        .from('learning_videos')
        .update({ views: videos.find(v => v.id === videoId)?.views + 1 || 1 })
        .eq('id', videoId);

      if (error) throw error;

      setVideos(prev => 
        prev.map(v => 
          v.id === videoId 
            ? { ...v, views: v.views + 1 }
            : v
        )
      );
    } catch (error) {
      console.error('Error updating views:', error);
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

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-gray-500">Loading learning hub...</div>
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
                <Badge className="bg-green-100 text-green-800 ml-auto">
                  {videos.length} Videos
                </Badge>
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
                        src={video.thumbnail_url}
                        alt={video.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <button 
                          onClick={() => {
                            incrementViews(video.id);
                            window.open(video.video_url, '_blank');
                          }}
                          className="flex items-center justify-center"
                        >
                          <PlayCircle className="size-12 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />
                        </button>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {video.duration}
                      </div>
                      <div className="absolute top-2 right-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteVideo(video.id)}
                          className="h-6 w-6 p-0 bg-red-500/80 border-red-600 hover:bg-red-600"
                        >
                          <Trash2 className="size-3 text-white" />
                        </Button>
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
                        <Button size="sm" variant="outline" asChild>
                          <a 
                            href={video.video_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            onClick={() => incrementViews(video.id)}
                          >
                            <Video className="size-3 mr-1" />
                            View
                          </a>
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {videos.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Video className="size-16 mx-auto mb-4 opacity-50" />
                  <p>No training videos uploaded yet</p>
                  <p className="text-sm mt-2">Upload your first video to get started</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DoctorLearning;